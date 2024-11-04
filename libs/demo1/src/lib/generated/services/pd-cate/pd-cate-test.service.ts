import { ModuleRef } from "@nestjs/core";
import { PdCateExtService } from "./pd-cate-ext.service";
import { PdCate } from "../../interfaces/pd-cate.model";

export class PdCateTestService extends PdCateExtService {

    createTestData(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {

            try {
                const cates: PdCate[] = [
                    { pdCateId: this.service.generateId(), pdCateNo: '01', pdCateName: 'Cate 1'},
                    { pdCateId: this.service.generateId(), pdCateNo: '02', pdCateName: 'Cate 2'},
                    { pdCateId: this.service.generateId(), pdCateNo: '03', pdCateName: 'Cate 3'},
                    { pdCateId: this.service.generateId(), pdCateNo: '04', pdCateName: 'Cate 4'},
                    { pdCateId: this.service.generateId(), pdCateNo: '05', pdCateName: 'Cate 5'},
                    { pdCateId: this.service.generateId(), pdCateNo: '06', pdCateName: 'Cate 6'},
                    { pdCateId: this.service.generateId(), pdCateNo: '07', pdCateName: 'Cate 7'},
                    { pdCateId: this.service.generateId(), pdCateNo: '08', pdCateName: 'Cate 8'},
                    { pdCateId: this.service.generateId(), pdCateNo: '09', pdCateName: 'Cate 9'},
                    { pdCateId: this.service.generateId(), pdCateNo: '10', pdCateName: 'Cate 10'},
                ]

                await this.addList({ bid, brid, data: cates, batch: true });
                await this.flush();

                resolve(cates)

            } catch(e) {
                reject(e)
            }

        })
    }

}
