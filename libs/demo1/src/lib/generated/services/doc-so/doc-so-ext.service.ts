import { DocSoService } from "./doc-so.service";
import { DocSo } from "../../interfaces/doc-so.model";
import { PdExtService } from "../pd";
import { PdWhExtService } from "../pd-wh";
import { PdLotStorageExtService } from "../pd-lot-storage";
import { PdStorageExtService } from "../pd-storage";
import { WhStorageRestrictionExtService } from "../wh-storage-restriction";
import { WhShelfExtService } from "../wh-shelf";
import { WhStorageExtService } from "../wh-storage";
import { WhRackExtService } from "../wh-rack";
import { WhZoneExtService } from "../wh-zone";
import { WhAisleExtService } from "../wh-aisle";
import { WhStorageTypeExtService } from "../wh-storage-type";
import { PdBranchExtService } from "../pd-branch";
import { keyBy } from "lodash";
import { BranchExtService } from "../branch";
import { CateCountInfo } from "../../interfaces/cate-count-info.model";
import { PdCateExtService } from "../pd-cate";
import { DocPickExtService } from "../doc-pick";
import { AccumSoPdReturnType } from "./doc-so.interface";
import { DocPffm } from "../../interfaces/doc-pffm.model";
import { PffmOrdInfo } from "../../interfaces/pffm-ord-info.model";
import { PffmPdInfo } from "../../interfaces/pffm-pd-info.model";
import { DocPffmExtService } from "../doc-pffm";
import { PffmPdOrdInfo } from "../../interfaces/pffm-pd-ord-info.model";

export class DocSoExtService extends DocSoService {

    get pdService() {
        return this.modRef.get<PdExtService>(PdExtService)
    }

    get pdCateService() {
        return this.modRef.get<PdCateExtService>(PdCateExtService)
    }

    get pdBranchService() {
        return this.modRef.get<PdBranchExtService>(PdBranchExtService)
    }

    get pdWhService() {
        return this.modRef.get<PdWhExtService>(PdWhExtService)
    }

    get pdStorageService() {
        return this.modRef.get<PdStorageExtService>(PdStorageExtService)
    }

    get pdLotStorageService() {
        return this.modRef.get<PdLotStorageExtService>(PdLotStorageExtService)
    }

    get storageRestrictionService() {
        return this.modRef.get<WhStorageRestrictionExtService>(WhStorageRestrictionExtService)
    }

    get whStorageService() {
        return this.modRef.get<WhStorageExtService>(WhStorageExtService)
    }

    get whShelfService() {
        return this.modRef.get<WhShelfExtService>(WhShelfExtService)
    }

    get whRackService() {
        return this.modRef.get<WhRackExtService>(WhRackExtService)
    }

    get whAisleService() {
        return this.modRef.get<WhAisleExtService>(WhAisleExtService)
    }

    get whZoneService() {
        return this.modRef.get<WhZoneExtService>(WhZoneExtService)
    }

    get storageTypeService() {
        return this.modRef.get<WhStorageTypeExtService>(WhStorageTypeExtService)
    }

    get branchService() {
        return this.modRef.get<BranchExtService>(BranchExtService)
    }

    get docPickService() {
        return this.modRef.get<DocPickExtService>(DocPickExtService)
    }

    get docPffmService() {
        return this.modRef.get<DocPffmExtService>(DocPffmExtService)
    }

    getOrderByDueDate(bid: string, brid: string, whId: string, fromDate: Date, toDate: Date) {
        return new Promise<DocSo[]>( async (resolve, reject) => {
            try {
                const orders = await this.get({ bid, brid, filter: { _and: [ {whId: whId}, { _gte: { dueDate: fromDate } }, { _lte: { dueDate: toDate } }, { status: 'R' } ] } });
                resolve(orders)
            } catch(e) {
                reject(e)
            }
        })
    }

    getOrderByPriority(bid: string, brid: string, whId: string, priority: string) {
        return new Promise<DocSo[]>( async (resolve, reject) => {
            try {
                const orders = await this.get({ bid, brid, filter: { _and: [ {whId: whId}, { priority: priority }, { status: 'R' } ] } });
                resolve(orders)
            } catch(e) {
                reject(e)
            }
        })
    }

    getOrderByDspId(bid: string, brid: string, whId: string, dspId: string) {
        return new Promise<DocSo[]>( async (resolve, reject) => {
            try {
                const orders = await this.get({ bid, brid, filter: { _and: [ {whId: whId}, { dspId: dspId }, { status: 'R' } ] } });
                resolve(orders)
            } catch(e) {
                reject(e)
            }
        })
    }

    getOrderReleased(bid: string, brid: string, whId: string) {
        return new Promise<DocSo[]>( async (resolve, reject) => {
            try {
                const orders = await this.get({ bid, brid, filter: { _and:[ {whId: whId}, { status: 'R'} ] } });
                resolve(orders)
            } catch(e) {
                reject(e)
            }
        })
    }

    getAccumSoPd(params: { bid: string; brid: string; docSoIdList?: string[]; docSoList?: DocSo[]; }) {
        return new Promise<AccumSoPdReturnType[]>( async (resolve, reject) => {
            try {

                const { bid, brid, docSoIdList, docSoList } = params;

                let orders: DocSo[];

                if (docSoList) {
                    orders = docSoList;
                } else
                if (docSoIdList) {
                    orders = await this.get({ bid, brid, filter: { _and:[ { status: 'R'}, { _in: { docSoId: docSoIdList } } ] } });
                } else {
                    orders = await this.get({ bid, brid, filter: { status: 'R' } });
                }

                const itemMap: { [pdId:string]: AccumSoPdReturnType } = {};

                orders.forEach( so => {
                    let itemIdx = 0;
                    so.items.forEach( item => {
                        if (itemMap[item.pdId]) {
                            itemMap[item.pdId].orderedQty += item.orderedQty;
                            const soItem = { docSoId: so.docSoId, itemIdx: itemIdx, itemId: item.itemId, orderedQty: item.orderedQty }
                            itemMap[item.pdId].docSoItems.push(soItem);
                        } else {
                            const soItem = { docSoId: so.docSoId, itemIdx: itemIdx, itemId: item.itemId, orderedQty: item.orderedQty }
                            itemMap[item.pdId] = { pdId: item.pdId, orderedQty: item.orderedQty, availableQty: 0, backlogQty: 0, docSoItems: [ soItem ] }
                        }
                        itemIdx++;
                    })
                })

                const keys = Object.keys(itemMap);
                const accumSoPds = keys.map( k => {
                    return itemMap[k]
                })

                resolve(accumSoPds)

            } catch(e) {
                reject(e)
            }
        })
    }

    checkAvailabity(params: { bid: string; brid: string; docSoIdList?: string[]; docSoList?: DocSo[]; accumPds?: AccumSoPdReturnType[]; }) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, docSoIdList, docSoList, accumPds } = params;

                let orders: DocSo[];

                if (docSoList) {
                    orders = docSoList;
                } else
                if (docSoIdList) {
                    orders = await this.get({ bid, brid, filter: { _and:[ { status: 'R'}, { _in: { docSoId: docSoIdList } } ] } });
                } else {
                    if (!accumPds) {
                        orders = await this.get({ bid, brid, filter: { status: 'R' } });
                    }
                }

                if (!accumPds) {
                    accumPds = await this.getAccumSoPd({ bid, brid, docSoList: orders });
                }

                const pdIds = accumPds.map( pd => pd.pdId );

                const pdBranchs = await this.pdBranchService.get({ bid, brid, filter: { _in: { pdId: pdIds }}});

                const pdBranchMap = keyBy(pdBranchs, 'pdId');

                accumPds.forEach( pd => {
                    const pdBranch = pdBranchMap[pd.pdId];
                    if (pd.orderedQty > pdBranch.ohQty) {
                        pd.exception = {
                            exceptionCode: 'BS',
                            exceptionMessage: 'Branch inventory shortage',
                            exceptionQty: pdBranch.ohQty - pd.orderedQty,
                            exceptionResolved: false
                        }
                    } else {
                        pd.exception = null;
                    }
                })

                resolve(accumPds.filter( pd => pd.exception !== null ));

            } catch(e) {
                reject(e)
            }
        })
    }

    processCateCount(params: { bid: string; brid: string; ids?: string[]; docs?: DocSo[]; }) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, ids, docs } = params;
                let docSos: DocSo[];

                if (docs) {
                    docSos = docs;
                } else
                if (ids) {
                    docSos = await this.get({ bid, brid, filter: { _in: { docSoId: ids } } });
                } else {
                    docSos = await this.get({ bid, brid })
                }

                const pdIds: string[] = [];

                docSos.forEach( so => {
                    const ids = so?.items.map( item => item.pdId );
                    pdIds.push(...ids)
                })

                const pdCates = await this.pdCateService.get({ bid, brid });
                const pdCateMap = keyBy(pdCates, 'pdCateId');
                const pds = await this.pdService.get({ bid, brid, filter: { _in: { pdId: pdIds } } })
                const pdMap = keyBy(pds, 'pdId');

                docSos.forEach( so => {
                    const cateCount: CateCountInfo[] = [];
                    const cateMap = {};
                    so?.items.forEach( item => {
                        const pd = pdMap[item.pdId];
                        if (pd.pdCateId) {
                            if (cateMap[pd.pdCateId]) {
                                cateMap[pd.pdCateId].numOfItem++;
                            } else {
                                const pdCate = pdCateMap[pd.pdCateId];
                                cateMap[pd.pdCateId] = { pdCateId: pd.pdCateId, cateName: pdCate.pdCateName, numOfItem: 1 };
                                cateCount.push(cateMap[pd.pdCateId])
                            }
                        }
                    });

                    const cateKeys = Object.keys(cateMap);
                    so.numOfCate = cateKeys.length;
                    so.numOfItem = so?.items.length;
                    so.cateCount = cateCount;

                })

                await this.updateList({ bid, brid, data: docSos, batch: true })
                await this.flush();

                resolve(docSos)
            } catch(e) {
                reject(e)
            }
        });
    }

    createDocPffm(params: { bid: string; brid: string; docPffmId?: string; docs?: DocSo[]; ids?: string[]; }) {
        return new Promise( async (resolve, reject) => {

            try {

                const { bid, brid, docPffmId, docs, ids } = params;

                let docSos: DocSo[];

                if (docs) {

                    docSos = docs;

                } else
                if (ids) {

                    docSos = await this.get({ bid, brid, filter: { _in: { docTfoId: ids } }})

                } else {

                    docSos = await this.get({ bid, brid, filter: { status: 'R' } })

                }
                const docId = docPffmId || this.service.generateId();
                const pds = await this.pdService.get({ bid, brid });
                const pdMap = keyBy(pds, 'pdId')

                /*
                pickingType:
                    0 - Discrete picking
                    1 - Cluster picking
                    2 - Batch picking
                    3 - Wave picking
                */

                const doc: DocPffm = {
                    docPffmId: docId,
                    docNo: 'PFFM' + new Date().getTime().toString(),
                    docDate: new Date().getTime(),
                    status: 'R'
                }

                const docPffm: DocPffm[] = [];
                const pffmOrds: PffmOrdInfo[] = [];
                const pffmPdMap: { [key: string]: PffmPdInfo; } = {};

                docPffm.push(doc)

                docSos.forEach( docSo => {
                    const pffmOrd: PffmOrdInfo = {
                        docType: 'SO',
                        docId: docSo.docSoId,
                        docNo: docSo.docNo,
                        docDate: docSo.docDate,
                        partnerName: docSo.partnerName,
                        numOfItem: docSo.numOfItem,
                    }

                    pffmOrds.push(pffmOrd)
                    const items = docSo.items;
                    let itemIdx = 0;
                    items.forEach( item => {
                        const pd = pdMap[item.pdId]
                        const pffmPdOrd: PffmPdOrdInfo = {
                            docId: docSo.docSoId,
                            docNo: docSo.docNo,
                            partnerName: docSo.partnerName,
                            orderedQty: item.orderedQty,
                            priority: docSo.priority,
                            paymentMethodId: docSo.paymentMethodId,
                            paymentStatus: docSo.paymentStatus,
                            numOfItem: docSo.numOfItem,
                            orderValue: docSo.totalAmt,
                            itemId: item.itemId,
                            itemIndex: itemIdx
                        }
                        itemIdx++;
                        if (pffmPdMap[item.pdId]) {
                            pffmPdMap[item.pdId].orderedQty += item.orderedQty;
                            pffmPdMap[item.pdId].srcCount += 1;
                            pffmPdMap[item.pdId].srcDoc.push(pffmPdOrd)
                        } else {
                            pffmPdMap[item.pdId] = { pdId: item.pdId, orderedQty: item.orderedQty, srcCount: 1, srcDoc: [ pffmPdOrd ] }
                        }
                    })
                })

                const pdKeys = Object.keys(pffmPdMap)

                const pffmPds = pdKeys.map( pdId => {
                    return pffmPdMap[pdId]
                })

                doc.order = pffmOrds;
                doc.pd = pffmPds;

                await this.docPffmService.addList({ bid, brid, data: docPffm, batch: true })

                resolve(docPffm)
            } catch(e) {
                reject(e)
            } finally {
                await this.docPffmService.flush();
            }

        })

    }

}
