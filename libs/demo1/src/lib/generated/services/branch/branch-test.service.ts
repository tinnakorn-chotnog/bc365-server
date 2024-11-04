import { ModuleRef } from "@nestjs/core";
import { BranchExtService } from "./branch-ext.service";

export class BranchTestService extends BranchExtService {

    updateWithTrigger(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const data = await this.get({ bid, brid });
                data.forEach( b => {
                    b.inventoryPreference = {
                        applyHu: false,
                        applySu: false,
                        pickFromAvailableStorage: true
                    }
                })
                await this.updateList({ bid, brid, data, batch: true });
                await this.flush();
                resolve('ok')
            } catch(e) {
                reject(e)
            }
        })
    }

}
