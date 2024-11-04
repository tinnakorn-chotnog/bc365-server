import { ModuleRef } from "@nestjs/core";
import { DocPoService } from "./doc-po.service";
import { BeforeTriggerType } from "@bc365-server/common/services/db.interface";
import { CreateGrnParamsType } from "./doc-po.interface";
import { PdReceiveInfo } from "../../interfaces/pd-receive-info.model";
import shortUUID from "short-uuid";
import { DocGrn } from "../../interfaces/doc-grn.model";
import { DocGrnExtService } from "../doc-grn";
import { WhExtService } from "../wh";
import { WhStorageExtService } from "../wh-storage";
import { SuReceiveActionInfo } from "../../interfaces/su-receive-action-info.model";
import { SuppExtService } from "../supp";
import { DocPo } from "../../interfaces/doc-po.model";
import { BadRequestException } from "@nestjs/common";

export class DocPoExtService extends DocPoService {

    get docGrnService() {
        return this.modRef.get<DocGrnExtService>(DocGrnExtService)
    }

    get whService() {
        return this.modRef.get<WhExtService>(WhExtService)
    }

    get suppService() {
        return this.modRef.get<SuppExtService>(SuppExtService)
    }

    get whStorageService() {
        return this.modRef.get<WhStorageExtService>(WhStorageExtService)
    }

    override beforeInsert(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {
                const { bid, brid, data, sharedClient } = params;

                const morphData = data as DocPo;

                if (!morphData.suppId) {
                    throw new BadRequestException('Not provide supplier')
                }

                const supp = await this.suppService.getById(bid, { id: morphData.suppId }, sharedClient)

                if (!supp) {
                    throw new BadRequestException('Supplier not found')
                }

                morphData.refSuppName = supp.suppName;

                let subtotalAmt = 0;
                morphData.items.forEach( item => {
                    const unitPrice = item.unitPrice || 0;
                    const orderedQty = item.orderedQty || 0;
                    const totalPrice = unitPrice * orderedQty;
                    item.unitPrice = item.unitPrice || 0;
                    item.orderedQty = item.orderedQty || 0;
                    item.deliveredQty = 0;
                    item.invoicedQty = 0;
                    item.returnedQty = 0;
                    item.totalPrice = totalPrice;
                    subtotalAmt += totalPrice;
                })

                morphData.discAmt = morphData.discAmt || 0;
                morphData.whtAmt = morphData.whtAmt || 0;
                morphData.taxRate = 0.07
                morphData.subtotalAmt = subtotalAmt;
                morphData.taxAmt = subtotalAmt * morphData.taxRate;
                morphData.totalAmt = morphData.subtotalAmt + morphData.taxAmt;

                resolve(morphData)

            } catch(e) {
                reject(e)
            }
        })
    }

    beforeUpdate(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {
                const { bid, brid, data, sharedClient } = params;

                const morphData = data as DocPo;

                if (!morphData.suppId) {
                    throw new BadRequestException('Not provide supplier')
                }

                const supp = await this.suppService.getById(bid, { id: morphData.suppId})

                if (!supp) {
                    throw new BadRequestException('Supplier not found')
                }

                morphData.refSuppName = supp.suppName;

                resolve(morphData)

            } catch(e) {
                reject(e)
            }
        })
    }

}
