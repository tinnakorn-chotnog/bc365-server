import { PdSuService } from "./pd-su.service";
import { BeforeTriggerType } from "@bc365-server/common/services/db.interface";
import { PdStorage } from "../../interfaces/pd-storage.model";
import { PdSu } from "../../interfaces/pd-su.model";
import { PdWh } from "../../interfaces/pd-wh.model";
import { PdLotStorageExtService } from "../pd-lot-storage";
import { PdStorageExtService } from "../pd-storage";
import { PdWhExtService } from "../pd-wh";
import { PdExtService } from "../pd/pd-ext.service";
import { WhStorageService, WhStorageExtService } from "../wh-storage";
import { WhSuExtService } from "../wh-su";
import { Pd } from "../../interfaces/pd.model";
import { WhSu } from "../../interfaces/wh-su.model";
import { PdSuSyncQtyParamsType, PdSuAllocateParamsType, PdSuDeallocateParamsType, PdSuIncreaseParamsType, PdSuDecreaseParamsType, PdSuAdjustParamsType, PdSuTransferParamsType, PdSuTransferToStorageParamsType, PdSuTransferToWhParamsType, PdSuDumpToStorageParamsType, PdSuDumpToSuParamsType, PdSuEmptySuParamsType, PdSuMiniReturnType } from "./pd-su.interface";
import { PdLotExtService } from "../pd-lot";
import { PdLot } from "../../interfaces/pd-lot.model";
import { keyBy } from "lodash";

export class PdSuExtService extends PdSuService {

    get pdService() {
        return this.modRef.get<PdExtService>(PdExtService)
    }

    get pdWhService() {
        return this.modRef.get<PdWhExtService>(PdWhExtService)
    }

    get pdLotService() {
        return this.modRef.get<PdLotExtService>(PdLotExtService)
    }

    get pdLotStorageService() {
        return this.modRef.get<PdLotStorageExtService>(PdLotStorageExtService)
    }

    get pdStorageService() {
        return this.modRef.get<PdStorageExtService>(PdStorageExtService)
    }

    get whStorageService() {
        return this.modRef.get<WhStorageService>(WhStorageExtService)
    }

    get whSuService() {
        return this.modRef.get<WhSuExtService>(WhSuExtService)
    }

    getOrCreate(params: { bid: string; brid: string; pdId: string; whSuId: string; sharedClient?: any }) {
        return new Promise<PdSu>( async (resolve, reject) => {
            try {
                const { bid, brid, pdId, whSuId, sharedClient } = params;

                let pdSu: PdSu = await this.getOne({ bid, brid, filter: { _and: [ {pdId: pdId}, {whSuId: whSuId}] }, sharedClient });

                if (pdSu) {

                    resolve(pdSu)

                } else {

                    const pd = await this.pdService.getById(bid, { id: pdId }, sharedClient);

                    if (!pd) {
                        throw new Error('Product not found')
                    }

                    const whSu = await this.whSuService.getById(bid, { id: whSuId}, sharedClient);

                    if (!whSu) {
                        throw new Error('Storage unit not found')
                    }

                    pdSu = {
                        pdSuId: this.service.generateId(),
                        pdId: pdId,
                        whSuId: whSuId,
                        ohQty: 0,
                        allocatedQty: 0
                    }

                    pdSu = await this.add({ bid, brid, data: pdSu, sharedClient})

                    resolve(pdSu)

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

                const morphData = data as PdSu;

                if (!data.whSuId) {
                    throw new Error('Not provide storage unit')
                }

                if (!data.pdId) {
                    throw new Error('Not provide product')
                }

                const whSu = await this.whSuService.getById(bid, { id: data.whSuId }, sharedClient);

                if (!whSu) {
                    throw new Error('Storage unit not found')
                }

                if (whSu.parentSuId) {

                    const parentWhSu = await this.whSuService.getById(bid, { id: whSu.parentSuId }, sharedClient)

                    if (!parentWhSu) {
                        throw new Error('Parent storage unit not found' + whSu.parentSuId)
                    }

                    const parentSu = await this.pdSuService.getOrCreate({ bid, brid, pdId: data.pdId, whSuId: parentWhSu.whSuId, sharedClient})

                    morphData.parentId = parentSu.pdSuId;

                }

                const pd = await this.pdService.getById(bid, { id: data.pdId }, sharedClient)

                if (!pd) {
                    throw new Error('Product not found')
                }

                if (pd.useLot && !data.pdLotId) {
                    throw new Error('Not provide product lot')
                }

                let pdLot: PdLot;

                if (pd.useLot) {
                    pdLot = await this.pdLotService.getById(bid, { id: data.pdLotId }, sharedClient)
                    if (!pdLot) {
                        throw new Error('Product lot not found')
                    }
                    morphData.pdLotId = pdLot.pdLotId
                }

                if (whSu.whStorageId) {

                        let pdStorage: PdStorage;

                        if (whSu.whStorageId) {

                            pdStorage = await this.pdStorageService.getOne({ bid, brid, filter: { _and: [ {pdId: data.pdId}, {whStorageId: whSu.whStorageId} ] }, sharedClient })

                            if (!pdStorage) {
                                throw new Error('Storage not found')
                            }

                            morphData.whId = pdStorage?.whId;
                            morphData.pdWhId = pdStorage?.pdWhId;
                            morphData.pdStorageId = pdStorage?.pdStorageId;
                            morphData.whStorageId = pdStorage?.whStorageId;

                        } else {

                            let pdWh: PdWh;

                            if (whSu.whId) {

                                pdWh = await this.pdWhService.getOne({ bid, brid, filter: { _and: [ {pdId: data.pdId}, {whId: whSu.whId} ] }, sharedClient })

                                if (!pdWh) {
                                    throw new Error
                                }

                                morphData.whId = pdWh?.whId;
                                morphData.pdWhId = pdWh?.pdWhId;
                                morphData.pdStorageId = undefined;
                                morphData.whStorageId = undefined;

                            }
                        }


                } else {

                    let pdWh: PdWh;
                    if (whSu.whId) {
                        pdWh = await this.pdWhService.getOne({ bid, brid, filter: { _and: [ {pdId: data.pdId}, {whId: whSu.whId} ] }, sharedClient })
                        morphData.whId = pdWh?.whId;
                        morphData.pdWhId = pdWh?.pdWhId;
                        morphData.pdStorageId = undefined;
                        morphData.whStorageId = undefined;
                    }

                }

                morphData.whStorageId = whSu.whStorageId

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

                const morphData = data as PdSu;

                resolve(morphData)

            } catch(e) {

                reject(e)

            }
        })
    }

    syncQty(params: PdSuSyncQtyParamsType) {
        return new Promise<{ persist: boolean; pdSu: any; }>( async (resolve, reject) => {

            const { bid, brid, pdSu, persistOutside, preloaded, sharedClient } = params;

            try {

                let pd: Pd;
                let whSu: WhSu;

                if (preloaded && preloaded.pdMap) {
                    pd = preloaded.pdMap[pdSu.pdId]
                } else {
                    pd = await this.pdService.getById(bid, { id: pdSu.pdId }, sharedClient)
                }

                if (preloaded && preloaded.whSuMap) {
                    whSu = preloaded.whSuMap[pdSu.whSuId]
                } else {
                    whSu = await this.whSuService.getById(bid, { id: pdSu.pdId }, sharedClient)
                }

                const data = { pdSuId: pdSu.pdSuId, ohQty: pdSu.ohQty,  allocatedQty: pdSu.allocatedQty };

                resolve({ persist: false, pdSu: data })

            } catch(e) {

                console.log(e)

                reject(e)
            }
        })
    }

    allocateQty(params: PdSuAllocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdSuId, qty, preloaded, bubble, sharedClient } = params;

                let pdSu: PdSu;

                if (preloaded && preloaded.pdSuMap[pdSuId]) {
                    pdSu = preloaded.pdSuMap[pdSuId];
                } else {
                    pdSu = await this.getById( bid, { id: pdSuId }, sharedClient )
                }

                if (!pdSu.ohQty || pdSu.ohQty <= 0) {
                    throw new Error('No quantity for allocation.')
                }

                pdSu.allocatedQty = pdSu.allocatedQty || 0;

                const newQty = pdSu.allocatedQty  + qty;

                if (newQty > (pdSu.ohQty - pdSu.allocatedQty)) {
                    throw new Error(`Quantity can allocate ${(pdSu.ohQty - pdSu.allocatedQty)} of ${qty}. current on-hand: ${pdSu.ohQty}, current allocated: ${pdSu.allocatedQty}`)
                }

                await this.update({ bid, brid, data: { pdSuId: pdSu.pdSuId, whSuId: pdSu.whSuId, whStorageId: pdSu.whStorageId, allocatedQty: newQty }, sharedClient })

                if (pdSu.parentId) {
                    await this.allocateQty({ bid, brid, pdSuId: pdSu.parentId, qty: qty, bubble, sharedClient})
                } else
                if (pdSu.whStorageId) {
                    await this.pdStorageService.allocateQty({ bid, brid, pdStorageId: pdSu.pdStorageId, qty, preloaded, bubble, sharedClient })
                } else {
                    await this.pdWhService.allocateQty({ bid, brid, pdWhId: pdSu.pdWhId, qty, preloaded, bubble, sharedClient })
                }

                const miniRec = {pdSuId: pdSu.pdSuId, lastAllocatedQty: pdSu.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    deallocateQty(params: PdSuDeallocateParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdSuId, qty, preloaded, bubble, sharedClient } = params;

                let pdSu: PdSu;

                if (preloaded && preloaded.pdSuMap[pdSuId]) {
                    pdSu = preloaded.pdSuMap[pdSuId];
                } else {
                    pdSu = await this.getById( bid, { id: pdSuId }, sharedClient )
                }


                const newQty = pdSu.allocatedQty - qty;


                await this.update({ bid, brid, data: { pdSuId: pdSu.pdSuId, whSuId: pdSu.whSuId, allocatedQty: newQty }, sharedClient })

                if (pdSu.parentId) {
                    await this.deallocateQty({ bid, brid, pdSuId: pdSu.parentId, qty, bubble, sharedClient})
                } else
                if (pdSu.pdStorageId) {
                    await this.pdStorageService.deallocateQty({ bid, brid, pdStorageId: pdSu.pdStorageId, qty, preloaded, bubble, sharedClient })
                } else {
                    await this.pdWhService.deallocateQty({ bid, brid, pdWhId: pdSu.pdWhId, qty, preloaded, sharedClient })
                }

                const miniRec = {pdSuId: pdSu.pdSuId, lastAllocatedQty: pdSu.allocatedQty, allocatedQty: newQty}

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    increaseQty(params: PdSuIncreaseParamsType) {
        return new Promise<PdSuMiniReturnType>( async (resolve, reject) => {
            try {

                let { bid, brid, pdSuId, qty, preloaded, bubble, sharedClient } = params;

                let pdSu: PdSu;

                if (preloaded && preloaded.pdSuMap[pdSuId]) {
                    pdSu = preloaded.pdSuMap[pdSuId];
                } else {
                    pdSu = await this.getById( bid, { id: pdSuId }, sharedClient )
                }

                pdSu.ohQty = pdSu.ohQty || 0;

                const newQty = pdSu.ohQty + qty;

                await this.update({ bid, brid, data: { pdSuId: pdSu.pdSuId, ohQty: newQty }, sharedClient })

                if (pdSu.parentId) {
                    await this.increaseQty({ bid, brid, pdSuId: pdSu.parentId, qty: qty, bubble, sharedClient})
                } else
                if (pdSu.pdStorageId) {
                    await this.pdStorageService.increaseQty({ bid, brid, pdStorageId: pdSu.pdStorageId, qty, preloaded, bubble, sharedClient })
                } else {
                    await this.pdWhService.increaseQty({ bid, brid, pdWhId: pdSu.pdWhId, qty, preloaded, sharedClient })
                }

                const miniRec = {
                    pdSuId: pdSu.pdSuId,
                    lastQty: pdSu.ohQty,
                    newQty: newQty,
                    refPdNo: pdSu.refPdNo,
                    refPdName: pdSu.refPdName,
                    refStorageNo: pdSu.refStorageNo,
                    refLotNo: pdSu.refLotNo,
                    refSuNo: pdSu.refSuNo
                }

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    decreaseQty(params: PdSuDecreaseParamsType) {
        return new Promise<PdSuMiniReturnType>( async (resolve, reject) => {
            try {

                let { bid, brid, pdSuId, qty, preloaded, bubble, sharedClient } = params;

                let pdSu: PdSu;

                if (preloaded && preloaded.pdSuMap[pdSuId]) {
                    pdSu = preloaded.pdSuMap[pdSuId];
                } else {
                    pdSu = await this.getById( bid, { id: pdSuId }, sharedClient )
                }

                pdSu.ohQty = pdSu.ohQty || 0;

                if (pdSu.ohQty <= 0) {
                    throw new Error('Negative stock has not allowed.')
                }

                const newQty = pdSu.ohQty - qty;

                await this.update({ bid, brid, data: { pdSuId: pdSu.pdSuId, ohQty: newQty }, sharedClient })

                if (pdSu.parentId) {
                    await this.decreaseQty({ bid, brid, pdSuId: pdSu.parentId, qty: qty, bubble, sharedClient})
                } else
                if (pdSu.pdStorageId) {
                    await this.pdStorageService.decreaseQty({ bid, brid, pdStorageId: pdSu.pdStorageId, qty, preloaded, bubble, sharedClient })
                } else {
                    await this.pdWhService.decreaseQty({ bid, brid, pdWhId: pdSu.pdWhId, qty, preloaded, sharedClient })
                }


                const miniRec = {
                    pdSuId: pdSu.pdSuId,
                    lastQty: pdSu.ohQty,
                    newQty: newQty,
                    refPdNo: pdSu.refPdNo,
                    refPdName: pdSu.refPdName,
                    refStorageNo: pdSu.refStorageNo,
                    refLotNo: pdSu.refLotNo,
                    refSuNo: pdSu.refSuNo
                }

                resolve(miniRec)

            } catch(e) {

                reject(e)

            }
        })
    }

    adjustQty(params: PdSuAdjustParamsType) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdSuId, qty, preloaded, bubble, sharedClient } = params;

                let pdSu: PdSu;

                if (preloaded && preloaded.pdSuMap[pdSuId]) {
                    pdSu = preloaded.pdSuMap[pdSuId];
                } else {
                    pdSu = await this.getById( bid, { id: pdSuId }, sharedClient )
                }

                let diffQty = 0;

                if (pdSu.ohQty >= qty) {

                    if (pdSu.ohQty - pdSu.allocatedQty < qty) {
                        throw new Error('available qty is less than quantity to adjust')
                    }

                    diffQty = pdSu.ohQty - qty;

                    const miniRec = await this.decreaseQty({ bid, brid, pdSuId: pdSuId, qty: diffQty, preloaded, bubble, sharedClient });

                    resolve(miniRec)

                } else {

                    diffQty = qty - pdSu.ohQty;

                    const miniRec = await this.increaseQty({ bid, brid, pdSuId: pdSuId, qty: diffQty, preloaded, bubble, sharedClient });

                    resolve(miniRec)

                }

            } catch(e) {

                reject(e)

            }
        })
    }

    transferQty(params: PdSuTransferParamsType ) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, srcPdSuId, srcPdSu, srcPdSuArray, dstWhSuId, dstPdSuId, qty, preloaded, bubble, sharedClient } = params;

                if (!srcPdSu && !srcPdSuArray) {

                    if (!srcPdSuId) {
                        throw new Error('Not provide product storage unit #ID')
                    }

                    const tmpPdSu = await this.getById(bid, { id: srcPdSuId }, sharedClient);

                    if (!tmpPdSu) {
                        throw new Error('Product storage unit not found')
                    }

                    tmpPdSu.ohQty = qty;

                    srcPdSuArray = [ tmpPdSu ]

                } else

                if (srcPdSu && !srcPdSuArray) {

                    srcPdSuArray = [ srcPdSu ]

                }

                const res = await Promise.all(srcPdSuArray.map( async pdSu => {

                    const srcData = await this.decreaseQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: pdSu.ohQty, preloaded, bubble, sharedClient });

                    let miniRec: any;
                    if (dstWhSuId) {
                        const dstPdSu = await this.getOrCreate({ bid, brid, pdId: pdSu.pdId, whSuId: dstWhSuId, sharedClient})
                        const dstData = await this.increaseQty({ bid, brid, pdSuId: dstPdSu.pdSuId, qty: pdSu.ohQty, preloaded, bubble, sharedClient });
                        miniRec = {src: srcData, dst: dstData }
                    } else {
                        const dstData = await this.increaseQty({ bid, brid, pdSuId: dstPdSuId, qty: pdSu.ohQty, preloaded, bubble, sharedClient });
                        miniRec = {src: srcData, dst: dstData }
                    }

                    return miniRec

                }))

                resolve(res.length === 1 ? res[0] : res)

            } catch(e) {

                reject(e)

            }
        })
    }

    // This method is so wild, it can transfer product from as following scenario
    // -. transfer a product from su to a storage in the same warehouse
    // -. transfer a product from su to a storage in the different warehouse
    transferToStorage(params: PdSuTransferToStorageParamsType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, srcPdSu, srcPdSuArray, srcWhSuId, dstWhStorageId, pdId, pdLotId, transferQty, sharedClient } = params;

                // Check destination warehouse storage
                if (!dstWhStorageId) {
                    throw new Error('Not provide destination warehouse storage #ID')
                }

                // Check destination warehouse storage exists
                const dstWhStorage = await this.whStorageService.getById(bid, { id: dstWhStorageId}, sharedClient)

                if (!dstWhStorage) {
                    throw new Error('Warehouse storage not found')
                }

                if (!srcPdSu && !srcPdSuArray && srcWhSuId) {

                    // Check provide pdId
                    if (!pdId) {
                        throw new Error('Not provide product #ID')
                    }

                    let tmpPdSu: any;

                    if (pdLotId) {
                        tmpPdSu = await this.getOne({ bid, brid, filter: { _and:[ {pdId: pdId}, {pdLotId: pdLotId}, {whSuId: srcWhSuId} ] }, sharedClient });
                        if (!tmpPdSu) {
                            throw new Error('Source storage with lot #ID unit not found')
                        }
                    } else {
                        tmpPdSu = await this.getOne({ bid, brid, filter: { _and:[ {pdId: pdId}, {whSuId: srcWhSuId} ] }, sharedClient });
                        if (!tmpPdSu) {
                            throw new Error('Source storage unit not found')
                        }
                    }

                    const srcAvailQty = tmpPdSu.ohQty - tmpPdSu.allocatedQty;

                    if (srcAvailQty < transferQty) {
                        throw new Error('Not enough quantity to transfer')
                    }

                    // we will use oh-hand qty as transfer qty for the next loop
                    tmpPdSu.ohQty = transferQty

                    srcPdSuArray = [ tmpPdSu ]

                } else

                if (!srcPdSuArray && srcPdSu) {

                    srcPdSuArray = [ srcPdSu ]

                }

                const pdIds = srcPdSuArray.map( su => su.pdId )

                // Check product exists
                const pds = await this.pdService.get({ bid, brid, filter: { _in: {pdId: pdIds} }, sharedClient });

                if (pds.length === 0) {
                    throw new Error('Product not found');
                }

                const pdMap = keyBy(pds, 'pdId');

                const mainRes = await Promise.all(srcPdSuArray.map( async pdSu => {

                    const pd = pdMap[pdSu.pdId]

                    if (pd.useLot) {

                        // Check destination lot exists
                        const srcPdLot = await this.pdLotService.getById(bid, { id: pdSu.pdLotId }, sharedClient)

                        if (!srcPdLot) {
                            throw new Error('Product lot not found')
                        }

                        // Reduce quantity from source storage unit
                        const srcRes = await this.pdSuService.decreaseQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: pdSu.ohQty, sharedClient})

                        // Get or create destination product storage and product lot storage if does not exist
                        const dstPdStorage = await this.pdStorageService.getOrCreate({ bid, brid, pdId: pdSu.pdId, whStorageId: dstWhStorageId, sharedClient})
                        const dstPdLotStorage = await this.pdLotStorageService.getOrCreate({ bid, brid, pdLotId: pdSu.pdLotId, pdStorageId: dstPdStorage.pdStorageId, sharedClient})

                        // Increase quantity of destination storage
                        const dstRes = await this.pdLotStorageService.increaseQty({ bid, brid, pdLotStorageId: dstPdLotStorage.pdLotStorageId, qty: pdSu.ohQty, sharedClient})

                        return { src: srcRes, dst: dstRes }

                    } else
                    // Not using lot
                    {

                        const srcRes = await this.pdSuService.decreaseQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: pdSu.ohQty, sharedClient})

                        const dstPdStorage = await this.pdStorageService.getOrCreate({ bid, brid, pdId: pdId, whStorageId: dstWhStorageId, sharedClient})

                        const dstRes = await this.pdStorageService.increaseQty({ bid, brid, pdStorageId: dstPdStorage.pdStorageId, qty: pdSu.ohQty, sharedClient})

                        return { src: srcRes, dst: dstRes }
                    }

                }))

                resolve(mainRes)

            } catch(e) {

                reject(e)

            }
        });
    }

    dumpToStorage(params: PdSuDumpToStorageParamsType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, srcWhSuId,  dstWhStorageId, sharedClient } = params;

                const srcPdSuArray = await this.get({ bid, brid, filter: { _and: [ {whSuId: srcWhSuId }, {_gt:{ohQty: 0} } ] } });

                if (srcPdSuArray && srcPdSuArray.length === 0) {
                    throw new Error('Source storage unit not found')
                }

                const res = await this.transferToStorage({ bid, brid, srcPdSuArray, dstWhStorageId, sharedClient});

                resolve(res)

            } catch(e) {
                reject(e)
            }
        })
    }

    dumpToSu(params: PdSuDumpToSuParamsType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, srcWhSuId, dstWhSuId, sharedClient } = params;

                if (!srcWhSuId) {
                    throw new Error('Not provide source storage unit')
                }

                if (!dstWhSuId) {
                    throw new Error('Not provide destination storage unit')
                }

                const srcPdSuArray = await this.get({ bid, brid, filter: { _and: [ {whSuId: srcWhSuId }, {_gt:{ohQty: 0} } ] }, sharedClient });

                if (srcPdSuArray && srcPdSuArray.length === 0) {
                    throw new Error('Source storage unit not found')
                }

                const res = await this.transferQty({ bid, brid, srcPdSuArray, dstWhSuId, sharedClient })

                resolve(res)

            } catch(e) {
                reject(e)
            }
        })
    }

    emptyToSu(params: PdSuEmptySuParamsType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, whSuId, sharedClient } = params;

                if (!whSuId) {
                    throw new Error('Not provide source storage unit')
                }

                const srcPdSuArray = await this.get({ bid, brid, filter: { _and: [ {whSuId: whSuId }, {_gt:{ohQty: 0} } ] }, sharedClient });

                if (srcPdSuArray.length > 0) {
                    const data = srcPdSuArray.map( pdSu => {
                        console.log(pdSu)
                        const o = { pdSuId: pdSu.pdSuId, ohQty: 0, allocateQty: 0, allocation: [] }
                        return o;
                    })

                    const res = await this.updateList({ bid, brid, data, batch: true, sharedClient })

                    resolve(res)

                } else {

                    resolve(null)

                }

            } catch(e) {
                reject(e)
            }
        })
    }

    transferToWh(params: PdSuTransferToWhParamsType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, srcPdSu, srcPdSuArray, srcWhSuId,  dstWhId, pdId, sharedClient } = params;

                if (!srcPdSu && !srcPdSuArray && srcWhSuId) {

                    const dstWhSu = await this.whSuService.getById(bid, { id: srcWhSuId }, sharedClient);

                    if (!dstWhSu) {
                        throw new Error('Storage unit not found');
                    }

                    const pd = await this.pdService.getById(bid, { id: pdId });

                    if (!pd) {
                        throw new Error('Product not found');
                    }

                    // Increase qty of the product in destination storage unit

                    srcPdSu = await this.pdSuService.getOrCreate({ bid, brid, whSuId: srcWhSuId, pdId, sharedClient });

                    if (!srcPdSu) {
                        throw new Error('Product not found in source storage unit')
                    }

                } else
                if (!srcPdSu && !srcPdSuArray && !srcWhSuId) {
                    throw new Error('Not provide neither storage unit nor product storage unit')
                }

                if (srcPdSu && !srcPdSuArray) {
                    srcPdSuArray = [ srcPdSu ]
                }

                const res = await Promise.all(srcPdSuArray.map( pdSu => {

                    if (srcPdSu.whId === dstWhId) {
                        throw new Error('Storage unit already partk at the warehouse')
                    }

                    if (srcPdSu.allocatedQty && srcPdSu.allocatedQty > 0) {
                        throw new Error(`Product has allocation ${pdSu.allocatedQty}`)
                    }

                    const srcWhId = pdSu.whId;

                    let srcRes: any;
                    let dstRes: any;

                    // Check if su is under storage, or directly under warehouse without refer to storage
                    if (pdSu.pdStorageId) {
                        // Reduce quantity from old storage
                        srcRes = this.pdStorageService.decreaseQty({ bid, brid, pdStorageId: pdSu.pdStorageId, qty: pdSu.ohQty, sharedClient });
                    } else {
                        // Reduce quantity from old warehouse
                        srcRes = this.pdWhService.decreaseQty({ bid, brid, pdWhId: srcWhId, qty: pdSu.ohQty, sharedClient });
                    }

                    // Increase quantity to new warehouse
                    dstRes = this.pdWhService.decreaseQty({ bid, brid, pdWhId: dstWhId, qty: pdSu.ohQty, sharedClient });

                    return { src: srcRes, dst: dstRes }
                }))

                resolve(res);

            } catch(e) {

                reject(e)

            }
        });
    }


}
