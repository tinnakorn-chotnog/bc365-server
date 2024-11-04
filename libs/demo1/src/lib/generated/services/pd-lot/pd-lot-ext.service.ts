import { PdLotService } from "./pd-lot.service";
import { PdLot } from "../../interfaces/pd-lot.model";
import { PdLotStorageExtService } from "../pd-lot-storage";
import { PdLotStorage } from "../../interfaces/pd-lot-storage.model";
import { PdLotAllocateParamsType, PdLotDeallocateParamsType, PdLotDecreaseParamsType, PdLotIncreaseParamsType } from "./pd-lot.interface";

export class PdLotExtService extends PdLotService {

    override get pdLotStorageService() {
        return this.modRef.get<PdLotStorageExtService>(PdLotStorageExtService);
    }

    allocateQty(params: PdLotAllocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdLotId, qty, preloaded, sharedClient } = params;

                let pdLot: PdLot;

                if (preloaded && preloaded.pdLotMap[pdLotId]) {
                    pdLot = preloaded.pdLotMap[pdLotId];
                } else {
                    pdLot = await this.getById( bid, { id: pdLotId }, sharedClient )
                }

                if (pdLot.suspended) {
                    throw new Error('lot was suspended.')
                }

                const newQty = pdLot.allocatedQty + qty;

                await this.update({ bid, brid, data:{ pdLotId: pdLot.pdLotId, allocatedQty: newQty }, sharedClient })

                const miniRec = {pdLotId: pdLot.pdLotId, lastAllocatedQty: pdLot.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    deallocateQty(params: PdLotDeallocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdLotId, qty, preloaded, sharedClient } = params;

                let pdLot: PdLot;

                if (preloaded && preloaded.pdLotMap[pdLotId]) {
                    pdLot = preloaded.pdLotMap[pdLotId];
                } else {
                    pdLot = await this.getById( bid, { id: pdLotId }, sharedClient )
                }

                if (pdLot.suspended) {
                    throw new Error('lot was suspended.')
                }

                const newQty = pdLot.allocatedQty - qty;

                if (!pdLot.allowNegativeQty && newQty < 0) {
                    throw new Error('negative allocation not allowed.')
                }

                await this.update({ bid, brid, data:{ pdLotId: pdLot.pdLotId, allocatedQty: newQty }, sharedClient })

                const miniRec = {pdLotId: pdLot.pdLotId, lastAllocatedQty: pdLot.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    increaseQty(params: PdLotIncreaseParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdLotId, qty, preloaded, sharedClient } = params;

                let pdLot: PdLot;

                if (preloaded && preloaded.pdLotMap[pdLotId]) {
                    pdLot = preloaded.pdLotMap[pdLotId];
                } else {
                    pdLot = await this.getById( bid, { id: pdLotId }, sharedClient )
                }

                if (pdLot.suspended) {
                    throw new Error('lot was suspended.')
                }

                const newQty = pdLot.ohQty + qty;

                await this.update({ bid, brid, data:{ pdLotId: pdLot.pdLotId, ohQty: newQty } })

                const miniRec = {pdLotId: pdLot.pdLotId, lastQty: pdLot.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    decreaseQty(params: PdLotDecreaseParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdLotId, qty, preloaded, sharedClient } = params;

                let pdLot: PdLot;

                if (preloaded && preloaded.pdLotMap[pdLotId]) {
                    pdLot = preloaded.pdLotMap[pdLotId];
                } else {
                    pdLot = await this.getById( bid, { id: pdLotId }, sharedClient )
                }


                if (pdLot.suspended) {
                    throw new Error('lot was suspended.')
                }

                const newQty = pdLot.ohQty - qty;

                if (!pdLot.allowNegativeQty && newQty < 0) {
                    throw new Error('negative stock not allowed.')
                }

                await this.update({ bid, brid, data:{ pdLotId: pdLot.pdLotId, ohQty: newQty } })

                const miniRec = {pdLotId: pdLot.pdLotId, lastQty: pdLot.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    suspendLot(params: { bid: string; brid: string; pdLotId: string; sharedClient: any }) {
        return new Promise( async (resolve, reject) => {
            try {
                let { bid, brid, pdLotId, sharedClient } = params;

                await this.update({ bid, brid, data:{ pdLotId: pdLotId, suspended: true } })
                const pdLots: PdLotStorage[] = await this.pdLotStorageService.get({ bid, brid, filter: { pdLotId: pdLotId }, sharedClient})
                const res = await Promise.all(pdLots.map( async (pdLotLoc: PdLotStorage) => {
                    try {
                        const res = await this.pdLotStorageService.suspendLot({ bid, brid, id: pdLotLoc.pdLotId, sharedClient })
                        return res;
                    } catch(e) {
                        throw new Error(e)
                    }
                }))
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

    unsuspendLot(params: { bid: string; brid: string; pdLotId: string; sharedClient: any }) {
        return new Promise( async (resolve, reject) => {
            try {
                let { bid, brid, pdLotId, sharedClient } = params;
                await this.update({ bid, brid, data:{ pdLotId: pdLotId, suspended: false } })
                const pdLots: PdLotStorage[] = await this.pdLotStorageService.get({ bid, brid, filter: { pdLotId: pdLotId }, sharedClient })
                const res = await Promise.all(pdLots.map( async (pdLotLoc: PdLotStorage) => {
                    try {
                        const res = await this.pdLotStorageService.unsuspendLot({ bid, brid, id: pdLotLoc.pdLotId, sharedClient })
                        return res;
                    } catch(e) {
                        throw new Error(e)
                    }
                }))
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

}
