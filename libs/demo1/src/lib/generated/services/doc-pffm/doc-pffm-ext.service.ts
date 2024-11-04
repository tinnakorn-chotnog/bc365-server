import { ModuleRef } from "@nestjs/core";
import { DocPffmService } from "./doc-pffm.service";
import { PdExtService } from "../pd";
import { PdWhExtService } from "../pd-wh";
import { DocPickExtService } from "../doc-pick";
import { PickOrdInfo } from "../../interfaces/pick-ord-info.model";
import { DocPick } from "../../interfaces/doc-pick.model";
import { PickOrdItemInfo } from "../../interfaces/pick-ord-item-info.model";
import { PickPdInfo } from "../../interfaces/pick-pd-info.model";
import { DocPffm } from "../../interfaces/doc-pffm.model";
import { keyBy } from "lodash";
import { PickPdItemInfo } from "../../interfaces/pick-pd-item-info.model";
import { PdBranchExtService } from "../pd-branch";

export class DocPffmExtService extends DocPffmService {

    get pdService() {
        return this.modRef.get<PdExtService>(PdExtService)
    }

    get pdBranchService() {
        return this.modRef.get<PdBranchExtService>(PdBranchExtService)
    }

    get pdWhService() {
        return this.modRef.get<PdWhExtService>(PdWhExtService)
    }

    get docPickService() {
        return this.modRef.get<DocPickExtService>(DocPickExtService)
    }

    checkAvailabity(params: { bid: string; brid: string; docPffmId?: string; docPffm?: DocPffm; }) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, docPffmId, docPffm } = params;

                if (!docPffm && !docPffmId) {
                    throw new Error('Invalid parameters')
                }

                if (!docPffm && docPffmId) {
                    docPffm = await this.getById( bid, { id: docPffmId });
                    if (!docPffm) {
                        throw new Error('Document not found')
                    }
                }

                const pdIds = docPffm.pd.map( pd => pd.pdId );

                const pdBranchs = await this.pdBranchService.get({ bid, brid, filter: { _in: { pdId: pdIds }}});

                const pdBranchMap = keyBy(pdBranchs, 'pdId');

                docPffm.pd.forEach( pd => {
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

                await this.update({ bid, brid, data: docPffm });
                await this.flush();

                resolve(docPffm);

            } catch(e) {

                reject(e)

            }
        })
    }

    createDocPick(params: { bid: string; brid: string; docPickId?: string; docs?: DocPffm[]; ids?: string[]; }) {
        return new Promise( async (resolve, reject) => {

            try {

                const { bid, brid, docPickId, docs, ids } = params;

                let docPffms: DocPffm[];

                if (docs) {

                    docPffms = docs;

                } else
                if (ids) {

                    docPffms = await this.get({ bid, brid, filter: { _in: { docPffmId: ids } }})

                } else {

                    docPffms = await this.get({ bid, brid, filter: { status: 'R' } })

                }
                const docId = docPickId || this.service.generateId();
                const pds = await this.pdService.get({ bid, brid });
                const pdMap = keyBy(pds, 'pdId')

                /*
                pickingType:
                    0 - Discrete picking
                    1 - Cluster picking
                    2 - Batch picking
                    3 - Wave picking
                */


               const docPicks: DocPick[] = [];

               docPffms.forEach( docPffm => {
                    const doc: DocPick = {
                        docPickId: docId,
                        docNo: 'PCK' + new Date().getTime().toString(),
                        docDate: new Date().getTime(),
                        pickingType: '0',
                        status: 'N'
                    }
                    const pickPds: PickPdInfo[] = [];
                    const pickOrds: PickOrdInfo[] = [];
                    const pickOrdItemMap: { [key:string] : PickOrdItemInfo[] } = {}
                    docPffm.pd.forEach( pd => {
                        const pickPd: PickPdInfo = {
                            pdId: pd.pdId,
                            qtyToPick: pd.orderedQty,
                            pickedQty: 0,
                            srcCount: pd.srcCount,
                            srcDoc: pd.srcDoc.map( doc => {
                                const pickOrdItem: PickOrdItemInfo = {
                                    pdId: pd.pdId,
                                    qtyToPick: doc.orderedQty,
                                    pickedQty: 0,
                                    itemId: doc.itemId,
                                    itemIndex: doc.itemIndex
                                }
                                if (pickOrdItemMap[doc.docId]) {
                                    pickOrdItemMap[doc.docId].push(pickOrdItem)
                                } else {
                                    pickOrdItemMap[doc.docId] = [ pickOrdItem ]
                                }
                                const res: PickPdItemInfo = {
                                    docId: doc.docId,
                                    docNo: doc.docNo,
                                    partnerName: doc.partnerName,
                                    qtyToPick: doc.orderedQty,
                                    pickedQty: 0,
                                    itemId: doc.itemId,
                                    itemIndex: doc.itemIndex,
                                }
                                return res;
                            })
                        }


                        pickPds.push(pickPd)
                        pd.srcDoc.forEach( item => {

                        })
                    })
                    docPffm.order.forEach( order => {
                        const pickOrd: PickOrdInfo = {
                            docId: order.docId,
                            docType: order.docType,
                            docNo: order.docNo,
                            docDate: order.docDate,
                            dueDate: order.dueDate,
                            partnerName: order.partnerName,
                            numOfItem: null,
                            items: pickOrdItemMap[order.docId]
                        }
                        pickOrds.push(pickOrd)
                    })

                    doc.ord = pickOrds;
                    doc.pd = pickPds
                    docPicks.push(doc)

                })



                await this.docPickService.addList({ bid, brid, data: docPicks, batch: true })

                resolve(docPicks)
            } catch(e) {
                reject(e)
            } finally {
                await this.docPickService.flush();
            }

        })
    }

}
