import { ModuleRef } from "@nestjs/core";
import { DocTfoExtService } from "./doc-tfo-ext.service";
import { DocTfo } from "../../interfaces/doc-tfo.model";
import { RpnPlanExtService } from "../rpn-plan";

function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
    for (let i = 0; i < arr.length; i += n) {
      yield arr.slice(i, i + n);
    }
}

export class DocTfoTestService extends DocTfoExtService {


    get rpnPlanService() {
        return this.modRef.get<RpnPlanExtService>(RpnPlanExtService)
    }

    createS2SData(bid: string, brid: string, whId: string) {
        return new Promise( async (resolve, reject) => {

            try {
                const rpns = await this.rpnPlanService.get({ bid, brid, filter: { rpnSrc: 'S' }})

                const rpnChunks = [ ...chunks(rpns, 6) ]
                const s2s: DocTfo[] = [];
                let i = 1;
                rpnChunks.forEach( chunk => {
                    const tfo: DocTfo = {
                            docTfoId: this.service.generateId(),
                            docNo: 'TFO' + i.toString().padStart(4, '0'),
                            docDate: new Date().getTime(),
                            transferType: 'S2S',
                            whId: whId,
                            status: 'R',
                            items: chunk.map( c => {
                                return {
                                    pdId: c.pdId,
                                    qtyToTransfer: c.rpnQty,
                                    transferedQty: 0,
                                    dstStorageId: c.whStorageId,
                                    rpnZoneId: c.rpnZoneId,
                                    rpnAisleId: c.rpnAisleId,
                                    rpnRackId: c.rpnRackId,
                                    rpnShelfId: c.rpnShelfId,
                                    rpnStorageId: c.rpnStorageId
                                }
                            })
                    }
                    s2s.push(tfo)
                    i++;
                })


                await this.addList({ bid, brid, data: s2s, batch: true })
                await this.flush();

                resolve(s2s)

            } catch(e) {
                reject(e)
            }

        })
    }

}
