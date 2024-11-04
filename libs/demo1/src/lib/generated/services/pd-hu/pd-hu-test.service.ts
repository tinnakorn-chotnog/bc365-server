import { ModuleRef } from "@nestjs/core";
import { PdHuExtService } from "./pd-hu-ext.service";
import { HuTypeExtService } from "../hu-type";
import { groupBy } from "lodash";
import { PdHuType } from "../../interfaces/pd-hu-type.model";
import shortUUID from "short-uuid";
import { PdHu } from "../../interfaces/pd-hu.model";
import { PdHuTypeExtService } from "../pd-hu-type";

export class PdHuTestService extends PdHuExtService {

    get huTypeService() {
        return this.modRef.get<HuTypeExtService>(HuTypeExtService)
    }

    get pdHuTypeService() {
        return this.modRef.get<PdHuTypeExtService>(PdHuTypeExtService)
    }

    createTestData(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const huType = await this.huTypeService.getById(bid, { id: "wVpQmsjubFVpzjfxvFLBJH" })
                const pds = await this.pdService.get({ bid, brid });
                const pdUoms = await this.pdService.pdUomService.get({ bid, brid })
                const pdUomMap = groupBy(pdUoms, 'pdId');
                const whHus = await this.whHuService.get({ bid, brid});

                const pdHuTypes: PdHuType[] = [];
                pds.forEach( pd => {
                    const pdUom = pdUomMap[pd.pdId] [2];
                    const o: PdHuType = {
                        pdHuTypeId: shortUUID.generate(),
                        pdId: pd.pdId,
                        huTypeId: huType.huTypeId,
                        pdUomId: pdUom?.pdUomId,
                        qtyPerHu: 20,
                        bizId: bid
                    }
                    pdHuTypes.push(o);
                })

                const pdHus: PdHu[] = [];
                const pdId = "iUgggMLiR1xtPnkQzzvAQG";
                whHus.slice(0, 10).forEach( whHu => {
                    const pdUom = pdUomMap[pdId][2];
                    const o: PdHu = {
                        pdHuId: shortUUID.generate(),
                        pdId: pdId,
                        whHuId: whHu.whHuId,
                        pdUomId: pdUom.pdUomId,
                        suQty: 20,
                        ohQty: 20 * pdUom.cnvFactor,
                        bizId: bid
                    }
                    pdHus.push(o)
                } )

                await this.pdHuTypeService.addList({ bid, brid, data: pdHuTypes })
                await this.addList({ bid, brid, data: pdHus })

                console.log(this.huTypeService.service.dataSource)

                resolve('OK')
            } catch(e) {
                reject(e)
            } finally {
                await this.pdHuTypeService.flush();
                await this.flush();
            }
        })

    }

}
