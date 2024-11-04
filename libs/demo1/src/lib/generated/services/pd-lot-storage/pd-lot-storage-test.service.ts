import { PdLotStorageExtService } from "./pd-lot-storage-ext.service";

export class PdLotStorageTestService extends PdLotStorageExtService {

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
