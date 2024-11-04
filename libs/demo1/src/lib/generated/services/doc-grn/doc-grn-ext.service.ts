import { DocGrnService } from "./doc-grn.service";
import { DocGrn } from "../../interfaces/doc-grn.model";
import { isArray, keyBy } from "lodash";
import { BranchInventoryPreferenceInfo } from "../../interfaces/branch-inventory-preference-info.model";
import { InvTrn } from "../../interfaces/inv-trn.model";
import { PdExtService } from "../pd";
import { PdBranchExtService } from "../pd-branch";
import { PdLotStorageExtService } from "../pd-lot-storage";
import { PdStorageExtService } from "../pd-storage";
import { PdSuExtService } from "../pd-su";
import { PdUomExtService } from "../pd-uom";
import { BeforeTriggerType } from "@bc365-server/common/services/db.interface";
import { PdReceiveInfo } from "../../interfaces/pd-receive-info.model";
import { PdStorage } from "../../interfaces/pd-storage.model";
import { PdLotStorage } from "../../interfaces/pd-lot-storage.model";
import { WhSuExtService } from "../wh-su";
import { PdSu } from "../../interfaces/pd-su.model";
import { WhSu } from "../../interfaces/wh-su.model";
import { SuppExtService } from "../supp";

export class DocGrnExtService extends DocGrnService {

    get pdService() {
        return this.modRef.get<PdExtService>(PdExtService)
    }

    get pdUomService() {
        return this.modRef.get<PdUomExtService>(PdUomExtService)
    }

    get pdStorageService() {
        return this.modRef.get<PdStorageExtService>(PdStorageExtService)
    }

    get pdSuService() {
        return this.modRef.get<PdSuExtService>(PdSuExtService)
    }

    get pdBranchService() {
        return this.modRef.get<PdBranchExtService>(PdBranchExtService)
    }

    get pdLotStorageService() {
        return this.modRef.get<PdLotStorageExtService>(PdLotStorageExtService)
    }

    get whSuService() {
        return this.modRef.get<WhSuExtService>(WhSuExtService)
    }

    get suppService() {
        return this.modRef.get<SuppExtService>(SuppExtService)
    }

    processBeforeInsert(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid, data, sharedClient } = params;

                const triggerRes = { data, newPdStorage: [], newPdLotStorage: [], newWhSu: [], newPdSu: [] }

                if (typeof data.suppId !== 'undefined' && data.suppId !== null) {

                    const supp = await this.suppService.getById(bid, { id: data.suppId}, sharedClient);

                    if (supp) {

                        data.refName = supp.suppName;

                    } else {

                        throw new Error('Supplier does not exist.')

                    }

                }

                if (typeof data.items !== 'undefined' && isArray(data.items) && data.items.length > 0) {

                    await Promise.all(data.items.map( async item => {

                        const morphItem = item as PdReceiveInfo;

                        if (morphItem.pdUomId) {

                            const pdUom = await this.pdUomService.getById(bid, { id: morphItem.pdUomId }, sharedClient);

                            morphItem.cnvFactor = pdUom?.cnvFactor || 1;

                        }

                        let pdStorage: PdStorage;

                        if (morphItem.whStorageId) {

                            pdStorage = await this.pdStorageService.getOne({ bid, brid, filter: { _and: [ {pdId: morphItem.pdId}, {whStorageId: morphItem.whStorageId} ] }, sharedClient })

                            if (!pdStorage) {

                                const o: PdStorage = {
                                    pdStorageId: this.service.generateId(),
                                    whStorageId: morphItem.whStorageId,
                                    pdId: morphItem.pdId,
                                    whId: data.whId,
                                    branchId: brid,
                                    bizId: bid
                                }

                                pdStorage = await this.pdStorageService.add({ bid, brid, data: o, sharedClient })

                                triggerRes.newPdStorage.push(pdStorage)

                                morphItem.pdStorageId = pdStorage?.pdStorageId;

                            } else {

                                morphItem.pdStorageId = pdStorage?.pdStorageId;

                            }
                        } else {

                            throw new Error('No storage location provided.')

                        }

                        if (morphItem.useLot) {

                            if (morphItem.pdLotId) {

                                let pdLotStorage: PdLotStorage = await this.pdLotStorageService.getOne({ bid, brid, filter: { _and: [ {pdStorageId: morphItem.pdStorageId}, {pdLotId: morphItem.pdLotId} ] }, sharedClient })

                                if (!pdLotStorage) {

                                    const o: PdLotStorage = {
                                        pdLotStorageId: this.service.generateId(),
                                        pdId: morphItem.pdId,
                                        pdStorageId: morphItem.pdStorageId,
                                        pdLotId: morphItem.pdLotId,
                                        branchId: brid,
                                        bizId: bid
                                    }

                                    pdLotStorage = await this.pdLotStorageService.add({ bid, brid, data: o, sharedClient});

                                    triggerRes.newPdLotStorage.push(pdLotStorage)

                                    morphItem.pdLotStorageId = pdLotStorage?.pdLotStorageId;

                                } else {

                                    morphItem.pdLotStorageId = pdLotStorage?.pdLotStorageId;

                                }

                            } else {

                                throw new Error('No lot provided.')

                            }

                        }

                        if (morphItem.applySu) {

                            if (morphItem.suReceive) {

                                if (morphItem.suReceive.suList && morphItem.suReceive.suList.length > 0) {

                                    if (morphItem.suReceive.suList.length !== morphItem.suReceive.numOfSu) {
                                        throw new Error('List of su must contain su item equal to number of su')
                                    }

                                    const createSuIfNotExists = true;

                                    const suNos = morphItem.suReceive.suList.map( su => su.suNo);
                                    const whsus = await this.whSuService.get({ bid, brid, filter: { _in: { suNo: suNos } }, sharedClient })

                                    if (whsus) {

                                        if (!createSuIfNotExists && whsus.length !== morphItem.suReceive.suList.length) {

                                            throw new Error('There are at lease one su does not exist.')

                                        }

                                    } else {

                                        if (!createSuIfNotExists) {

                                            throw new Error('There are at lease one su does not exist.')

                                        }
                                        
                                    }

                                    const whSuMap = keyBy(whsus, 'suNo');

                                    await Promise.all(morphItem.suReceive.suList.map( async suReceve => {

                                        let whSu: WhSu = whSuMap[suReceve.suNo];

                                        if (!whSu) {

                                            if (!createSuIfNotExists) {

                                                throw new Error(`Su No. ${suReceve.suNo} does not exist.`)

                                            }

                                            const o: WhSu = {
                                                whSuId: this.service.generateId(),
                                                suNo: suReceve.suNo,
                                                suTypeId: morphItem.suReceive.suTypeId,
                                                whId: data.whId,
                                                whStorageId: pdStorage?.whStorageId,
                                                bizId: bid,
                                            }

                                            whSu = await this.whSuService.add({ bid, brid, data: o, sharedClient })

                                            triggerRes.newWhSu.push(whSu)

                                        } else {

                                            if (pdStorage && whSu.whStorageId !== pdStorage.whStorageId) {

                                                whSu = await this.whSuService.update({ bid, brid, data: { ...whSu, whStorageId: pdStorage?.whStorageId }, sharedClient })

                                                console.log(whSu)

                                            }

                                        }

                                        let pdSu = await this.pdSuService.getOne({ bid, brid, filter: { _and: [ {pdId: morphItem.pdId}, {whSuId: whSu.whSuId} ] }, sharedClient });

                                        if (!pdSu) {

                                            const o: PdSu = {
                                                pdSuId: this.service.generateId(),
                                                pdId: morphItem.pdId,
                                                whSuId: whSu.whSuId,
                                                ohQty: 0,
                                                allocatedQty: 0
                                            }

                                            pdSu = await this.pdSuService.add({ bid, brid, data: o, sharedClient })

                                            triggerRes.newPdSu.push(pdSu)

                                        }

                                        suReceve.pdSuId = pdSu.pdSuId;

                                    }))
                                    
                                } else {

                                    throw new Error('No su list provided')

                                }

                            } else {

                                throw new Error('No su data provided.')

                            }
                        }

                        return morphItem;

                    }));

                    resolve(triggerRes)

                } else {

                    resolve(triggerRes)

                }

            } catch(e) {

                reject(e)

            }

        })
    }

    override beforeInsert(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {

            try {

                const triggeredData = await this.processBeforeInsert(params);

                resolve(triggeredData.data)

            } catch(e) {

                reject(e)

            }

        })
    }

    override beforeUpdate(params: BeforeTriggerType): Promise<any> {
        return new Promise( async (resolve, reject) => {

            try {

                const triggeredData = await this.processBeforeInsert(params);

                resolve(triggeredData.data)

            } catch(e) {

                reject(e)

            }

        })
    }

    receive(params: { bid: string; brid: string; docGrnId?: string; docGrn?: DocGrn; inventoryPreference?: BranchInventoryPreferenceInfo; sharedClient?: any }) {
        return new Promise( async (resolve, reject) => {

            try {

                const { bid, brid, docGrnId, docGrn, inventoryPreference, sharedClient } = params;

                if (typeof docGrn === 'undefined' && (typeof docGrnId === 'undefined' || docGrnId === null)) {
                    throw new Error('Cannot process receive transaction without docGrn information.')
                }

                let grn: DocGrn;

                if (docGrn) {
                    grn = docGrn;
                } else {
                    grn = await this.getById(bid, { id : docGrnId })
                    if (typeof grn === 'undefined') {
                        throw new Error(`docGrnId #${docGrnId} not found`)
                    }
                }

                if (typeof grn.items !== 'undefined' && grn.items !== null && grn.items.length > 0) {

                    const pdIds = docGrn.items.map( item => item.pdId)

                    const pds = await this.pdService.get({ bid, brid, filter: { pdId: { _in: pdIds }}})

                    const pdMap = keyBy(pds, 'pdId')

                    if (typeof pds !== 'undefined' && pds.length > 0) {

                        const res = await Promise.all(docGrn.items.map( async item => {

                            const pd = pdMap[item.pdId];

                            if (typeof pd === 'undefined') {
                                throw new Error(`Receiving of inexistent product ID #${item.pdId} .`)
                            }

                            let trn: InvTrn;

                            if (typeof item.applySu !== 'undefined' && item.applySu !== null && item.applySu) {

                                const suRes = Promise.all(item.suReceive.suList.map( async suItem => {

                                    const o = await this.pdSuService.increaseQty({ bid, brid, pdSuId: suItem.pdSuId, qty: suItem.receivedQty, sharedClient })

                                    const suTrn: InvTrn = {
                                        invTrnId: this.service.generateId(),
                                        trnDate: new Date().getTime(),
                                        trnSrc: "GRN",
                                        trnType: "+",
                                        pdId: item.pdId,
                                        whStorageId: item.whStorageId,
                                        pdStorageId: item.pdStorageId,
                                        pdLotStorageId: item.pdLotStorageId,
                                        pdSuId: suItem.suNo,
                                        qty: suItem.receivedQty,
                                        pdUomId: item.pdUomId,
                                        cnvFactor: item.cnvFactor,
                                        trnQty: suItem.receivedQty * item.cnvFactor,
                                        prevQty: o.lastQty,
                                        ohQty: o.newQty,
                                        uomId: pd.uomId,
                                        refDocId: docGrn.docGrnId,
                                        redDocNo: docGrn.docNo,
                                        refItemId: item.itemId,
                                        refPdNo: o.refPdNo,
                                        refPdName: o.refPdName,
                                        refStorageNo: o.refStorageNo,
                                        refLotNo: o.refLotNo ,
                                        refSuNo: o.refSuNo,
                                    };

                                    return suTrn;

                                }));

                                return suRes;

                            } else {

                                if (pd.useLot) {

                                    const o = await this.pdLotStorageService.increaseQty({ bid, brid, pdLotStorageId: item.pdLotStorageId, qty: item.receivedQty * item.cnvFactor, sharedClient  })

                                    trn = {
                                        invTrnId: this.service.generateId(),
                                        trnDate: new Date().getTime(),
                                        trnSrc: "GRN",
                                        trnType: "+",
                                        pdId: item.pdId,
                                        whStorageId: item.whStorageId,
                                        pdStorageId: item.pdStorageId,
                                        pdLotStorageId: item.pdLotStorageId,
                                        qty: item.receivedQty,
                                        pdUomId: item.pdUomId,
                                        cnvFactor: item.cnvFactor,
                                        trnQty: item.receivedQty * item.cnvFactor,
                                        prevQty: o.lastQty,
                                        ohQty: o.newQty,
                                        uomId: pd.uomId,
                                        refDocId: docGrn.docGrnId,
                                        redDocNo: docGrn.docNo,
                                        refItemId: item.itemId,
                                        refPdNo: o.refPdNo,
                                        refPdName: o.refPdName,
                                        refStorageNo: o.refStorageNo,
                                        refLotNo: o.refLotNo ,
                                        refSuNo: null,
                                    };

                                } else {

                                    const o: any = await this.pdStorageService.increaseQty({ bid, brid, pdStorageId: item.pdStorageId, qty: item.receivedQty * item.cnvFactor, sharedClient  })

                                    trn = {
                                        invTrnId: this.service.generateId(),
                                        trnDate: new Date().getTime(),
                                        trnSrc: "GRN",
                                        trnType: "+",
                                        pdId: item.pdId,
                                        whStorageId: item.whStorageId,
                                        pdStorageId: item.pdStorageId,
                                        qty: item.receivedQty,
                                        pdUomId: item.pdUomId,
                                        cnvFactor: item.cnvFactor,
                                        trnQty: item.receivedQty * item.cnvFactor,
                                        prevQty: o.lastQty,
                                        ohQty: o.newQty,
                                        uomId: pd.uomId,
                                        refDocId: docGrn.docGrnId,
                                        redDocNo: docGrn.docNo,
                                        refItemId: item.itemId,
                                        refPdNo: o.refPdNo,
                                        refPdName: o.refPdName,
                                        refStorageNo: o.refStorageNo,
                                        refLotNo: null ,
                                        refSuNo: null,
                                    };

                                }

                            }

                            return trn;

                        }));

                        resolve(res)

                    } else {

                        throw new Error('Receiving products information not found.')

                    }

                } else {
                    throw new Error('No item to receive, require at lease one item.')
                }


            } catch(e) {
                reject(e)
            }
        })

    }
}
