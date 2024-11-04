import { PdLotStorageService } from "./pd-lot-storage.service";
import { PdLotStorage } from "../../interfaces/pd-lot-storage.model";
import { PdLotExtService } from "../pd-lot/pd-lot-ext.service";
import { PdStorageExtService } from "../pd-storage";
import { PdWhExtService } from "../pd-wh";
import { PdExtService } from "../pd/pd-ext.service";
import { WhStorageExtService } from "../wh-storage";
import { PdLotStorageAdjustParamsType, PdLotStorageAllocateParamsType, PdLotStorageDeallocateParamsType, PdLotStorageDecreaseParamsType, PdLotStorageIncreaseParamsType, PdLotStorageMergeParamsType, PdLotStorageTransferParamsType } from "./pd-lot-storage.interface";
import { PoolClient } from "pg";
import shortUUID from "short-uuid";
import { BeforeTriggerType } from "@bc365-server/common/services/db.interface";
import { PdStorage } from "../../interfaces/pd-storage.model";

export class PdLotStorageExtService extends PdLotStorageService {

    get pdService() {
        return this.modRef.get<PdExtService>(PdExtService)
    }

    get pdWhService() {
        return this.modRef.get<PdWhExtService>(PdWhExtService)
    }

    get whStorageService() {
        return this.modRef.get<WhStorageExtService>(WhStorageExtService)
    }

    get pdLotService() {
        return this.modRef.get<PdLotExtService>(PdLotExtService);
    }

    get pdStorageService() {
        return this.modRef.get<PdStorageExtService>(PdStorageExtService);
    }

    getOrCreate(params: { bid: string; brid: string; pdLotId: string; pdStorageId: string; sharedClient?: any }) {
        return new Promise<PdLotStorage>( async (resolve, reject) => {
            try {
                const { bid, brid, pdLotId, pdStorageId, sharedClient } = params;

                let pdLotStorage: PdLotStorage = await this.getOne({ bid, brid, filter: { _and: [ {pdLotId: pdLotId}, {pdStorageId: pdStorageId}] }, sharedClient });

                if (pdLotStorage) {
                    resolve(pdLotStorage)
                } else {
                    const pdLot = await this.pdLotService.getById(bid, { id: pdLotId }, sharedClient);
                    if (!pdLot) {
                        throw new Error('Product lot not found')
                    }
                    const pdStorage = await this.pdStorageService.getById(bid, { id: pdStorageId}, sharedClient);
                    if (!pdStorage) {
                        throw new Error('Product storage not found')
                    }
                    pdLotStorage = {
                        pdLotStorageId: this.service.generateId(),
                        pdId: pdLot.pdId,
                        pdLotId: pdLot.pdLotId,
                        pdStorageId: pdStorageId,
                        ohQty: 0,
                        allocatedQty: 0
                    }
                    pdLotStorage = await this.add({ bid, brid, data: pdLotStorage, sharedClient})
                    resolve(pdLotStorage)
                }
            } catch(e) {
                reject(e)
            }
        })
    }

    override beforeInsert(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, data, sharedClient } = params;

                if (!data.pdLotId) {
                    throw new Error('Not provide product lot #ID')
                }

                if (!data.whStorageId && !data.pdStorageId) {
                    throw new Error('Not provide storage #ID/product storage #ID')
                }

                const morphData = data as PdLotStorage;

                let pdStorage: PdStorage;

                if (data.pdStorageId) {

                    pdStorage = await this.pdStorageService.getById(bid, { id: data.pdStorageId }, sharedClient);

                    if (!pdStorage) {
                        throw new Error('Product storage not found')
                    }

                } else
                if (data.whStorageId) {

                    pdStorage = await this.pdStorageService.getOne({ bid, brid, filter: { _and: [ {pdId: data.pdId}, {whStorageId: data.whStorageId }], sharedClient } });

                    if (!pdStorage) {
                        throw new Error('Product storage not found')
                    }

                }

                const pdLot = await this.pdLotService.getById(bid, { id: data.pdLotId })

                if (!pdLot) {
                    throw new Error('Product lot not found')
                }

                morphData.whId = pdStorage?.whId || null;
                morphData.whStorageId = pdStorage?.whStorageId || null;
                morphData.whZoneId = pdStorage?.whZoneId || null;
                morphData.whAisleId = pdStorage?.whAisleId || null;
                morphData.whRackId = pdStorage?.whRackId || null;
                morphData.whShelfId = pdStorage?.whShelfId || null;
                morphData.refLotNo = pdLot?.lotNo || null;
                morphData.refStorageNo = pdStorage?.refStorageNo || null;
                morphData.refPdNo = pdStorage?.refPdNo || null;
                morphData.refPdName = pdStorage?.refPdName || null;

                resolve(morphData)
            } catch(e) {
                reject(e)
            }
        })
    }

    override beforeUpdate(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, data, sharedClient } = params;

                if (data.pdStorageId) {

                    const pdStorage = await this.pdStorageService.getById(bid, { id: data.pdStorageId }, sharedClient);
                    const pdLot = await this.pdLotService.getById(bid, { id: data.pdLotId })

                    const morphData = data as PdLotStorage;

                    morphData.whId = pdStorage?.whId || null;
                    morphData.whStorageId = pdStorage?.whStorageId || null;
                    morphData.whZoneId = pdStorage?.whZoneId || null;
                    morphData.whAisleId = pdStorage?.whAisleId || null;
                    morphData.whRackId = pdStorage?.whRackId || null;
                    morphData.whShelfId = pdStorage?.whShelfId || null;
                    morphData.refLotNo = pdLot?.lotNo || null;
                    morphData.refStorageNo = pdStorage?.refStorageNo || null;
                    morphData.refPdNo = pdStorage?.refPdNo || null;
                    morphData.refPdName = pdStorage?.refPdName || null;

                    resolve(morphData)

                } else {
                    resolve(data)
                }

            } catch(e) {
                reject(e)
            }
        })
    }

    allocateQty(params: PdLotStorageAllocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdLotStorageId, qty, preloaded, bubble, sharedClient } = params;

                let pdLotStorage: PdLotStorage;

                if (preloaded && preloaded.pdLotStorageMap[pdLotStorageId]) {
                    pdLotStorage = preloaded.pdLotStorageMap[pdLotStorageId];
                } else {
                    pdLotStorage = await this.getById( bid, { id: pdLotStorageId }, sharedClient )
                }

                if (!pdLotStorage.ohQty || pdLotStorage.ohQty <= 0) {
                    throw new Error('No quantity for allocation.')
                }

                pdLotStorage.allocatedQty = pdLotStorage.allocatedQty || 0;

                const newQty = pdLotStorage.allocatedQty + qty;

                if (newQty > (pdLotStorage.ohQty - pdLotStorage.allocatedQty)) {
                    throw new Error(`Quantity can allocate ${(pdLotStorage.ohQty - pdLotStorage.allocatedQty)} of ${qty}. current on-hand: ${pdLotStorage.ohQty}, current allocated: ${pdLotStorage.allocatedQty}`)
                }

                await this.update({ bid, brid, data: { pdLotStorageId: pdLotStorage.pdLotStorageId, allocatedQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdLotService.allocateQty({ bid, brid, pdLotId: pdLotStorage.pdLotId, qty, preloaded, sharedClient })
                    await this.pdStorageService.allocateQty({ bid, brid, pdStorageId: pdLotStorage.pdStorageId, qty, preloaded, bubble, sharedClient })
                }

                const miniRec = {pdLotStorageId: pdLotStorage.pdLotStorageId, lastAllocatedQty: pdLotStorage.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    deallocateQty(params: PdLotStorageDeallocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdLotStorageId, qty, preloaded, bubble, sharedClient } = params;

                let pdLotStorage: PdLotStorage;

                if (preloaded && preloaded.pdLotStorageMap[pdLotStorageId]) {
                    pdLotStorage = preloaded.pdLotStorageMap[pdLotStorageId];
                } else {
                    pdLotStorage = await this.getById( bid, { id: pdLotStorageId }, sharedClient )
                }

                const newQty = pdLotStorage.allocatedQty - qty;

                if (!pdLotStorage.allowNegativeQty && newQty < 0) {
                    throw new Error('negative alstorageation not allowed.')
                }

                await this.update({ bid, brid, data: { pdLotStorageId: pdLotStorage.pdLotStorageId, qty, allocatedQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdLotService.deallocateQty({ bid, brid, pdLotId: pdLotStorage.pdLotId, qty, preloaded, sharedClient })
                    await this.pdStorageService.deallocateQty({ bid, brid, pdStorageId: pdLotStorage.pdStorageId, qty, preloaded, bubble, sharedClient })
                }

                const miniRec = {pdLotStorageId: pdLotStorage.pdLotStorageId, lastAllocatedQty: pdLotStorage.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    increaseQty(params: PdLotStorageIncreaseParamsType) {
        return new Promise<{ pdLotStorageId: string; refPdNo: string; refPdName: string; refLotNo: string; refStorageNo: string; lastQty: number; newQty: number; }>( async (resolve, reject) => {
            try {

                let { bid, brid, pdLotStorageId, qty, preloaded, bubble, bubbleLot, sharedClient } = params;

                let pdLotStorage: PdLotStorage;

                if (preloaded && preloaded.pdLotStorageMap[pdLotStorageId]) {
                    pdLotStorage = preloaded.pdLotStorageMap[pdLotStorageId];
                } else {
                    pdLotStorage = await this.getById( bid, { id: pdLotStorageId }, sharedClient )
                }

                const newQty = pdLotStorage.ohQty + qty;

                await this.update({ bid, brid, data: { pdLotStorageId: pdLotStorage.pdLotStorageId, ohQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdLotService.increaseQty({ bid, brid, pdLotId: pdLotStorage.pdLotId, qty, preloaded, sharedClient })
                    await this.pdStorageService.increaseQty({ bid, brid, pdStorageId: pdLotStorage.pdStorageId, qty, preloaded, bubble, sharedClient })
                }

                const miniRec = {pdLotStorageId: pdLotStorage.pdLotStorageId, refPdNo: pdLotStorage.refPdNo, refPdName: pdLotStorage.refPdName, refLotNo: pdLotStorage.refLotNo, refStorageNo: pdLotStorage.refStorageNo, lastQty: pdLotStorage.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    decreaseQty(params: PdLotStorageDecreaseParamsType) {
        return new Promise<{ pdLotStorageId: string; refPdNo: string; refPdName: string; refLotNo: string; refStorageNo: string; lastQty: number; newQty: number; }>( async (resolve, reject) => {
            try {

                let { bid, brid, pdLotStorageId, qty, preloaded, bubble, bubbleLot, sharedClient } = params;

                let pdLotStorage: PdLotStorage;

                if (preloaded && preloaded.pdLotStorageMap[pdLotStorageId]) {
                    pdLotStorage = preloaded.pdLotStorageMap[pdLotStorageId];
                } else {
                    pdLotStorage = await this.getById( bid, { id: pdLotStorageId }, sharedClient )
                }

                const newQty = pdLotStorage.ohQty - qty;

                if (!pdLotStorage.allowNegativeQty && newQty < 0) {
                    throw new Error('negative stock not allowed.')
                }

                await this.update({ bid, brid, data: { pdLotStorageId: pdLotStorage.pdLotStorageId, ohQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdLotService.decreaseQty({ bid, brid, pdLotId: pdLotStorage.pdLotId, qty, preloaded, sharedClient })
                    await this.pdStorageService.decreaseQty({ bid, brid, pdStorageId: pdLotStorage.pdStorageId, qty, preloaded, bubble, sharedClient })
                }

                const miniRec = {pdLotStorageId: pdLotStorage.pdLotStorageId, refPdNo: pdLotStorage.refPdNo, refPdName: pdLotStorage.refPdName, refLotNo: pdLotStorage.refLotNo, refStorageNo: pdLotStorage.refStorageNo, lastQty: pdLotStorage.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    adjustQty(params: PdLotStorageAdjustParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdLotStorageId, qty, preloaded, bubble, sharedClient } = params;

                let pdLotStorage: PdLotStorage;

                if (preloaded && preloaded.pdLotStorageMap[pdLotStorageId]) {
                    pdLotStorage = preloaded.pdLotStorageMap[pdLotStorageId];
                } else {
                    pdLotStorage = await this.getById( bid, { id: pdLotStorageId }, sharedClient )
                }

                let diffQty = 0;

                if (pdLotStorage.ohQty > qty) {
                    if (qty - pdLotStorage.allocatedQty < 0) {
                        throw new Error('available qty is less than quantity to adjust')
                    }
                }

                if (pdLotStorage.ohQty >= qty) {
                    diffQty = pdLotStorage.ohQty - qty;
                    const miniRec = await this.decreaseQty({ bid, brid, pdLotStorageId, qty: diffQty, preloaded, bubble, sharedClient });
                    resolve(miniRec)
                } else {
                    diffQty = qty - pdLotStorage.ohQty;
                    const miniRec = await this.increaseQty({ bid, brid, pdLotStorageId, qty: diffQty, preloaded, bubble, sharedClient });
                    resolve(miniRec)
                }

            } catch(e) {

                reject(e)

            }
        })
    }

    mergeLotQty(params: PdLotStorageMergeParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, srcPdLotStorageId, dstPdLotStorageId, qty, preloaded, sharedClient } = params;

                const srcData = await this.decreaseQty({ bid, brid, pdLotStorageId: srcPdLotStorageId, qty, preloaded, bubble: true, bubbleLot: true, sharedClient });

                const dstData = await this.increaseQty({ bid, brid, pdLotStorageId: dstPdLotStorageId, qty, preloaded, bubble: true, bubbleLot: true, sharedClient });

                const miniRec = {src: srcData, dst: dstData }

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    transferQty(params: PdLotStorageTransferParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, srcPdLotStorageId, dstPdLotStorageId, dstPdStorageId, qty, preloaded, bubble, sharedClient } = params;

                let srcPdLotStorage: PdLotStorage;
                let dstPdLotStorage: PdLotStorage;

                srcPdLotStorage = await this.getById(bid, { id: srcPdLotStorageId })


                if (!dstPdLotStorageId && dstPdStorageId) {
                    if (srcPdLotStorage) {
                        dstPdLotStorage = await this.getOne({ bid, brid, filter: { _and: [ { pdStorageId: dstPdStorageId }, { pdLotId: srcPdLotStorage.pdLotId} ] } })
                        if (dstPdLotStorage) {
                            dstPdLotStorageId = dstPdLotStorage.pdLotStorageId;
                        } else {
                            dstPdLotStorage = {
                                pdLotStorageId: shortUUID.generate(),
                                pdId: srcPdLotStorage.pdId,
                                pdLotId: srcPdLotStorage.pdLotId
                            }
                        }
                    }
                }

                const srcData = await this.decreaseQty({ bid, brid, pdLotStorageId: srcPdLotStorageId, qty, preloaded, bubble, bubbleLot: false, sharedClient });
                const dstData = await this.increaseQty({ bid, brid, pdLotStorageId: dstPdLotStorageId, qty, preloaded, bubble, bubbleLot: false, sharedClient });

                const miniRec = {src: srcData, dst: dstData }

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    suspendLot(params: { bid: string; brid: string; id: string; sharedClient: PoolClient; }) {
        return new Promise( async (resolve, reject) => {
            try {
                let { bid, brid, id, sharedClient } = params;
                const res = await this.update({ bid, brid, data: { pdLotStorageId: id, suspended: true }, sharedClient })
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

    unsuspendLot(params: { bid: string; brid: string; id: string;  sharedClient: PoolClient; }) {
        return new Promise( async (resolve, reject) => {
            try {
                let { bid, brid, id, sharedClient } = params;
                const res = await this.update({ bid, brid, data: { pdLotStorageId: id, suspended: false }, sharedClient })
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

}
