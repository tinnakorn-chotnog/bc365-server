import { PdWhService } from "./pd-wh.service";
import { PdWh } from "../../interfaces/pd-wh.model";
import { PdBranchExtService } from "../pd-branch";
import { PdStorage } from "../../interfaces/pd-storage.model";
import { WhService } from "../wh";
import { PdExtService } from "../pd/pd-ext.service";
import { PdStorageExtService } from "../pd-storage";
import { PdWhAllocateParamsType, PdWhDeallocateParamsType, PdWhDecreaseParamsType, PdWhIncreaseParamsType, PdWhSyncQtyParamsType } from "./pd-wh.interface";
import { BeforeTriggerType } from "@bc365-server/common/services/db.interface";
import { Wh } from "../../interfaces/wh.model";
import { groupBy, keyBy } from "lodash";
import { PdBranch } from "../../interfaces/pd-branch.model";

export class PdWhExtService extends PdWhService {

    get pdService() {
        return this.modRef.get<PdExtService>(PdExtService)
    }

    get whService() {
        return this.modRef.get<WhService>(WhService)
    }

    get pdBranchService() {
        return this.modRef.get<PdBranchExtService>(PdBranchExtService)
    }

    get pdStorageService(): PdStorageExtService {
        return this.modRef.get<PdStorageExtService>(PdStorageExtService)
    }

    override beforeInsert(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, data, skipBridCheck, sharedClient } = params;

                if (!data.pdId) {
                    throw new Error('Not provide product #ID')
                }

                if (!data.whId) {
                    throw new Error('Not provide warehouse #ID')
                }


                let pdBranch: PdBranch;


                if (typeof data.pdBranchId === 'undefined' || data.pdBranchId === null) {
                    pdBranch = await this.pdBranchService.getOne({ bid, brid: brid, skipBridCheck, filter:{ _and: [ {pdId: data.pdId}, {branchId: data.branchId || brid} ] }, sharedClient })
                } else {
                    pdBranch = await this.pdBranchService.getById(bid, { id: data.pdBranchId })
                }

                const wh = await this.whService.getById(bid, { id: data.whId }, sharedClient)

                let pdStorages: PdStorage[];
                let pdStorageMap: any;

                pdStorages = await this.pdStorageService.get({ bid, brid: brid, skipBridCheck, filter: { pdId: data.pdId }, sharedClient });

                pdStorageMap = groupBy(pdStorages, 'whStorageId')

                const newPdStorages: PdStorage[] = [];

                if (!pdStorageMap[wh.defaultWhStorageId] && wh.defaultWhStorageId !== null) {
                    const s: PdStorage = {
                        pdStorageId: this.service.generateId(),
                        pdId: data.pdId,
                        whId: data.whId,
                        whStorageId: wh.defaultWhStorageId,
                        pdBranchId: data.pdBranchId || pdBranch?.pdBranchId || null,
                        pdWhId: data.pdWhId || null,
                        ohQty: 0,
                        allocatedQty: 0,
                        whZoneId: null,
                        whAisleId: null,
                        whRackId: null,
                        whShelfId: null,
                        whStorageRestrictionId: null
                    }
                    newPdStorages.push(s)
                }

                if (!pdStorageMap[wh.receivingWhStorageId] && wh.receivingWhStorageId !== null) {
                    const s: PdStorage = {
                        pdStorageId: this.service.generateId(),
                        pdId: data.pdId,
                        whId: data.whId,
                        whStorageId: wh.receivingWhStorageId,
                        pdBranchId: data.pdBranchId || pdBranch?.pdBranchId || null,
                        pdWhId: data.pdWhId || null,
                        ohQty: 0,
                        allocatedQty: 0,
                        whZoneId: null,
                        whAisleId: null,
                        whRackId: null,
                        whShelfId: null,
                        whStorageRestrictionId: null
                    }
                    newPdStorages.push(s)
                }

                if (!pdStorageMap[wh.pickingWhStorageId] && wh.pickingWhStorageId !== null) {
                    const s: PdStorage = {
                        pdStorageId: this.service.generateId(),
                        pdId: data.pdId,
                        whId: data.whId,
                        whStorageId: wh.pickingWhStorageId,
                        pdBranchId: data.pdBranchId || pdBranch?.pdBranchId || null,
                        pdWhId: data.pdWhId || null,
                        ohQty: 0,
                        allocatedQty: 0,
                        whZoneId: null,
                        whAisleId: null,
                        whRackId: null,
                        whShelfId: null,
                        whStorageRestrictionId: null
                    }
                    newPdStorages.push(s)
                }

                if (!pdStorageMap[wh.packingWhStorageId] && wh.packingWhStorageId !== null) {
                    const s: PdStorage = {
                        pdStorageId: this.service.generateId(),
                        pdId: data.pdId,
                        whId: data.whId,
                        whStorageId: wh.packingWhStorageId,
                        pdBranchId: data.pdBranchId || pdBranch?.pdBranchId || null,
                        pdWhId: data.pdWhId || null,
                        ohQty: 0,
                        allocatedQty: 0,
                        whZoneId: null,
                        whAisleId: null,
                        whRackId: null,
                        whShelfId: null,
                        whStorageRestrictionId: null
                    }
                    newPdStorages.push(s)
                }

                if (!pdStorageMap[wh.shippingWhStorageId] && wh.shippingWhStorageId !== null) {
                    const s: PdStorage = {
                        pdStorageId: this.service.generateId(),
                        pdId: data.pdId,
                        whId: data.whId,
                        whStorageId: wh.shippingWhStorageId,
                        pdBranchId: data.pdBranchId || pdBranch?.pdBranchId || null,
                        pdWhId: data.pdWhId || null,
                        ohQty: 0,
                        allocatedQty: 0,
                        whZoneId: null,
                        whAisleId: null,
                        whRackId: null,
                        whShelfId: null,
                        whStorageRestrictionId: null
                    }
                    newPdStorages.push(s)
                }

                if (newPdStorages.length > 0) {
                    await this.pdStorageService.addList({ bid, brid, skipBridCheck, data: newPdStorages, batch: true, sharedClient });
                    pdStorages = await this.pdStorageService.get({ bid, brid, skipBridCheck, filter: { pdId: data.pdId }, sharedClient });
                    pdStorageMap = groupBy(pdStorages, 'whStorageId')
                }


                const morphData = data as PdWh;

                morphData.pdBranchId = data.pdBranchId || pdBranch?.pdBranchId || null;
                morphData.refPdNo = pdBranch?.pdNo || null;
                morphData.refPdName = pdBranch?.pdName || null;
                morphData.refWhNo = wh?.whNo || null;
                morphData.refWhName = wh?.whName || null;

                resolve(morphData)

            } catch(e) {
                reject(e)
            }
        })
    }

    override beforeUpdate(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, data, skipBridCheck, sharedClient } = params;

                let wh: Wh;

                if (typeof data.pdId !== 'undefined' && typeof data.whId !== 'undefined') {

                    let pdBranch: PdBranch;

                    if (typeof data.pdBranchId === 'undefined' || data.pdBranchId === null) {
                        pdBranch = await this.pdBranchService.getOne({ bid, brid: brid, skipBridCheck, filter:{ _and: [ {pdId: data.pdId}, {branchId: data.branchId || brid} ] }, sharedClient })
                    }

                    const wh = await this.whService.getById(bid, { id: data.whId }, sharedClient)

                    let pdStorages: PdStorage[];
                    let pdStorageMap: any;

                    pdStorages = await this.pdStorageService.get({ bid, brid: data.branchId || brid, skipBridCheck, filter: { pdId: data.pdId }, sharedClient });
                    pdStorageMap = groupBy(pdStorages, 'whStorageId')

                    const newPdStorages: PdStorage[] = [];

                    if (!pdStorageMap[wh.defaultWhStorageId] && wh.defaultWhStorageId !== null) {
                        const s: PdStorage = {
                            pdStorageId: this.service.generateId(),
                            pdId: data.pdId,
                            whId: data.whId,
                            whStorageId: wh.defaultWhStorageId,
                            pdBranchId: data.pdBranchId || pdBranch?.pdBranchId || null,
                            pdWhId: data.pdWhId || null,
                            ohQty: 0,
                            allocatedQty: 0,
                            whZoneId: null,
                            whAisleId: null,
                            whRackId: null,
                            whShelfId: null,
                            whStorageRestrictionId: null
                        }
                        newPdStorages.push(s)
                    }

                    if (!pdStorageMap[wh.receivingWhStorageId] && wh.receivingWhStorageId !== null) {
                        const s: PdStorage = {
                            pdStorageId: this.service.generateId(),
                            pdId: data.pdId,
                            whId: data.whId,
                            whStorageId: wh.receivingWhStorageId,
                            pdBranchId: data.pdBranchId || pdBranch?.pdBranchId || null,
                            pdWhId: data.pdWhId || null,
                            ohQty: 0,
                            allocatedQty: 0,
                            whZoneId: null,
                            whAisleId: null,
                            whRackId: null,
                            whShelfId: null,
                            whStorageRestrictionId: null
                        }
                        newPdStorages.push(s)
                    }

                    if (!pdStorageMap[wh.pickingWhStorageId] && wh.pickingWhStorageId !== null) {
                        const s: PdStorage = {
                            pdStorageId: this.service.generateId(),
                            pdId: data.pdId,
                            whId: data.whId,
                            whStorageId: wh.pickingWhStorageId,
                            pdBranchId: pdBranch?.pdBranchId || null,
                            pdWhId: data.pdWhId || null,
                            ohQty: 0,
                            allocatedQty: 0,
                            whZoneId: null,
                            whAisleId: null,
                            whRackId: null,
                            whShelfId: null,
                            whStorageRestrictionId: null
                        }
                        newPdStorages.push(s)
                    }

                    if (!pdStorageMap[wh.packingWhStorageId] && wh.packingWhStorageId !== null) {
                        const s: PdStorage = {
                            pdStorageId: this.service.generateId(),
                            pdId: data.pdId,
                            whId: data.whId,
                            whStorageId: wh.packingWhStorageId,
                            pdBranchId: data.pdBranchId || pdBranch?.pdBranchId || null,
                            pdWhId: data.pdWhId || null,
                            ohQty: 0,
                            allocatedQty: 0,
                            whZoneId: null,
                            whAisleId: null,
                            whRackId: null,
                            whShelfId: null,
                            whStorageRestrictionId: null
                        }
                        newPdStorages.push(s)
                    }

                    if (!pdStorageMap[wh.shippingWhStorageId] && wh.shippingWhStorageId !== null) {
                        const s: PdStorage = {
                            pdStorageId: this.service.generateId(),
                            pdId: data.pdId,
                            whId: data.whId,
                            whStorageId: wh.shippingWhStorageId,
                            pdBranchId: data.pdBranchId ||  pdBranch?.pdBranchId || null,
                            pdWhId: data.pdWhId || null,
                            ohQty: 0,
                            allocatedQty: 0,
                            whZoneId: null,
                            whAisleId: null,
                            whRackId: null,
                            whShelfId: null,
                            whStorageRestrictionId: null
                        }
                        newPdStorages.push(s)
                    }

                    if (newPdStorages.length > 0) {
                        await this.pdStorageService.addList({ bid, brid, skipBridCheck, data: newPdStorages, batch: true, sharedClient });
                        pdStorages = await this.pdStorageService.get({ bid, brid, filter: { pdId: data.pdId }, sharedClient });
                        pdStorageMap = groupBy(pdStorages, 'whStorageId')
                    }

                    const morphData = data as PdWh;

                    morphData.pdBranchId = data.branchId || pdBranch?.pdBranchId || null;
                    morphData.refPdNo = pdBranch?.pdNo || null;
                    morphData.refPdName = pdBranch?.pdName || null;
                    morphData.refWhNo = wh?.whNo || null;
                    morphData.refWhName = wh?.whName || null;

                    resolve(morphData)

                } else {

                    resolve(data)

                }

            } catch(e) {
                reject(e)
            }
        })
    }

    syncQty(params: PdWhSyncQtyParamsType) {
        return new Promise<{ persist: boolean; pdWh: any; }>( async (resolve, reject) => {

            const { bid, brid, pdWh, persistOutside, cascading, preloaded, sharedClient } = params;

            try {

                let pdStorages: PdStorage[];

                if (preloaded && preloaded.pdStorageMap[pdWh.pdId]) {

                    pdStorages = preloaded.pdStorageMap[pdWh.pdId].filter( pds => pds.pdId = pdWh.pdId)

                } else {

                    pdStorages = await this.pdStorageService.get({ bid, brid: pdWh.branchId, filter: { _and: [ { pdId: pdWh.pdId }, { whId: pdWh.whId } ] }, sharedClient })

                }

                let ohQty = 0;
                let allocatedQty = 0;
                let pdStorageQty: any;
                let pdStorageData: any;

                if (cascading) {

                    pdStorageQty = await Promise.all(pdStorages.map(async pdStorage => {
                        try {
                            return await this.pdStorageService.syncQty({ bid, brid: pdStorage.branchId, pdStorage, persistOutside, preloaded, sharedClient });
                        } catch(e) {
                            return null;
                        }
                    }))

                    pdStorageQty.filter(s => s.pdStorage.ohQty > 0).forEach( item  => {
                        if (item) {
                            ohQty = ohQty + item.pdStorage.ohQty
                            allocatedQty = allocatedQty + (item.pdStorage.allocatedQty || 0);
                        }
                    })

                    pdStorageData = pdStorageQty.filter( item => item && item.persist).map( item => item && item.pdStorage );

                } else {

                    ohQty = pdWh.ohQty;
                    allocatedQty = pdWh.allocatedQty;

                }


                const data = { pdWhId: pdWh.pdWhId, ohQty: ohQty,  allocatedQty: allocatedQty };

                if (persistOutside) {

                    resolve({ persist: true, pdWh: { ...data, pdStorage: pdStorageData } });

                } else {

                    if (pdStorageData.length > 0) {
                        await this.pdStorageService.updateList({ bid, brid, data: pdStorageData, batch: true, sharedClient});
                    }

                    await this.update({ bid, brid, data, sharedClient });

                    resolve({ persist: false, pdWh: data });

                }

            } catch(e) {

                reject(e)

            }
        })
    }

    allocateQty(params: PdWhAllocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdWhId, qty, preloaded, bubble, sharedClient } = params;

                let pdWh: PdWh;

                if (preloaded && preloaded.pdWhMap[pdWhId]) {
                    pdWh = preloaded.pdWhMap[pdWhId];
                } else {
                    pdWh = await this.getById( bid, { id: pdWhId }, sharedClient )
                }

                if (!pdWh.ohQty || pdWh.ohQty <= 0) {
                    throw new Error('No quantity for allocation.')
                }

                const newQty = pdWh.allocatedQty + qty;

                if (newQty > (pdWh.ohQty - pdWh.allocatedQty)) {
                    throw new Error(`Quantity can allocate ${(pdWh.ohQty - pdWh.allocatedQty)} of ${qty}. current on-hand: ${pdWh.ohQty}, current allocated: ${pdWh.allocatedQty}`)
                }


                await this.update({ bid, brid, data:{ pdWhId: pdWh.pdWhId, allocatedQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdBranchService.allocateQty({ bid, brid, pdBranchId: pdWh.pdBranchId, qty, preloaded, bubble, sharedClient })
                }

                const miniRec = {pdWhId: pdWh.pdWhId, lastAllocatedQty: pdWh.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    deallocateQty(params: PdWhDeallocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdWhId, qty, preloaded, bubble, sharedClient } = params;

                let pdWh: PdWh;

                if (preloaded && preloaded.pdWhMap[pdWhId]) {
                    pdWh = preloaded.pdWhMap[pdWhId];
                } else {
                    pdWh = await this.getById( bid, { id: pdWhId }, sharedClient )
                }

                const newQty = pdWh.allocatedQty - qty;

                if (!pdWh.allowNegativeQty && newQty < 0) {
                    throw new Error('negative allocation not allowed.')
                }

                await this.update({ bid, brid, data:{ pdWhId: pdWh.pdWhId, allocatedQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdBranchService.deallocateQty({ bid, brid, pdBranchId: pdWh.pdBranchId, qty, preloaded, bubble, sharedClient })
                }

                const miniRec = {pdWhId: pdWh.pdWhId, lastAllocatedQty: pdWh.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    increaseQty(params: PdWhIncreaseParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdWhId, qty, preloaded, bubble, sharedClient } = params;

                let pdWh: PdWh;

                if (preloaded && preloaded.pdWhMap[pdWhId]) {
                    pdWh = preloaded.pdWhMap[pdWhId];
                } else {
                    pdWh = await this.getById( bid, { id: pdWhId }, sharedClient )
                }

                const newQty = pdWh.ohQty + qty;

                await this.update({ bid, brid, data:{ pdWhId: pdWh.pdWhId, ohQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdBranchService.increaseQty({ bid, brid, pdBranchId: pdWh.pdBranchId, qty, preloaded, bubble, sharedClient })
                }

                const miniRec = {pdWhId: pdWh.pdWhId, lastQty: pdWh.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    decreaseQty(params: PdWhDecreaseParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdWhId, qty, preloaded, bubble, sharedClient } = params;

                let pdWh: PdWh;

                if (preloaded && preloaded.pdWhMap[pdWhId]) {
                    pdWh = preloaded.pdWhMap[pdWhId];
                } else {
                    pdWh = await this.getById( bid, { id: pdWhId }, sharedClient )
                }

                const newQty = pdWh.ohQty - qty;

                if (!pdWh.allowNegativeQty && newQty < 0) {
                    throw new Error('negative stock not allowed.')
                }

                await this.update({ bid, brid, data:{ pdWhId: pdWh.pdWhId, ohQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdBranchService.decreaseQty({ bid, brid, pdBranchId: pdWh.pdBranchId, qty, preloaded, bubble, sharedClient })
                }

                const miniRec = {pdWhId: pdWh.pdWhId, lastQty: pdWh.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

}
