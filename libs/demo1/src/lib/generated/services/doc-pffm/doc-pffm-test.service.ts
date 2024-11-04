import { ModuleRef } from "@nestjs/core";
import { DocPffmExtService } from "./doc-pffm-ext.service";
import { keyBy } from "lodash";

export class DocPffmTestService extends DocPffmExtService {

    testBranchException(bid: string, brid: string, docPffmId: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const docPffm = await this.getById(bid, { id: docPffmId });
                if (!docPffm) {
                    throw new Error('Document not found')
                }
                const pickPds = docPffm.pd;
                const pdIds = pickPds.map( p => p.pdId );
                const pdBranches = await this.pdBranchService.get({ bid, brid, filter: { _in: { pdId: pdIds }}} );
                const pdBranchMap = keyBy(pdBranches, 'pdId');
                pickPds[0].orderedQty = pdBranchMap[pickPds[0].pdId].ohQty + 2;
                pickPds[1].orderedQty = pdBranchMap[pickPds[1].pdId].ohQty + 2;
                const res = await this.checkAvailabity({ bid, brid, docPffm })
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

}
