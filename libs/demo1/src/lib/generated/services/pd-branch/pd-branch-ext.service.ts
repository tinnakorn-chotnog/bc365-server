import { ModuleRef } from "@nestjs/core";
import { PdBranchService } from "./pd-branch.service";
import { PdBranch } from "../../interfaces/pd-branch.model";
import { PdExtService } from "../pd/pd-ext.service";
import { PdWh } from "../../interfaces/pd-wh.model";
import { PdWhExtService, PdWhService } from "../pd-wh";
import { Pd } from "../../interfaces/pd.model";
import { PoolClient } from "pg";
import { PdBranchSyncQtyParamsType, PdBranchAllocateParamsType, PdBranchDeallocateParamsType, PdBranchIncreaseParamsType, PdBranchDecreaseParamsType } from "./pd-branch.interface";
import { BeforeTriggerType } from "@bc365-server/common/services/db.interface";


export class PdBranchExtService extends PdBranchService {

    get pdService() {
        return this.modRef.get<PdExtService>(PdExtService)
    }

    get pdWhService(): PdWhExtService {
        return this.modRef.get<PdWhExtService>(PdWhExtService)
    }

    override beforeInsert(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, data, sharedClient } = params;

                if (typeof data.pdId !== 'undefined') {

                    const pd = await this.pdService.getById(bid, { id: data.pdId }, sharedClient);

                    const morphData = data as PdBranch;

                    morphData.pdNo = pd?.pdNo || null;
                    morphData.pdName = pd?.pdName || null;

                    resolve(morphData)

                } else {
                    resolve(data)
                }

            } catch(e) {

                reject(e)

            }
        });
    }

    override beforeUpdate(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, data, sharedClient } = params;

                if (typeof data.pdId !== 'undefined') {

                    const pd = await this.pdService.getById(bid, { id: data.pdId }, sharedClient);

                    const morphData = data as PdBranch;

                    morphData.pdNo = pd?.pdNo || null;
                    morphData.pdName = pd?.pdName || null;

                    resolve(morphData)

                } else {
                    resolve(data)
                }

            } catch(e) {

                reject(e)

            }
        });
    }

    syncQty(params: PdBranchSyncQtyParamsType) {
        return new Promise<{ persist: boolean; pdBranch: any; }>( async (resolve, reject) => {

            const { bid, brid, pdBranch, cascading, persistOutside, preloaded, sharedClient } = params;

            try {

                let pdWhs: PdWh[];

                if (preloaded && preloaded.pdWhMap) {
                    pdWhs = preloaded.pdWhMap[pdBranch.pdId];
                } else {
                    pdWhs = await this.pdWhService.get({ bid, brid: pdBranch.branchId, filter: { pdId: pdBranch.pdId }, sharedClient })
                }

                let ohQty = 0;
                let allocatedQty = 0;
                let pdWhData: any;

                if (cascading) {

                    const pdWhQty = await Promise.all(pdWhs.map(async pdWh => {
                        if (preloaded) {
                            const qtyData = await this.pdWhService.syncQty({ bid, brid: pdBranch.branchId, pdWh, persistOutside: true, preloaded, sharedClient, cascading });
                            return qtyData;
                        } else {
                            const qtyData = await this.pdWhService.syncQty({ bid, brid: pdBranch.branchId, pdWh, cascading, persistOutside, sharedClient });
                            return qtyData;
                        }
                    }))

                    pdWhQty.forEach( item => {
                        ohQty = ohQty + item.pdWh.ohQty
                        allocatedQty = allocatedQty + item.pdWh.allocatedQty;
                    })

                    pdWhData = pdWhQty.filter( item => item.persist).map( item => item.pdWh);

                } else {

                    ohQty = pdBranch.ohQty;
                    allocatedQty = pdBranch.allocatedQty;

                }

                const data = { pdBranchId: pdBranch.pdBranchId, ohQty: ohQty,  allocatedQty: allocatedQty };

                if (persistOutside) {

                    resolve({ persist: true, pdBranch: { ...data, pdWh: pdWhData } })

                } else {

                    if (pdWhData.length > 0) {
                        await this.pdWhService.updateList({ bid, brid: pdBranch.branchId, data: pdWhData, batch: true, sharedClient})
                    }

                    await this.update({ bid, brid: pdBranch.branchId, data, sharedClient })

                    resolve({ persist: false, pdBranch: data})

                }

            } catch(e) {

                reject(e)

            }
        })
    }

    allocateQty(params: PdBranchAllocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdBranchId, qty, preloaded, bubble, sharedClient } = params;

                let pdBranch: PdBranch;

                if (preloaded && preloaded.pdBranchMap[pdBranchId]) {
                    pdBranch = preloaded.pdBranchMap[pdBranchId];
                } else {
                    pdBranch = await this.getById( bid, { id: pdBranchId }, sharedClient )
                }

                if (preloaded && preloaded.pdMap) {
                    throw new Error('quantity allocation at branch level cannot be processed, please provide prepreloaded map of pd data.')
                }

                if (!pdBranch.ohQty || pdBranch.ohQty <= 0) {
                    throw new Error('No quantity for allocation.')
                }

                const newQty = pdBranch.allocatedQty + qty;

                if (newQty > (pdBranch.ohQty - pdBranch.allocatedQty)) {
                    throw new Error(`Quantity can allocate ${(pdBranch.ohQty - pdBranch.allocatedQty)} of ${qty}. current on-hand: ${pdBranch.ohQty}, current allocated: ${pdBranch.allocatedQty}`)
                }

                await this.update({ bid, brid, data:{ pdBranchId: pdBranch.pdBranchId, allocatedQty: newQty } })

                if (bubble) {
                    await this.pdService.allocateQty({ bid, brid, pdId: pdBranch.pdId, qty, preloaded, sharedClient })
                }

                const miniRec = {pdBranchId: pdBranch.pdBranchId, lastAllocatedQty: pdBranch.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    deallocateQty(params: PdBranchDeallocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdBranchId, qty, preloaded, bubble, sharedClient } = params;

                let pdBranch: PdBranch;

                if (preloaded && preloaded.pdBranchMap[pdBranchId]) {
                    pdBranch = preloaded.pdBranchMap[pdBranchId];
                } else {
                    pdBranch = await this.getById( bid, { id: pdBranchId }, sharedClient )
                }

                const newQty = pdBranch.allocatedQty - qty;

                if (!pdBranch.allowNegativeQty && newQty < 0) {
                    throw new Error('negative allocation not allowed.')
                }

                await this.update({ bid, brid, data:{ pdBranchId: pdBranch.pdBranchId, allocatedQty: newQty } })

                if (bubble) {
                    await this.pdService.deallocateQty({ bid, brid, pdId: pdBranch.pdId, qty, preloaded, sharedClient })
                }

                const miniRec = {pdBranchId: pdBranch.pdBranchId, lastAllocatedQty: pdBranch.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    increaseQty(params: PdBranchIncreaseParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdBranchId, qty, preloaded, bubble, sharedClient } = params;

                let pdBranch: PdBranch;

                if (preloaded && preloaded.pdBranchMap[pdBranchId]) {
                    pdBranch = preloaded.pdBranchMap[pdBranchId];
                } else {
                    pdBranch = await this.getById( bid, { id: pdBranchId }, sharedClient )
                }

                const newQty = pdBranch.ohQty + qty;

                await this.update({ bid, brid, data:{ pdBranchId: pdBranch.pdBranchId, ohQty: newQty } })

                if (bubble) {
                    await this.pdService.increaseQty({ bid, brid, pdId: pdBranch.pdId, qty, preloaded, sharedClient })
                }

                const miniRec = {pdBranchId: pdBranch.pdBranchId, lastQty: pdBranch.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    decreaseQty(params: PdBranchDecreaseParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdBranchId, qty, preloaded, bubble, sharedClient } = params;

                let pdBranch: PdBranch;

                if (preloaded && preloaded.pdBranchMap[pdBranchId]) {
                    pdBranch = preloaded.pdBranchMap[pdBranchId];
                } else {
                    pdBranch = await this.getById( bid, { id: pdBranchId }, sharedClient )
                }

                const newQty = pdBranch.ohQty - qty;

                if (!pdBranch.allowNegativeQty && newQty < 0) {
                    throw new Error('negative stock not allowed.')
                }

                await this.update({ bid, brid, data:{ pdBranchId: pdBranch.pdBranchId, ohQty: newQty } })

                if (bubble) {
                    await this.pdService.decreaseQty({ bid, brid, pdId: pdBranch.pdId, qty })
                }

                const miniRec = {pdBranchId: pdBranch.pdBranchId, lastQty: pdBranch.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

}
