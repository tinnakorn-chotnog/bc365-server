import { ModuleRef } from "@nestjs/core";
import { PdSubcateExtService } from "./pd-subcate-ext.service";
import { PdCateExtService } from "../pd-cate";
import { PdSubcate } from "../../interfaces/pd-subcate.model";

export class PdSubcateTestService extends PdSubcateExtService {

    get pdCateService() {
        return this.modRef.get<PdCateExtService>(PdCateExtService)
    }

    createTestData(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {

            try {
                const pdCates = await this.pdCateService.get({ bid, brid });
                const pdSubcates: PdSubcate[] = [];

                pdCates.forEach( cate => {
                    const subcates: PdSubcate[] = [
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-01`, pdSubcateName: `Subcate ${cate.pdCateNo}-01`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-02`, pdSubcateName: `Subcate ${cate.pdCateNo}-02`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-03`, pdSubcateName: `Subcate ${cate.pdCateNo}-03`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-04`, pdSubcateName: `Subcate ${cate.pdCateNo}-04`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-05`, pdSubcateName: `Subcate ${cate.pdCateNo}-05`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-06`, pdSubcateName: `Subcate ${cate.pdCateNo}-06`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-07`, pdSubcateName: `Subcate ${cate.pdCateNo}-07`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-08`, pdSubcateName: `Subcate ${cate.pdCateNo}-08`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-09`, pdSubcateName: `Subcate ${cate.pdCateNo}-09`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-10`, pdSubcateName: `Subcate ${cate.pdCateNo}-10`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-11`, pdSubcateName: `Subcate ${cate.pdCateNo}-11`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-12`, pdSubcateName: `Subcate ${cate.pdCateNo}-12`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-13`, pdSubcateName: `Subcate ${cate.pdCateNo}-13`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-14`, pdSubcateName: `Subcate ${cate.pdCateNo}-14`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-15`, pdSubcateName: `Subcate ${cate.pdCateNo}-15`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-16`, pdSubcateName: `Subcate ${cate.pdCateNo}-16`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-17`, pdSubcateName: `Subcate ${cate.pdCateNo}-17`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-18`, pdSubcateName: `Subcate ${cate.pdCateNo}-18`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-19`, pdSubcateName: `Subcate ${cate.pdCateNo}-19`, pdCateId: cate.pdCateId },
                        { pdSubcateId: this.service.generateId(), pdSubcateNo: `${cate.pdCateNo}-20`, pdSubcateName: `Subcate ${cate.pdCateNo}-20`, pdCateId: cate.pdCateId },
                    ]

                    pdSubcates.push(...subcates)

                })

                await this.addList({ bid, brid, data: pdSubcates, batch: true });
                await this.flush();

                resolve(pdSubcates)

            } catch(e) {
                reject(e)
            }

        })
    }


}
