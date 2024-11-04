import { PdHuService } from "./pd-hu.service";
import { PdWhExtService } from "../pd-wh";
import { PdExtService } from "../pd/pd-ext.service";
import { WhStorageService, WhStorageExtService } from "../wh-storage";
import { PdHu } from "../../interfaces/pd-hu.model";
import { PdLotStorageExtService } from "../pd-lot-storage";
import { PdHuAdjustParamsType, PdHuAllocateParamsType, PdHuDeallocateParamsType, PdHuDecreaseParamsType, PdHuIncreaseParamsType, PdHuSyncQtyParamsType, PdHuTransferParamsType } from "./pd-hu.interface";
import { Pd } from "../../interfaces/pd.model";
import { WhHu } from "../../interfaces/wh-hu.model";
import { WhHuExtService } from "../wh-hu";
import { BeforeTriggerType } from "@bc365-server/common/services/db.interface";
import { PdStorageExtService } from "../pd-storage";
import { PdStorage } from "../../interfaces/pd-storage.model";
import { PdWh } from "../../interfaces/pd-wh.model";

export class PdHuExtService extends PdHuService {

    get pdService() {
        return this.modRef.get<PdExtService>(PdExtService)
    }

    get pdWhService() {
        return this.modRef.get<PdWhExtService>(PdWhExtService)
    }

    get pdLotStorageService() {
        return this.modRef.get<PdLotStorageExtService>(PdLotStorageExtService)
    }

    get pdStorageService() {
        return this.modRef.get<PdStorageExtService>(PdStorageExtService)
    }

    get storageService() {
        return this.modRef.get<WhStorageService>(WhStorageExtService)
    }

    get whHuService() {
        return this.modRef.get<WhHuExtService>(WhHuExtService)
    }

    override beforeInsert(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, data, sharedClient } = params;

                const morphData = data as PdHu;

                const whHu = await this.whHuService.getById(bid, { id: data.whHuId }, sharedClient);

                if (data.pdStorageId) {

                        let pdStorage: PdStorage;
                        if (whHu.whStorageId) {
                            pdStorage = await this.pdStorageService.getOne({ bid, brid, filter: { _and: [ {pdId: data.pdId}, {whStorageId: whHu.whStorageId} ] } })
                            morphData.pdStorageId = pdStorage?.pdStorageId;
                        }

                        let pdWh: PdWh;
                        if (whHu.whId) {
                            pdWh = await this.pdWhService.getOne({ bid, brid, filter: { _and: [ {pdId: data.pdId}, {whId: whHu.whId} ] } })
                            morphData.pdWhId = pdWh?.pdWhId;
                        }

                } else {

                    let pdWh: PdWh;
                    if (whHu.whId) {
                        pdWh = await this.pdWhService.getOne({ bid, brid, filter: { _and: [ {pdId: data.pdId}, {whId: whHu.whId} ] } })
                        morphData.pdWhId = pdWh?.pdWhId;
                    }

                }

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

                const morphData = data as PdHu;

                resolve(morphData)

            } catch(e) {

                reject(e)

            }
        })
    }

    syncQty(params: PdHuSyncQtyParamsType) {
        return new Promise<{ persist: boolean; pdHu: any; }>( async (resolve, reject) => {

            const { bid, brid, pdHu, persistOutside, preloaded, sharedClient } = params;

            try {

                let pd: Pd;
                let whHu: WhHu;

                if (preloaded && preloaded.pdMap) {
                    pd = preloaded.pdMap[pdHu.pdId]
                } else {
                    pd = await this.pdService.getById(bid, { id: pdHu.pdId }, sharedClient)
                }

                if (preloaded && preloaded.whHuMap) {
                    whHu = preloaded.whHuMap[pdHu.whHuId]
                } else {
                    whHu = await this.whHuService.getById(bid, { id: pdHu.pdId }, sharedClient)
                }

                const data = { pdHuId: pdHu.pdHuId, ohQty: pdHu.ohQty,  allocatedQty: pdHu.allocatedQty };

                resolve({ persist: false, pdHu: data })

            } catch(e) {

                console.log(e)

                reject(e)
            }
        })
    }

    allocateQty(params: PdHuAllocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdHuId, qty, preloaded, bubble, sharedClient } = params;

                let pdHu: PdHu;

                if (preloaded && preloaded.pdHuMap[pdHuId]) {
                    pdHu = preloaded.pdHuMap[pdHuId];
                } else {
                    pdHu = await this.getById( bid, { id: pdHuId }, sharedClient )
                }

                if (!pdHu.ohQty || pdHu.ohQty <= 0) {
                    throw new Error('No quantity for allocation.')
                }

                pdHu.allocatedQty = pdHu.allocatedQty || 0;

                const newQty = pdHu.allocatedQty  + qty;

                if (newQty > (pdHu.ohQty - pdHu.allocatedQty)) {
                    throw new Error(`Quantity can allocate ${(pdHu.ohQty - pdHu.allocatedQty)} of ${qty}. current on-hand: ${pdHu.ohQty}, current allocated: ${pdHu.allocatedQty}`)
                }

                await this.update({ bid, brid, data: { pdHuId: pdHu.pdHuId, whHuId: pdHu.whHuId, whStorageId: pdHu.whStorageId, allocatedQty: newQty }, sharedClient })

                if (pdHu.pdStorageId) {
                    await this.pdStorageService.allocateQty({ bid, brid, pdStorageId: pdHu.pdStorageId, qty, preloaded, bubble, sharedClient })
                } else {
                    await this.pdWhService.allocateQty({ bid, brid, pdWhId: pdHu.pdWhId, qty, preloaded, sharedClient })
                }

                const miniRec = {pdHuId: pdHu.pdHuId, lastAllocatedQty: pdHu.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    deallocateQty(params: PdHuDeallocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdHuId, qty, preloaded, bubble, sharedClient } = params;

                let pdHu: PdHu;

                if (preloaded && preloaded.pdHuMap[pdHuId]) {
                    pdHu = preloaded.pdHuMap[pdHuId];
                } else {
                    pdHu = await this.getById( bid, { id: pdHuId }, sharedClient )
                }

                const newQty = pdHu.allocatedQty - qty;

                await this.update({ bid, brid, data: { pdHuId: pdHu.pdHuId, whHuId: pdHu.whHuId, allocatedQty: newQty }, sharedClient })

                if (pdHu.pdStorageId) {
                    await this.pdStorageService.deallocateQty({ bid, brid, pdStorageId: pdHu.pdStorageId, qty, preloaded, bubble, sharedClient })
                } else {
                    await this.pdWhService.deallocateQty({ bid, brid, pdWhId: pdHu.pdWhId, qty, preloaded, sharedClient })
                }

                const miniRec = {pdHuId: pdHu.pdHuId, lastAllocatedQty: pdHu.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    increaseQty(params: PdHuIncreaseParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdHuId, qty, preloaded, bubble, sharedClient } = params;

                let pdHu: PdHu;

                if (preloaded && preloaded.pdHuMap[pdHuId]) {
                    pdHu = preloaded.pdHuMap[pdHuId];
                } else {
                    pdHu = await this.getById( bid, { id: pdHuId }, sharedClient )
                }

                pdHu.ohQty = pdHu.ohQty || 0;

                const newQty = pdHu.ohQty + qty;

                await this.update({ bid, brid, data: { pdHuId: pdHu.pdHuId, ohQty: newQty }, sharedClient })

                if (pdHu.pdStorageId) {
                    await this.pdStorageService.increaseQty({ bid, brid, pdStorageId: pdHu.pdStorageId, qty, preloaded, bubble, sharedClient })
                } else {
                    await this.pdWhService.increaseQty({ bid, brid, pdWhId: pdHu.pdWhId, qty, preloaded, sharedClient })
                }

                const miniRec = {pdHuId: pdHu.pdHuId, lastQty: pdHu.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    decreaseQty(params: PdHuDecreaseParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdHuId, qty, preloaded, bubble, sharedClient } = params;

                let pdHu: PdHu;

                if (preloaded && preloaded.pdHuMap[pdHuId]) {
                    pdHu = preloaded.pdHuMap[pdHuId];
                } else {
                    pdHu = await this.getById( bid, { id: pdHuId }, sharedClient )
                }

                pdHu.ohQty = pdHu.ohQty || 0;

                if (pdHu.ohQty <= 0) {
                    throw new Error('Negative stock has not allowed.')
                }

                const newQty = pdHu.ohQty - qty;

                await this.update({ bid, brid, data: { pdHuId: pdHu.pdHuId, ohQty: newQty }, sharedClient })

                if (pdHu.pdStorageId) {
                    await this.pdStorageService.decreaseQty({ bid, brid, pdStorageId: pdHu.pdStorageId, qty, preloaded, bubble, sharedClient })
                } else {
                    await this.pdWhService.decreaseQty({ bid, brid, pdWhId: pdHu.pdWhId, qty, preloaded, sharedClient })
                }


                const miniRec = {pdHuId: pdHu.pdHuId, lastQty: pdHu.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    adjustQty(params: PdHuAdjustParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdHuId, qty, preloaded, bubble, sharedClient } = params;

                let pdHu: PdHu;

                if (preloaded && preloaded.pdHuMap[pdHuId]) {
                    pdHu = preloaded.pdHuMap[pdHuId];
                } else {
                    pdHu = await this.getById( bid, { id: pdHuId }, sharedClient )
                }

                let diffQty = 0;

                if (pdHu.ohQty >= qty) {

                    if (pdHu.ohQty - pdHu.allocatedQty < qty) {
                        throw new Error('available qty is less than quantity to adjust')
                    }

                    diffQty = pdHu.ohQty - qty;

                    const miniRec = await this.decreaseQty({ bid, brid, pdHuId: pdHuId, qty: diffQty, preloaded, bubble, sharedClient });

                    resolve(miniRec)

                } else {

                    diffQty = qty - pdHu.ohQty;

                    const miniRec = await this.increaseQty({ bid, brid, pdHuId: pdHuId, qty: diffQty, preloaded, bubble, sharedClient });

                    resolve(miniRec)

                }

            } catch(e) {

                reject(e)

            }
        })
    }

    transferQty(params: PdHuTransferParamsType ) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, srcPdHuId, dstPdHuId, qty, preloaded, bubble, sharedClient } = params;

                const srcData = await this.decreaseQty({ bid, brid, pdHuId: srcPdHuId, qty, preloaded, bubble, sharedClient });

                const dstData = await this.increaseQty({ bid, brid, pdHuId: dstPdHuId, qty, preloaded, bubble, sharedClient });

                const miniRec = {src: srcData, dst: dstData }

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

}
