import { ModuleRef } from "@nestjs/core";
import { WhHuService } from "./wh-hu.service";
import { BeforeTriggerType } from "@bc365-server/common/services/db.interface";
import { WhStorageExtService } from "../wh-storage";
import { WhHu } from "../../interfaces/wh-hu.model";
import { WhHuMoveParamsType, WhHuMoveToHuParamsType } from "./wh-hu.interface";
import { WhExtService } from "../wh";

export class WhHuExtService extends WhHuService {

    get whStorageService() {
        return this.modRef.get<WhStorageExtService>(WhStorageExtService)
    }

    get whService() {
        return this.modRef.get<WhExtService>(WhExtService)
    }

    override beforeInsert(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {
                const { bid, data, sharedClient } = params;

                if (!data.whId) {
                    throw new Error('Not provide warehouse')
                }

                if (!data.huNo) {
                    throw new Error('Not provide handling unit no')
                }

                const wh = await this.whService.getById(bid, { id: data.whId });

                if (!wh) {
                    throw new Error('Warehouse not found')
                }

                if (data.whStorageId) {

                    const whStorage = await this.whStorageService.getById(bid, { id: data.whStorageId }, sharedClient);

                    if (!whStorage) {
                        throw new Error('Storage not found')
                    }

                    const morphData = data as WhHu;

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
                const { bid, data, sharedClient } = params;

                if (data.whStorageId) {

                    const whStorage = await this.whStorageService.getById(bid, { id: data.whStorageId }, sharedClient);

                    const morphData = data as WhHu;

                    if (whStorage) {
                        morphData.whId = whStorage.whId;

                        morphData.whId = whStorage.whId;
                        morphData.whStorageId = whStorage.whStorageId;
                        morphData.whZoneId = whStorage.whZoneId;
                        morphData.whAisleId = whStorage.whAisleId;
                        morphData.whRackId = whStorage.whRackId;
                        morphData.whShelfId = whStorage.whShelfId;

                        resolve(morphData)
                    } else {
                        throw new Error(`Warehouse Storage ID #${data.whStorageId} not found.`)
                    }

                } else {

                    resolve(data)

                }

            } catch(e) {
                reject(e)
            }
        })
    }

    move(params: WhHuMoveParamsType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, whHuId, whId, whStorageId, sharedClient } = params;

                let whHu: WhHu;

                if (whHuId) {
                    whHu = await this.getById(bid, { id:  whHuId }, sharedClient)
                    if (!whHu) {
                        throw new Error(`whHuId #${whHuId} not found.`)
                    }
                } else {
                    throw new Error('whHuId did not provided.')
                }

                const morphData = whHu;

                if (whStorageId) {

                    const whStorage = await this.whStorageService.getById(bid, { id: whStorageId }, sharedClient);


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

                    const wh = await this.whService.getById(bid, { id: whId })

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

    moveToHu(params: WhHuMoveToHuParamsType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, srcWhHuId, dstWhHuId, sharedClient } = params;

                let srcWhHu: WhHu;
                let dstWhHu: WhHu;

                if (srcWhHuId) {
                    srcWhHu = await this.getById(bid, { id:  srcWhHuId }, sharedClient)
                    if (!srcWhHu) {
                        throw new Error(`whHuId #${srcWhHuId} not found.`)
                    }
                } else {
                    throw new Error('whHuId did not provided.')
                }

                if (dstWhHuId) {
                    dstWhHu = await this.getById(bid, { id:  dstWhHuId }, sharedClient)
                    if (!srcWhHu) {
                        throw new Error(`whHuId #${dstWhHuId} not found.`)
                    }
                } else {
                    throw new Error('whHuId did not provided.')
                }

                if (srcWhHu && dstWhHu) {


                    const morphData = srcWhHu as WhHu;

                    morphData.whId = dstWhHu.whId;
                    morphData.whStorageId = dstWhHu.whStorageId;
                    morphData.whZoneId = dstWhHu.whZoneId;
                    morphData.whAisleId = dstWhHu.whAisleId;
                    morphData.whRackId = dstWhHu.whRackId;
                    morphData.whShelfId = dstWhHu.whShelfId;
                    morphData.parentHuId = dstWhHu.whHuId;

                    const res = await this.update({ bid, brid, data: morphData, sharedClient})

                    resolve(res)

                } else {
                    throw new Error('Invalid source or destination HU.')
                }

            } catch(e) {
                reject(e)
            }
        });
    }

}
