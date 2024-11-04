import { ModuleRef } from "@nestjs/core";
import { PdWhExtService } from "./pd-wh-ext.service";
import { groupBy, keyBy } from "lodash";

export class PdWhTestService extends PdWhExtService {

    updateWithTrigger(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const data = await this.get({ bid, brid, skipBridCheck: true });
                await this.updateList({ bid, brid, data, batch: true, skipBridCheck: true });
                await this.flush();
                resolve('ok')
            } catch(e) {
                reject(e)
            }
        })
    }

    syncAllQty(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const data = await this.get({ bid, brid, skipBridCheck: true });
                await Promise.all(data.map( async pdWh => {
                    await this.syncQty({ bid, brid: pdWh.branchId, pdWh, cascading: true, persistOutside: false });
                }))
                await this.flush();
                await this.pdStorageService.flush();
                resolve('ok')
            } catch(e) {
                reject(e)
            }
        })
    }

}
