import { WhSuService } from "./wh-su.service";
import { BeforeTriggerType } from "@bc365-server/common/services/db.interface";
import { WhStorageExtService } from "../wh-storage";
import { WhExtService } from "../wh/wh-ext.service";
import { WhSu } from "../../interfaces/wh-su.model";
import { SetParkWhParamsType } from "./wh-su.interface";
import { PdSuExtService } from "../pd-su";

export class WhSuExtService extends WhSuService {

    get whStorageService() {
        return this.modRef.get<WhStorageExtService>(WhStorageExtService)
    }

    get whService() {
        return this.modRef.get<WhExtService>(WhExtService)
    }

    override get pdSuService() {
        return this.modRef.get<PdSuExtService>(PdSuExtService)
    }

    override beforeInsert(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {
                const { bid, data, sharedClient } = params;

                if (!data.whId) {
                    throw new Error('Not provide warehouse')
                }

                if (!data.suNo) {
                    throw new Error('Not provide storage unit no')
                }

                const wh = await this.whService.getById(bid, { id: data.whId });

                const morphData = data as WhSu;

                if (!wh) {
                    throw new Error('Warehouse not found')
                }

                if (data.parentId) {
                    const parentWhSu = await this.whSuService.getById(bid, { id: data.parentId }, sharedClient)

                    if (!parentWhSu) {
                        throw new Error('Parent storage unit not found')
                    }
                    data.whId = parentWhSu.whId;
                    morphData.whStorageId = parentWhSu.whStorageId;
                    morphData.whZoneId = parentWhSu.whZoneId;
                    morphData.whAisleId = parentWhSu.whAisleId;
                    morphData.whRackId = parentWhSu.whRackId;
                    morphData.whShelfId = parentWhSu.whShelfId;

                    resolve(morphData)

                } else

                if (data.whStorageId) {

                    const whStorage = await this.whStorageService.getById(bid, { id: data.whStorageId }, sharedClient);

                    if (!whStorage) {
                        throw new Error('Storage not found')
                    }


                    morphData.whId = whStorage.whId;

                    morphData.whId = whStorage.whId;
                    morphData.whStorageId = whStorage.whStorageId;
                    morphData.whZoneId = whStorage.whZoneId;
                    morphData.whAisleId = whStorage.whAisleId;
                    morphData.whRackId = whStorage.whRackId;
                    morphData.whShelfId = whStorage.whShelfId;

                    resolve(morphData)

                } else {

                    resolve(data)

                }

            } catch(e) {
                reject(e)
            }
        })
    }

    override beforeUpdate(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {
                const beforeInsert = await this.beforeInsert(params);
                resolve(beforeInsert)
            } catch(e) {
                reject(e)
            }
        })
    }

    setParkWh(params: SetParkWhParamsType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, whSuId, whId, sharedClient } = params;

                if (!whSuId) {
                    throw new Error('Not provide storage unit #ID')
                }

                if (!whId) {
                    throw new Error('Not provide warehouse #ID')
                }

                const whSu = await this.getById(bid, { id:  whSuId }, sharedClient)

                if (!whSu) {
                    throw new Error('Storage unit not found')
                }

                if (whSu.whId === whId) {
                    throw new Error('Storage unit already part at the warehouse')
                }

                const wh = await this.whService.getById(bid, { id: whId}, sharedClient)

                if (!wh) {
                    throw new Error('Warehouse not found')
                }

                const morphData = whSu;

                morphData.whId = wh.whId;

                const pdSus = await this.pdSuService.get({ bid, brid, filter: { whSuId: whSuId }, sharedClient });

                const r = await this.pdSuService.transferToWh({ bid, brid, srcPdSuArray: pdSus , dstWhId: whId, sharedClient })

                const res = await this.update({ bid, brid, data: morphData, sharedClient})

                resolve(res)


            } catch(e) {
                reject(e)
            }
        });
    }

    setParkStorage(params: SetParkWhParamsType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, whSuId, whId, whStorageId, sharedClient } = params;

                let whSu: WhSu;

                if (whSuId) {
                    whSu = await this.getById(bid, { id:  whSuId }, sharedClient)
                    if (!whSu) {
                        throw new Error(`whSuId #${whSuId} not found.`)
                    }
                } else {
                    throw new Error('whSuId did not provided.')
                }

                const morphData = whSu;

                if (whStorageId) {

                    const whStorage = await this.whStorageService.getById(bid, { id: whStorageId }, sharedClient);
                    const pdSus = await this.pdSuService.get({ bid, brid, filter: { whSuId: whSuId }, sharedClient})

                    // SU not empty
                    if (pdSus && pdSus.length > 0) {

                    }

                    if (whStorage) {

                        morphData.whId = whStorage.whId;
                        morphData.whStorageId = whStorage.whStorageId;
                        morphData.whZoneId = whStorage.whZoneId;
                        morphData.whAisleId = whStorage.whAisleId;
                        morphData.whRackId = whStorage.whRackId;
                        morphData.whShelfId = whStorage.whShelfId;

                        const res = await this.update({ bid, brid, data: morphData, sharedClient})

                        resolve(res)
                    } else {
                        throw new Error(`Warehouse Storage ID #${whStorageId} not found.`)
                    }

                } else {

                    const wh = await this.whService.getById(bid, { id: whId }, sharedClient)

                    if (!wh) {
                        throw new Error(`whId #${whId} not found.`)
                    }

                    morphData.whId = wh.whId;

                    const res = await this.update({ bid, brid, data: morphData, sharedClient})

                    resolve(res)

                }

            } catch(e) {
                reject(e)
            }
        });
    }

}
