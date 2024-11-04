import { ModuleRef } from "@nestjs/core";
import { PdSuExtService } from "./pd-su-ext.service";
import shortUUID from "short-uuid";
import { SuTypeExtService } from "../su-type";
import { groupBy } from "lodash";
import { PdSu } from "../../interfaces/pd-su.model";
import { PdSuProfileExtService } from "../pd-su-profile";
import { PdSuProfile } from "../../interfaces/pd-su-profile.model";

export class PdSuTestService extends PdSuExtService {

    get suTypeService() {
        return this.modRef.get<SuTypeExtService>(SuTypeExtService)
    }

    get pdSuProfileService() {
        return this.modRef.get<PdSuProfileExtService>(PdSuProfileExtService)
    }

    createTestData(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {

            try {
                const suType = await this.suTypeService.getById(bid, { id: "wVpQmsjubFVpzjfxvFLBJH" })
                const pds = await this.pdService.get({ bid, brid });
                const pdUoms = await this.pdService.pdUomService.get({ bid, brid })
                const pdUomMap = groupBy(pdUoms, 'pdId');
                const whHus = await this.whSuService.get({ bid, brid});

                const pdSuTypes: PdSuProfile[] = [];
                pds.forEach( pd => {
                    const pdUom = pdUomMap[pd.pdId] [2];
                    const o: PdSuProfile = {
                        pdSuProfileId: shortUUID.generate(),
                        pdId: pd.pdId,
                        suTypeId: suType.suTypeId,
                        pdUomId: pdUom?.pdUomId,
                        qtyPerSu: 20,
                        bizId: bid
                    }
                    pdSuTypes.push(o);
                })

                const pdHus: PdSu[] = [];
                const pdId = "iUgggMLiR1xtPnkQzzvAQG";
                whHus.slice(0, 10).forEach( whHu => {
                    const pdUom = pdUomMap[pdId][2];
                    const o: PdSu = {
                        pdSuId: shortUUID.generate(),
                        pdId: pdId,
                        whSuId: whHu.whSuId,
                        pdUomId: pdUom.pdUomId,
                        suQty: 20,
                        ohQty: 20 * pdUom.cnvFactor,
                        bizId: bid
                    }
                    pdHus.push(o)
                } )

                await this.pdSuProfileService.addList({ bid, brid, data: pdSuTypes })
                await this.addList({ bid, brid, data: pdHus })

                console.log(this.suTypeService.service.dataSource)

                resolve('OK')
            } catch(e) {
                reject(e)
            } finally {
                await this.pdSuProfileService.flush();
                await this.flush();
            }
        })

    }

    updateWithTrigger(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const data = await this.get({ bid, brid });
                await this.updateList({ bid, brid, data, batch: true });
                await this.flush();
                resolve('ok')
            } catch(e) {
                reject(e)
            }
        })
    }

}
