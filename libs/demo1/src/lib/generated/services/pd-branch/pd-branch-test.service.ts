import { ModuleRef } from "@nestjs/core";
import { PdBranchExtService } from "./pd-branch-ext.service";

export class PdBranchTestService extends PdBranchExtService {

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

    syncQtyAllBranch(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const pdBranches = await this.get({ bid, brid, skipBridCheck: true });
                const res = await Promise.all(pdBranches.map( async pdBranch => {
                    const res = await this.syncQty({ bid, brid: pdBranch.branchId, pdBranch, cascading: true, persistOutside: false});
                    return res;
                }))
                await this.flush();
                await this.pdWhService.flush();
                await this.pdStorageService.flush();
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }


}
