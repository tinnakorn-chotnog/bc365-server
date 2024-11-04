import { ModuleRef } from "@nestjs/core";
import { PdService } from "./pd.service";
import { Pd } from "../../interfaces/pd.model";
import { PdBranch } from "../../interfaces/pd-branch.model";
import { PdBranchExtService } from "../pd-branch";
import { PoolClient } from "pg";
import { PdSyncQtyParamsType, PdAllocateParamsType, PdDeallocateParamsType, PdIncreaseParamsType, PdDecreaseParamsType } from "./pd.interface";



export class PdExtService extends PdService {

    get pdBranchService() {
        return this.modRef.get<PdBranchExtService>(PdBranchExtService)
    }

    syncQty(params: PdSyncQtyParamsType) {
        return new Promise<{ persist: boolean; pd: any}>( async (resolve, reject) => {
            try {

                const { bid, brid, pd, cascading, persistOutside, preloaded, sharedClient } = params;

                if (!pd) {
                    throw new Error('Require pd data to process syncQty method.')
                }

                let pdBranches: PdBranch[];

                if (preloaded && preloaded.pdBranchMap) {
                    pdBranches = preloaded.pdBranchMap[pd.pdId];
                } else {
                    pdBranches = await this.pdBranchService.get({ bid, brid, skipBridCheck: true, filter: { pdId: pd.pdId }, sharedClient })
                }

                let ohQty = 0;
                let allocatedQty = 0;
                let pdBranchQty = [];

                if (cascading) {

                    pdBranchQty = await Promise.all(pdBranches.map(async pdBranch => {
                        const qtyData = await this.pdBranchService.syncQty({
                            bid, brid: pdBranch.branchId, pdBranch, preloaded, persistOutside, sharedClient,
                            cascading: false
                        });
                        return qtyData;
                    }))

                    pdBranchQty.forEach( item => {
                        ohQty = ohQty + item.pdBranch.ohQty
                        allocatedQty = allocatedQty + item.pdBranch.allocatedQty;
                    })


                } else {
                    pdBranches.forEach( item => {
                        ohQty = ohQty + item.ohQty
                        allocatedQty = allocatedQty + item.allocatedQty;
                    })
                }

                const pdBranchData = pdBranchQty.filter( item => item.persist).map( item => item.pdBranch);

                const data = { pdId: pd.pdId, ohQty: ohQty,  allocatedQty: allocatedQty };

                if (persistOutside) {

                    resolve({ persist: true, pd: { ...data, pdBranch: pdBranchData } })

                } else {

                    const pdBranchData = pdBranchQty.filter( item => item.persist);

                    if (pdBranchData.length > 0) {

                        await this.pdBranchService.updateList({ bid, brid, skipBridCheck: true, data: pdBranchData, batch: true, sharedClient})

                    }

                    await this.update({ bid, brid, data, sharedClient })

                    resolve({ persist: false, pd: data})
                }


            } catch(e) {

                reject(e)

            }
        })
    }

    allocateQty(params: PdAllocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdId, qty, preloaded, sharedClient } = params;

                let pd: Pd;

                if (preloaded && preloaded.pdMap[pdId]) {
                    pd = preloaded.pdMap[pdId];
                } else {
                    pd = await this.getById( bid, { id: pdId }, sharedClient )
                }

                if (!pd) {
                    throw new Error('Product not found.')
                }

                if (!pd.ohQty || pd.ohQty <= 0) {
                    throw new Error('No quantity for allocation.')
                }

                const newQty = pd.allocatedQty + qty;

                if (newQty > (pd.ohQty - pd.allocatedQty)) {
                    throw new Error(`Quantity can allocate ${(pd.ohQty - pd.allocatedQty)} of ${qty}. current on-hand: ${pd.ohQty}, current allocated: ${pd.allocatedQty}`)
                }

                await this.update({ bid, brid, data: { pdId: pd.pdId, allocatedQty: newQty } })

                const miniRec = {pdId: pd.pdId, lastAllocatedQty: pd.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    deallocateQty(params: PdDeallocateParamsType) {
        return new Promise( async (resolve, reject) => {


            try {

                let { bid, brid, pdId, qty, preloaded, sharedClient } = params;

                let pd: Pd;

                if (preloaded && preloaded.pdMap[pdId]) {
                    pd = preloaded.pdMap[pdId];
                } else {
                    pd = await this.getById( bid, { id: pdId }, sharedClient )
                }

                const newQty = pd.allocatedQty - qty;

                if (!pd.allowNegativeQty && newQty < 0) {
                    throw new Error('negative allocation not allowed.')
                }

                await this.update({ bid, brid, data: { pdId: pd.pdId, allocatedQty: newQty } })

                const miniRec = {pdId: pd.pdId, lastAllocatedQty: pd.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    increaseQty(params: PdIncreaseParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdId, qty, preloaded, sharedClient } = params;

                let pd: Pd;

                if (preloaded && preloaded.pdMap[pdId]) {
                    pd = preloaded.pdMap[pdId];
                } else {
                    pd = await this.getById( bid, { id: pdId }, sharedClient )
                }

                const newQty = pd.ohQty + qty;

                await this.update({ bid, brid, data: { pdId: pd.pdId, ohQty: newQty } })

                const miniRec = {pdId: pd.pdId, lastQty: pd.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    decreaseQty(params: PdDecreaseParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdId, qty, preloaded, sharedClient } = params;

                let pd: Pd;

                if (preloaded && preloaded.pdMap[pdId]) {
                    pd = preloaded.pdMap[pdId];
                } else {
                    pd = await this.getById( bid, { id: pdId }, sharedClient )
                }

                const newQty = pd.ohQty - qty;

                if (!pd.allowNegativeQty && newQty < 0) {
                    throw new Error('negative stock not allowed.')
                }

                await this.update({ bid, brid, data: { pdId: pd.pdId, ohQty: newQty } })

                const miniRec = {pdId: pd.pdId, lastQty: pd.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

}
