import { DocSoExtService } from "./doc-so-ext.service";
import { DocSo } from "../../interfaces/doc-so.model";
import { keyBy } from "lodash";
import { PdSalesInfo } from "../../interfaces/pd-sales-info.model";
import { CustExtService } from "../cust";

export class DocSoTestService extends DocSoExtService {

    get custService() {
        return this.modRef.get<CustExtService>(CustExtService)
    }

    createDocSo(bid: string, brid: string, whId: string) {
        return new Promise( async (resolve, reject) => {

            try {

                const pds = await this.pdService.get({ bid, brid, filter: { useLot: false } });

                const pdIds = pds.map( pd => pd.pdId)

                const pdMap = keyBy(pds, 'pdId');

                const pdWhs = await this.pdWhService.get({ bid, brid, filter: { _and: [ {whId: whId }, { _in: { pdId: pdIds } } ] } });

                const docSos: DocSo[] = Array.from({length: 100}, (_, index) => {
                    const i = index + 1;
                    const docSo: DocSo = {
                        docSoId: this.service.generateId(),
                        docNo: `SO${i.toString().padStart(6, '0')}`,
                        docDate: new Date().getTime(),
                        dueDate: new Date().getTime(),
                        custId: 'wpJFrzMjL3wFfSN7Xii3z7',
                        priority: Math.floor(Math.random() * 10).toString(),
                        allowPartialShipment: false,
                        allowPartialItemShipment: false,
                        whId: whId,
                        status: 'R'
                    }
                    const itemMap = {};
                    const lineCount = Math.max(1, Math.floor(Math.random() * 5));
                    const docSoItems = Array.from({length: lineCount}, (_, index) => {
                        let pIdx = Math.floor(Math.random() * pdWhs.length);
                        while (itemMap[pIdx]) {
                            pIdx = Math.floor(Math.random() * pdWhs.length);
                        }
                        itemMap[pIdx] = true;
                        const soItem: PdSalesInfo = {
                            itemId: this.service.generateId(),
                            pdId: pdWhs[pIdx].pdId,
                            orderedQty: Math.max(1, Math.floor(Math.random() * 12)),
                            deliveredQty: 0,
                            unitPrice: pdMap[pdWhs[pIdx].pdId].stdPrice || 10,
                            totalPrice: pdMap[pdWhs[pIdx].pdId].stdPrice || 10,
                            status: 'R'
                        }
                        return soItem;
                    })

                    docSo.items = docSoItems;

                    return docSo;
                });

                // console.log(JSON.stringify(docSos, null, 2))

                const res = await this.addList({ bid, brid, data: docSos, batch: true });

                await this.flush();

                resolve('res')

            } catch(e) {
                reject(e)
            }
        })
    }

    updatePartnerName(params: { bid: string; brid: string; }) {
        return new Promise( async (resolve, reject) => {
            try {
                const { bid, brid } = params;
                const custs = await this.custService.get({ bid, brid });
                const custMap = keyBy(custs, 'custId');
                const docSos = await this.get({ bid, brid });
                docSos.forEach( doc => {
                    const cust = custMap[doc.custId];
                    doc.partnerName = cust.custName
                })
                await this.updateList({ bid, brid, data: docSos, batch: true })
                await this.flush();
                resolve(docSos)
            } catch(e) {
                reject(e)
            }
        })
    }

}
