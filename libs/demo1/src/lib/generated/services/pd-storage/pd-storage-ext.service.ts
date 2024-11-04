import { PdStorageService } from "./pd-storage.service";
import { PdStorage } from "../../interfaces/pd-storage.model";
import { PdLotStorage } from "../../interfaces/pd-lot-storage.model";
import { Pd } from "../../interfaces/pd.model";
import { PdWhExtService } from "../pd-wh";
import { PdExtService } from "../pd/pd-ext.service";
import { WhStorageService, WhStorageExtService } from "../wh-storage";
import { PdLotStorageExtService } from "../pd-lot-storage";
import { PdAvailableByAisleReturnType, PdAvailableByBranchReturnType, PdAvailableByRackReturnType, PdAvailableByShelfReturnType, PdAvailableByStorageReturnType, PdAvailableByWhReturnType, PdAvailableByZoneReturnType, PdStorageAdjustParamsType, PdStorageAllocateParamsType, PdStorageDeallocateParamsType, PdStorageDecreaseParamsType, PdStorageIncreaseParamsType, PdStorageSyncQtyParamsType, PdStorageTransferParamsType, TransferToSuParamsType } from "./pd-storage.interface";
import { BeforeTriggerType } from "@bc365-server/common/services/db.interface";
import { WhZoneExtService } from "../wh-zone";
import { WhAisleExtService } from "../wh-aisle";
import { WhRackExtService } from "../wh-rack";
import { WhShelfExtService } from "../wh-shelf";
import { keyBy } from "lodash";
import { WhExtService } from "../wh";
import { BranchExtService } from "../branch";
import { WhSuExtService } from "../wh-su";
import { PdSuExtService } from "../pd-su";

export class PdStorageExtService extends PdStorageService {

    get pdService() {
        return this.modRef.get<PdExtService>(PdExtService)
    }

    get pdWhService() {
        return this.modRef.get<PdWhExtService>(PdWhExtService)
    }

    get pdSuService() {
        return this.modRef.get<PdSuExtService>(PdSuExtService)
    }

    get branchService() {
        return this.modRef.get<BranchExtService>(BranchExtService)
    }

    get whService() {
        return this.modRef.get<WhExtService>(WhExtService)
    }

    get whZoneService() {
        return this.modRef.get<WhZoneExtService>(WhZoneExtService)
    }

    get whAisleService() {
        return this.modRef.get<WhAisleExtService>(WhAisleExtService)
    }

    get whRackService() {
        return this.modRef.get<WhRackExtService>(WhRackExtService)
    }

    get whShelfService() {
        return this.modRef.get<WhShelfExtService>(WhShelfExtService)
    }

    get whStorageService() {
        return this.modRef.get<WhStorageExtService>(WhStorageExtService)
    }

    get whSuService() {
        return this.modRef.get<WhSuExtService>(WhSuExtService)
    }

    get pdLotStorageService() {
        return this.modRef.get<PdLotStorageExtService>(PdLotStorageExtService)
    }

    get storageService() {
        return this.modRef.get<WhStorageService>(WhStorageExtService)
    }

    getOrCreate(params: { bid: string; brid: string; pdId: string; whStorageId: string; sharedClient?: any }) {
        return new Promise<PdStorage>( async (resolve, reject) => {
            try {
                const { bid, brid, pdId, whStorageId, sharedClient } = params;
                let pdStorage: PdStorage = await this.getOne({ bid, brid, filter: { _and: [ {pdId: pdId}, {whStorageId: whStorageId}] }, sharedClient });
                if (pdStorage) {
                    resolve(pdStorage)
                } else {
                    const pd = await this.pdService.getById(bid, { id: pdId }, sharedClient);
                    if (!pd) {
                        throw new Error('Product not found')
                    }
                    const whStorage = await this.whStorageService.getById(bid, { id: whStorageId}, sharedClient);
                    if (!whStorage) {
                        throw new Error('Storage not found')
                    }
                    pdStorage = {
                        pdStorageId: this.service.generateId(),
                        pdId: pdId,
                        whStorageId: whStorageId,
                        ohQty: 0,
                        allocatedQty: 0
                    }
                    pdStorage = await this.add({ bid, brid, data: pdStorage, sharedClient})
                    resolve(pdStorage)
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

                if (typeof data.whStorageId !== 'undefined') {

                    const whStorage = await this.whStorageService.getById(bid, { id: data.whStorageId }, sharedClient);

                    if (whStorage) {

                        // console.log({pdId: data.pdId}, {whId: whStorage.whId})

                        const pdWh = await this.pdWhService.getOne({ bid, brid, filter: { _and: [ {pdId: data.pdId}, {whId: whStorage.whId} ] }, sharedClient })

                        // console.log(pdWh)

                        const morphData = data as PdStorage;

                        morphData.whId = whStorage.whId;
                        morphData.pdBranchId = data.pdBranchId || pdWh?.pdBranchId || null;
                        morphData.pdWhId = data.pdWhId || pdWh?.pdWhId || null;
                        morphData.whZoneId = whStorage.whZoneId;
                        morphData.whAisleId = whStorage.whAisleId;
                        morphData.whRackId = whStorage.whRackId;
                        morphData.whShelfId = whStorage.whShelfId;
                        morphData.whStorageRestrictionId = whStorage.whStorageRestrictionId;
                        morphData.refPdNo = pdWh?.refPdNo || null;
                        morphData.refPdName = pdWh?.refPdName || null;
                        morphData.refStorageNo = whStorage.storageNo || null;
                        morphData.refStorageName = whStorage.storageName || null;

                        resolve(morphData)

                    } else {

                        resolve(data)

                    }

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

                const { bid, brid, data, sharedClient } = params;

                if (typeof data.whStorageId !== 'undefined') {

                    const whStorage = await this.whStorageService.getById(bid, { id: data.whStorageId }, sharedClient);

                    if (whStorage) {

                        const pdWh = await this.pdWhService.getOne({ bid, brid, filter: { _and: [ {pdId: data.pdId}, {whId: whStorage.whId} ] }, sharedClient })

                        const morphData = data as PdStorage;

                        morphData.whId = whStorage.whId;
                        morphData.pdBranchId = data.pdBranchId || pdWh?.pdBranchId || null;
                        morphData.pdWhId = data.pdWhId || pdWh?.pdWhId || null;
                        morphData.whZoneId = whStorage.whZoneId;
                        morphData.whAisleId = whStorage.whAisleId;
                        morphData.whRackId = whStorage.whRackId;
                        morphData.whShelfId = whStorage.whShelfId;
                        morphData.whStorageRestrictionId = whStorage.whStorageRestrictionId;
                        morphData.refPdNo = pdWh?.refPdNo;
                        morphData.refPdName = pdWh?.refPdName;
                        morphData.refStorageNo = whStorage.storageNo;
                        morphData.refStorageName = whStorage.storageName;

                        resolve(morphData)

                    } else {

                        resolve(data)


                    }

                } else {

                    resolve(data)

                }

            } catch(e) {
                reject(e)
            }
        })
    }

    syncQty(params: PdStorageSyncQtyParamsType) {
        return new Promise<{ persist: boolean; pdStorage: any; }>( async (resolve, reject) => {

            const { bid, brid, pdStorage, persistOutside, preloaded, sharedClient } = params;

            try {

                let pd: Pd;

                if (preloaded && preloaded.pdMap) {
                    pd = preloaded.pdMap[pdStorage.pdId]
                } else {
                    pd = await this.pdService.getById(bid, { id: pdStorage.pdId }, sharedClient)
                }

                if (pd.useLot) {

                    const pdLotStorages: PdLotStorage[] = await this.pdLotStorageService.get({ bid, brid, filter: { _and: [ { pdId: pdStorage.pdId }, { whStorageId: pdStorage.whStorageId } ] }, sharedClient })

                    let ohQty = 0;
                    let allocatedQty = 0;

                    pdLotStorages.forEach( item => {
                        ohQty = ohQty + item.ohQty
                        allocatedQty = allocatedQty + (item.allocatedQty || 0);
                    })

                    if (persistOutside) {

                        const data = { pdStorageId: pdStorage.pdStorageId, ohQty: ohQty,  allocatedQty: allocatedQty };

                        resolve({ persist: true, pdStorage: data })

                    } else {

                        const data = { pdStorageId: pdStorage.pdStorageId, ohQty: ohQty,  allocatedQty: allocatedQty };

                        await this.update({ bid, brid, data, sharedClient })

                        resolve({ persist: false, pdStorage: data })

                    }


                } else {

                    const data = { pdStorageId: pdStorage.pdStorageId, ohQty: pdStorage.ohQty,  allocatedQty: pdStorage.allocatedQty };

                    resolve({ persist: false, pdStorage: data })

                }
            } catch(e) {

                console.log(e)

                reject(e)
            }
        })
    }

    allocateQty(params: PdStorageAllocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdStorageId, qty, preloaded, bubble, sharedClient } = params;

                let pdStorage: PdStorage;

                if (preloaded && preloaded.pdStorageMap[pdStorageId]) {
                    pdStorage = preloaded.pdStorageMap[pdStorageId];
                } else {
                    pdStorage = await this.getById( bid, { id: pdStorageId }, sharedClient )
                }

                if (!pdStorage.ohQty || pdStorage.ohQty <= 0) {
                    throw new Error('No quantity for allocation.')
                }

                const newQty = pdStorage.allocatedQty + qty;

                if (newQty > (pdStorage.ohQty - pdStorage.allocatedQty)) {
                    throw new Error(`Quantity can allocate ${(pdStorage.ohQty - pdStorage.allocatedQty)} of ${qty}. current on-hand: ${pdStorage.ohQty}, current allocated: ${pdStorage.allocatedQty}`)
                }

                await this.update({ bid, brid, data: { pdStorageId: pdStorage.pdStorageId, allocatedQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdWhService.allocateQty({ bid, brid, pdWhId: pdStorage.pdWhId, qty, preloaded, sharedClient })
                }

                const miniRec = {pdStorageId: pdStorage.pdStorageId, whStorageId: pdStorage.whStorageId, pdWhId: pdStorage.pdWhId, pdBranchId: pdStorage.pdBranchId, lastAllocatedQty: pdStorage.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    deallocateQty(params: PdStorageDeallocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdStorageId, qty, preloaded, bubble, sharedClient } = params;

                let pdStorage: PdStorage;

                if (preloaded && preloaded.pdStorageMap[pdStorageId]) {
                    pdStorage = preloaded.pdStorageMap[pdStorageId];
                } else {
                    pdStorage = await this.getById( bid, { id: pdStorageId }, sharedClient )
                }

                const newQty = pdStorage.allocatedQty - qty;

                if (!pdStorage.allowNegativeQty && newQty < 0) {
                    throw new Error('negative alstorageation not allowed.')
                }


                await this.update({ bid, brid, data: { pdStorageId: pdStorage.pdStorageId, allocatedQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdWhService.deallocateQty({ bid, brid, pdWhId: pdStorage.pdWhId, qty, preloaded, sharedClient })
                }

                const miniRec = {pdStorageId: pdStorage.pdStorageId, whStorageId: pdStorage.whStorageId, pdWhId: pdStorage.pdWhId, pdBranchId: pdStorage.pdBranchId, lastAllocatedQty: pdStorage.allocatedQty, allocatedQty: newQty}


                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    increaseQty(params: PdStorageIncreaseParamsType) {
        return new Promise<{ pdStorageId: string; whStorageId: string; pdWhId: string; pdBranchId: string; refStorageNo: string; lastQty: number; newQty: number; }>( async (resolve, reject) => {
            try {

                let { bid, brid, pdStorageId, qty, preloaded, bubble, sharedClient } = params;

                let pdStorage: PdStorage;

                if (preloaded && preloaded.pdStorageMap[pdStorageId]) {
                    pdStorage = preloaded.pdStorageMap[pdStorageId];
                } else {
                    pdStorage = await this.getById( bid, { id: pdStorageId }, sharedClient )
                }

                const newQty = pdStorage.ohQty + qty;

                await this.update({ bid, brid, data: { pdStorageId: pdStorage.pdStorageId, ohQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdWhService.increaseQty({ bid, brid, pdWhId: pdStorage.pdWhId, qty, preloaded, sharedClient })
                }

                const miniRec = {pdStorageId: pdStorage.pdStorageId, whStorageId: pdStorage.whStorageId, pdWhId: pdStorage.pdWhId, pdBranchId: pdStorage.pdBranchId, refStorageNo: pdStorage.refStorageNo, lastQty: pdStorage.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    decreaseQty(params: PdStorageDecreaseParamsType) {
        return new Promise<{ pdStorageId: string; whStorageId: string; pdWhId: string; pdBranchId: string; refStorageNo: string; lastQty: number; newQty: number; }>( async (resolve, reject) => {
            try {

                let { bid, brid, pdStorageId, qty, preloaded, bubble, sharedClient } = params;

                let pdStorage: PdStorage;

                if (preloaded && preloaded.pdStorageMap[pdStorageId]) {
                    pdStorage = preloaded.pdStorageMap[pdStorageId];
                } else {
                    pdStorage = await this.getById( bid, { id: pdStorageId }, sharedClient )
                }

                const newQty = pdStorage.ohQty - qty;

                await this.update({ bid, brid, data: { pdStorageId: pdStorage.pdStorageId, ohQty: newQty }, sharedClient })

                if (bubble) {
                    await this.pdWhService.decreaseQty({ bid, brid, pdWhId: pdStorage.pdWhId, qty, preloaded, sharedClient })
                }

                const miniRec = {pdStorageId: pdStorage.pdStorageId, whStorageId: pdStorage.whStorageId, pdWhId: pdStorage.pdWhId, pdBranchId: pdStorage.pdBranchId, refStorageNo: pdStorage.refStorageNo, lastQty: pdStorage.ohQty, newQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    adjustQty(params: PdStorageAdjustParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdStorageId, qty, preloaded, bubble, sharedClient } = params;

                let pdStorage: PdStorage;

                if (preloaded && preloaded.pdStorageMap[pdStorageId]) {
                    pdStorage = preloaded.pdStorageMap[pdStorageId];
                } else {
                    pdStorage = await this.getById( bid, { id: pdStorageId }, sharedClient )
                }

                let diffQty = 0;

                if (pdStorage.ohQty >= qty) {

                    if (pdStorage.ohQty - pdStorage.allocatedQty < qty) {
                        throw new Error('available qty is less than quantity to adjust')
                    }

                    diffQty = pdStorage.ohQty - qty;

                    const miniRec = await this.decreaseQty({ bid, brid, pdStorageId: pdStorageId, qty: diffQty, preloaded, bubble, sharedClient });

                    resolve(miniRec)

                } else {

                    diffQty = qty - pdStorage.ohQty;

                    const miniRec = await this.increaseQty({ bid, brid, pdStorageId: pdStorageId, qty: diffQty, preloaded, bubble, sharedClient });

                    resolve(miniRec)

                }

            } catch(e) {

                reject(e)

            }
        })
    }

    transferQty(params: PdStorageTransferParamsType ) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, srcPdStorageId, dstPdStorageId, qty, preloaded, sharedClient } = params;

                const srcData = await this.decreaseQty({ bid, brid, pdStorageId: srcPdStorageId, qty, preloaded, bubble: false, sharedClient });

                const dstData = await this.increaseQty({ bid, brid, pdStorageId: dstPdStorageId, qty, preloaded, bubble: false, sharedClient });

                const miniRec = {src: srcData, dst: dstData }

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    pdAvailableByBranch(params: { bid: string; brid: string; pdId?: string; loadedStorages?: PdStorage[]; }) {
        return new Promise<PdAvailableByBranchReturnType | PdAvailableByBranchReturnType[]>( async (resolve, reject) => {
            try {
                let { bid, brid, pdId, loadedStorages } = params;
                let pdStorages: PdStorage[];
                if (pdId) {
                    const pd = await this.pdService.getById(bid, { id: pdId })
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { pdId: pdId} });
                    } else {
                        pdStorages = loadedStorages;
                    }
                    const branch = await this.branchService.getById(bid, { id: brid });
                    let ohQty = 0;
                    let allocatedQty = 0;
                    pdStorages.forEach( s => {
                        ohQty += s.ohQty || 0;
                        allocatedQty += s.allocatedQty || 0;
                    })
                    resolve({
                        pdId: pd.pdId,
                        pdNo: pd.pdNo,
                        pdName: pd.pdName,
                        branchId: brid,
                        branchNo: branch.branchNo,
                        branchName: branch.branchName,
                        ohQty: ohQty,
                        allocatedQty: allocatedQty,
                        availQty: ohQty - allocatedQty
                    });
                } else {
                    const pds = await this.pdService.get({ bid, brid });
                    const pdMap = keyBy(pds, 'pdId')
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid });
                    } else {
                        pdStorages = loadedStorages;
                    }
                    const branch = await this.branchService.getById(bid, { id: brid });
                    const storages: PdAvailableByBranchReturnType[] = [];
                    const availeMap = {};
                    pdStorages.forEach( s => {
                        const pd = pdMap[s.pdId]
                        if (availeMap[s.pdId]) {
                            availeMap[s.pdId].ohQty += s.ohQty;
                            availeMap[s.pdId].allocatedQty  += s.allocatedQty;
                            availeMap[s.pdId].availQty = availeMap[s.pdId].ohQty - availeMap[s.pdId].allocatedQty;
                        } else {
                            availeMap[s.pdId] = {
                                pdId: pd.pdId,
                                pdNo: pd.pdNo,
                                pdName: pd.pdName,
                                branchId: brid,
                                branchNo: branch.branchNo,
                                branchName: branch.branchName,
                                ohQty: s.ohQty,
                                allocatedQty: s.allocatedQty,
                                availQty: s.ohQty - s.allocatedQty
                            }
                        }
                    })
                    const pdIds = Object.keys(availeMap);
                    pdIds.forEach( pdId => {
                        storages.push(availeMap[pdId]);
                    })
                    resolve(storages)
                }
            } catch(e) {
                reject(e)
            }
        })
    }

    pdAvailableByWh(params: { bid: string; brid: string; whId: string; pdId?: string; loadedStorages?: PdStorage[]; }) {
        return new Promise<PdAvailableByWhReturnType | PdAvailableByWhReturnType[]>( async (resolve, reject) => {
            try {
                const { bid, brid, pdId, whId, loadedStorages } = params;
                let pdStorages: PdStorage[];
                if (pdId) {
                    const pd = await this.pdService.getById(bid, { id: pdId })
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { _and: [ {pdId: pdId}, {whId: whId} ] } });
                    } else {
                        pdStorages = loadedStorages;
                    }
                    const wh = await this.whService.getById(bid, { id: whId });
                    let ohQty = 0;
                    let allocatedQty = 0;
                    pdStorages.forEach( s => {
                        ohQty += s.ohQty || 0;
                        allocatedQty += s.allocatedQty || 0;
                    })
                    resolve({
                        pdId: pd.pdId,
                        pdNo: pd.pdNo,
                        pdName: pd.pdName,
                        whId: wh.whId,
                        whNo: wh.whNo,
                        whName: wh.whName,
                        ohQty: ohQty,
                        allocatedQty: allocatedQty,
                        availQty: ohQty - allocatedQty
                    });
                } else {
                    const pds = await this.pdService.get({ bid, brid });
                    const pdMap = keyBy(pds, 'pdId')
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { whId: whId} });
                    } else {
                        pdStorages = loadedStorages.filter( s => s.whId === whId);
                    }
                    const wh = await this.whService.getById(bid, { id: whId });
                    const storages: PdAvailableByWhReturnType[] = [];
                    const availeMap = {};
                    pdStorages.forEach( s => {
                        const pd = pdMap[s.pdId]
                        if (availeMap[s.pdId]) {
                            availeMap[s.pdId].ohQty += s.ohQty;
                            availeMap[s.pdId].allocatedQty  += s.allocatedQty;
                            availeMap[s.pdId].availQty  = availeMap[s.pdId].ohQty - availeMap[s.pdId].allocatedQty;
                        } else {
                            availeMap[s.pdId] = {
                                pdId: pd.pdId,
                                pdNo: pd.pdNo,
                                pdName: pd.pdName,
                                whId: wh.whId,
                                whNo: wh.whNo,
                                whName: wh.whName,
                                ohQty: s.ohQty,
                                allocatedQty: s.allocatedQty,
                                availQty: s.ohQty - s.allocatedQty
                            }
                        }
                    })
                    const pdIds = Object.keys(availeMap);
                    pdIds.forEach( pdId => {
                        storages.push(availeMap[pdId]);
                    })
                    resolve(storages)
                }
            } catch(e) {
                reject(e)
            }
        })
    }

    pdAvailableByZone(params: { bid: string; brid: string; whZoneId: string; pdId?: string; loadedStorages?: PdStorage[]; }) {
        return new Promise<PdAvailableByZoneReturnType | PdAvailableByZoneReturnType[]>( async (resolve, reject) => {
            try {
                const { bid, brid, pdId, whZoneId, loadedStorages } = params;
                let pdStorages: PdStorage[];
                if (pdId) {
                    const pd = await this.pdService.getById(bid, { id: pdId })
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { _and: [ {pdId: pdId}, {whZoneId: whZoneId} ] } });
                    } else {
                        pdStorages = loadedStorages.filter( s => s.pdId === pdId && s.whZoneId === whZoneId );
                    }
                    const whZone = await this.whZoneService.getById(bid, { id: whZoneId });
                    let ohQty = 0;
                    let allocatedQty = 0;
                    pdStorages.forEach( s => {
                        ohQty += s.ohQty || 0;
                        allocatedQty += s.allocatedQty || 0;
                    })
                    resolve({
                        pdId: pd.pdId,
                        pdNo: pd.pdNo,
                        pdName: pd.pdName,
                        whZoneId: whZoneId,
                        whZoneNo: whZone.whZoneNo,
                        whZoneName: whZone.whZoneName,
                        ohQty: ohQty,
                        allocatedQty: allocatedQty,
                        availQty: ohQty - allocatedQty
                    });
                } else {
                    const pds = await this.pdService.get({ bid, brid });
                    const pdMap = keyBy(pds, 'pdId')
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { whZoneId: whZoneId} });
                    } else {
                        pdStorages = loadedStorages.filter( s => s.whZoneId === whZoneId );
                    }
                    const whZone = await this.whZoneService.getById(bid, { id: whZoneId });
                    const storages: PdAvailableByZoneReturnType[] = [];
                    const availeMap = {};
                    pdStorages.forEach( s => {
                        const pd = pdMap[s.pdId]
                        if (availeMap[s.pdId]) {
                            availeMap[s.pdId].ohQty += s.ohQty;
                            availeMap[s.pdId].allocatedQty  += s.allocatedQty;
                            availeMap[s.pdId].availQty = availeMap[s.pdId].ohQty - availeMap[s.pdId].allocatedQty;
                        } else {
                            availeMap[s.pdId] = {
                                pdId: pd.pdId,
                                pdNo: pd.pdNo,
                                pdName: pd.pdName,
                                whZoneId: whZoneId,
                                whZoneNo: whZone.whZoneNo,
                                whZoneName: whZone.whZoneName,
                                ohQty: s.ohQty,
                                allocatedQty: s.allocatedQty,
                                availQty: s.ohQty - s.allocatedQty
                            }
                        }
                    })
                    const pdIds = Object.keys(availeMap);
                    pdIds.forEach( pdId => {
                        storages.push(availeMap[pdId]);
                    })
                    resolve(storages)
                }
            } catch(e) {
                reject(e)
            }
        })
    }

    pdAvailableByAisle(params: { bid: string; brid: string; whAisleId: string; pdId?: string; loadedStorages?: PdStorage[]; }) {
        return new Promise<PdAvailableByAisleReturnType | PdAvailableByAisleReturnType[]>( async (resolve, reject) => {
            try {
                const { bid, brid, pdId, whAisleId, loadedStorages } = params;
                let pdStorages: PdStorage[];
                if (pdId) {
                    const pd = await this.pdService.getById(bid, { id: pdId })
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { _and: [ {pdId: pdId}, {whAisleId: whAisleId} ] } });
                    } else {
                        pdStorages = loadedStorages.filter( s => s.pdId === pdId && s.whAisleId === whAisleId );
                    }
                    const whAisle = await this.whAisleService.getById(bid, { id: whAisleId });
                    let ohQty = 0;
                    let allocatedQty = 0;
                    pdStorages.forEach( s => {
                        ohQty += s.ohQty || 0;
                        allocatedQty += s.allocatedQty || 0;
                    })
                    resolve({
                        pdId: pd.pdId,
                        pdNo: pd.pdNo,
                        pdName: pd.pdName,
                        whAisleId: whAisleId,
                        whAisleNo: whAisle.whAisleNo,
                        whAisleName: whAisle.whAisleName,
                        ohQty: ohQty,
                        allocatedQty: allocatedQty,
                        availQty: ohQty - allocatedQty
                    });
                } else {
                    const pds = await this.pdService.get({ bid, brid });
                    const pdMap = keyBy(pds, 'pdId')
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { whAisleId: whAisleId} });
                    } else {
                        pdStorages = loadedStorages.filter( s => s.whAisleId === whAisleId );
                    }
                    const whAisle = await this.whAisleService.getById(bid, { id: whAisleId });
                    const storages: PdAvailableByAisleReturnType[] = [];
                    const availeMap = {};
                    pdStorages.forEach( s => {
                        const pd = pdMap[s.pdId]
                        if (availeMap[s.pdId]) {
                            availeMap[s.pdId].ohQty += s.ohQty;
                            availeMap[s.pdId].allocatedQty  += s.allocatedQty;
                            availeMap[s.pdId].availQty  = availeMap[s.pdId].ohQty - availeMap[s.pdId].allocatedQty;
                        } else {
                            availeMap[s.pdId] = {
                                pdId: pd.pdId,
                                pdNo: pd.pdNo,
                                pdName: pd.pdName,
                                whAisleId: whAisleId,
                                whAisleNo: whAisle.whAisleNo,
                                whAisleName: whAisle.whAisleName,
                                ohQty: s.ohQty,
                                allocatedQty: s.allocatedQty,
                                availQty: s.ohQty - s.allocatedQty
                            }
                        }
                    })
                    const pdIds = Object.keys(availeMap);
                    pdIds.forEach( pdId => {
                        storages.push(availeMap[pdId]);
                    })
                    resolve(storages)
                }
            } catch(e) {
                reject(e)
            }
        })
    }

    pdAvailableByRack(params: { bid: string; brid: string; whRackId: string; pdId?: string; loadedStorages?: PdStorage[]; }) {
        return new Promise<PdAvailableByRackReturnType | PdAvailableByRackReturnType[]>( async (resolve, reject) => {
            try {
                const { bid, brid, pdId, whRackId, loadedStorages } = params;
                let pdStorages: PdStorage[];
                if (pdId) {
                    const pd = await this.pdService.getById(bid, { id: pdId })
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { _and: [ {pdId: pdId}, {whRackId: whRackId} ] } });
                    } else {
                        pdStorages = loadedStorages.filter( s => s.pdId === pdId && s.whRackId === whRackId );
                    }
                    const whRack = await this.whRackService.getById(bid, { id: whRackId });
                    let ohQty = 0;
                    let allocatedQty = 0;
                    pdStorages.forEach( s => {
                        ohQty += s.ohQty || 0;
                        allocatedQty += s.allocatedQty || 0;
                    })
                    resolve({
                        pdId: pdId,
                        pdNo: pd.pdNo,
                        pdName: pd.pdName,
                        whRackId: whRackId,
                        whRackNo: whRack.whRackNo,
                        whRackName: whRack.whRackName,
                        ohQty: ohQty,
                        allocatedQty: allocatedQty,
                        availQty: ohQty - allocatedQty
                    });
                } else {
                    const pds = await this.pdService.get({ bid, brid });
                    const pdMap = keyBy(pds, 'pdId')
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { whRackId: whRackId} });
                    } else {
                        pdStorages = loadedStorages.filter( s => s.whRackId === whRackId );
                    }
                    const whRack = await this.whRackService.getById(bid, { id: whRackId });
                    const storages: PdAvailableByRackReturnType[] = [];
                    const availeMap = {};
                    pdStorages.forEach( s => {
                        const pd = pdMap[s.pdId]
                        if (availeMap[s.pdId]) {
                            availeMap[s.pdId].ohQty += s.ohQty;
                            availeMap[s.pdId].allocatedQty  += s.allocatedQty;
                            availeMap[s.pdId].availQty = availeMap[s.pdId].ohQty - availeMap[s.pdId].allocatedQty;
                        } else {
                            availeMap[s.pdId] = {
                                pdId: pd.pdId,
                                pdNo: pd.pdNo,
                                pdName: pd.pdName,
                                whRackId: whRackId,
                                whRackNo: whRack.whRackNo,
                                whRackName: whRack.whRackName,
                                ohQty: s.ohQty,
                                allocatedQty: s.allocatedQty,
                                availQty: s.ohQty - s.allocatedQty
                            }
                        }
                    })
                    const pdIds = Object.keys(availeMap);
                    pdIds.forEach( pdId => {
                        storages.push(availeMap[pdId]);
                    })
                    resolve(storages)
                }
            } catch(e) {
                reject(e)
            }
        })
    }

    pdAvailableByShelf(params: { bid: string; brid: string; whShelfId: string; pdId?: string; loadedStorages?: PdStorage[]; }) {
        return new Promise<PdAvailableByShelfReturnType | PdAvailableByShelfReturnType[]>( async (resolve, reject) => {
            try {
                const { bid, brid, pdId, whShelfId, loadedStorages } = params;
                let pdStorages: PdStorage[];
                if (pdId) {
                    const pd = await this.pdService.getById(bid, { id: pdId })
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { _and: [ {pdId: pdId}, {whShelfId: whShelfId} ] } });
                    } else {
                        pdStorages = loadedStorages.filter( s => s.pdId === pdId && s.whShelfId === whShelfId );
                    }
                    const whShelf = await this.whShelfService.getById(bid, { id: whShelfId });
                    let ohQty = 0;
                    let allocatedQty = 0;
                    pdStorages.forEach( s => {
                        ohQty += s.ohQty || 0;
                        allocatedQty += s.allocatedQty || 0;
                    })
                    const avail: PdAvailableByShelfReturnType = {
                        pdId: pdId,
                        pdNo: pd.pdNo,
                        pdName: pd.pdName,
                        whShelfId: whShelfId,
                        whShelfNo: whShelf.whShelfNo,
                        whShelfName: whShelf.whShelfName,
                        ohQty: ohQty,
                        allocatedQty: allocatedQty,
                        availQty: ohQty - allocatedQty
                    }
                    resolve(avail);
                } else {
                    const pds = await this.pdService.get({ bid, brid });
                    const pdMap = keyBy(pds, 'pdId')
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { whShelfId: whShelfId} });
                    } else {
                        pdStorages = loadedStorages.filter( s => s.whShelfId === whShelfId );
                    }
                    const whShelf = await this.whShelfService.getById(bid, { id: whShelfId });
                    const storages: PdAvailableByShelfReturnType[] = [];
                    const availeMap = {};
                    pdStorages.forEach( s => {
                        const pd = pdMap[s.pdId]
                        if (availeMap[s.pdId]) {
                            availeMap[s.pdId].ohQty += s.ohQty;
                            availeMap[s.pdId].allocatedQty  += s.allocatedQty;
                            availeMap[s.pdId].availQty  = availeMap[s.pdId].ohQty - availeMap[s.pdId].allocatedQty;
                        } else {
                            availeMap[s.pdId] = {
                                pdId: pd.pdId,
                                pdNo: pd.pdNo,
                                pdName: pd.pdName,
                                whShelfId: whShelfId,
                                whShelfNo: whShelf.whShelfNo,
                                whShelfName: whShelf.whShelfName,
                                ohQty: s.ohQty,
                                allocatedQty: s.allocatedQty,
                                availQty: s.ohQty - s.allocatedQty
                            }
                        }
                    })
                    const pdIds = Object.keys(availeMap);
                    pdIds.forEach( pdId => {
                        storages.push(availeMap[pdId]);
                    })
                    resolve(storages)
                }
            } catch(e) {
                reject(e)
            }
        })
    }

    pdAvailableByStorage(params: { bid: string; brid: string; whStorageId: string; pdId?: string; loadedStorages?: PdStorage[]; }) {
        return new Promise<PdAvailableByStorageReturnType | PdAvailableByStorageReturnType[]>( async (resolve, reject) => {
            try {
                const { bid, brid, pdId, whStorageId, loadedStorages } = params;
                let pdStorage: PdStorage;
                let pdStorages: PdStorage[];
                if (pdId) {
                    const pd = await this.pdService.getById(bid, { id: pdId })
                    if (!loadedStorages) {
                        pdStorage = await this.getOne({ bid, brid, filter: { _and: [ {pdId: pdId}, {whStorageId: whStorageId} ] } });
                    } else {
                        pdStorages = loadedStorages.filter( s => s.pdId === pdId && s.whStorageId === whStorageId );
                        pdStorage = pdStorages.length > 0 ? pdStorages[0] : null;
                    }
                    const avail: PdAvailableByStorageReturnType = {
                        pdId: pdId,
                        pdNo: pd.pdNo,
                        pdName: pd.pdName,
                        whStorageId: pdStorage.whStorageId,
                        whStorageNo: pdStorage.refStorageNo,
                        whStorageName: pdStorage.refStorageName,
                        ohQty: pdStorage.ohQty,
                        allocatedQty: pdStorage.allocatedQty,
                        availQty: pdStorage.ohQty - pdStorage.allocatedQty
                    }
                    resolve(avail);
                } else {
                    const pds = await this.pdService.get({ bid, brid });
                    const pdMap = keyBy(pds, 'pdId')
                    if (!loadedStorages) {
                        pdStorages = await this.get({ bid, brid, filter: { whStorageId: whStorageId} });
                    } else {
                        pdStorages = loadedStorages.filter( s => s.whStorageId === whStorageId );
                    }
                    const storages: PdAvailableByStorageReturnType[] = [];
                    const availeMap = {};
                    pdStorages.forEach( s => {
                        const pd = pdMap[s.pdId]
                        if (availeMap[s.pdId]) {
                            availeMap[s.pdId].ohQty += s.ohQty;
                            availeMap[s.pdId].allocatedQty  += s.allocatedQty;
                            availeMap[s.pdId].availQty  = availeMap[s.pdId].ohQty - availeMap[s.pdId].allocatedQty;
                        } else {
                            availeMap[s.pdId] = {
                                pdId: pd.pdId,
                                pdNo: pd.pdNo,
                                pdName: pd.pdName,
                                whStorageId: s.whStorageId,
                                whStorageNo: s.refStorageNo,
                                whStorageName: s.refStorageName,
                                ohQty: s.ohQty,
                                allocatedQty: s.allocatedQty,
                                availQty: s.ohQty - s.allocatedQty
                            }
                        }
                    })
                    const pdIds = Object.keys(availeMap);
                    pdIds.forEach( pdId => {
                        storages.push(availeMap[pdId]);
                    })
                    resolve(storages)
                }
            } catch(e) {
                reject(e)
            }
        })
    }

    transferToSu(params: TransferToSuParamsType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, srcWhStorageId, dstWhSuId, pdId, transferQty, sharedClient } = params;

                const dstWhSu = await this.whSuService.getById(bid, { id: dstWhSuId }, sharedClient);

                if (!dstWhSu) {
                    throw new Error('Storage unit not found');
                }

                const pd = await this.pdService.getById(bid, { id: pdId });

                if (!pd) {
                    throw new Error('Product not found');
                }

                // Reduce qty of the product from source storage
                const srcPdStorage = await this.getOne({ bid, brid, filter: { _and: [ {pdId: pdId}, {whStorageId: srcWhStorageId } ] }, sharedClient });

                if (!srcPdStorage) {
                    throw new Error('Product not found in source storage')
                }

                const srcAvailQty = srcPdStorage.ohQty - srcPdStorage.allocatedQty;

                if (srcAvailQty < transferQty) {
                    throw new Error(`Product has ${srcPdStorage.ohQty} with allocation ${srcPdStorage.allocatedQty}. so available for transfer ${srcAvailQty}`)
                }

                const storageRes = await this.decreaseQty({ bid, brid, pdStorageId: srcPdStorage.pdStorageId, qty: transferQty, preloaded: { pdStorageMap: { [srcPdStorage.pdStorageId]: srcPdStorage }, sharedClient}  });

                // Increase qty of the product in destination storage unit

                const pdSu = await this.pdSuService.getOrCreate({ bid, brid,whSuId: dstWhSuId, pdId, sharedClient });

                const suRes = this.pdSuService.increaseQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: transferQty, preloaded: { pdSuMap: { [pdSu.pdSuId]: pdSu } }, sharedClient });

                resolve({ dstSu: suRes, srcStorage: storageRes })

            } catch(e) {

                reject(e)

            }
        });
    }

}
