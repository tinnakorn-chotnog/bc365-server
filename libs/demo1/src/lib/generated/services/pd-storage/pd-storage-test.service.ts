import { PdStorageExtService } from "./pd-storage-ext.service";

export class PdStorageTestService extends PdStorageExtService {

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

}
