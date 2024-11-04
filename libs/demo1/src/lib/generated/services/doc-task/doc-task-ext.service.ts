import { DocTaskService } from "./doc-task.service";
import { keyBy } from "lodash";
import { DocPick } from "../../interfaces/doc-pick.model";
import { DocTask } from "../../interfaces/doc-task.model";
import { WhZoneExtService } from "../wh-zone";
import { WhAisleExtService } from "../wh-aisle";
import { WhRackExtService } from "../wh-rack";
import { WhShelfExtService } from "../wh-shelf";
import { WhSuExtService } from "../wh-su";
import { DocPackSuExtService } from "../doc-pack-su";
import { DocPickExtService } from "../doc-pick";
import { WhStorageExtService } from "../wh-storage";
import { TaskPdInfo } from "../../interfaces/task-pd-info.model";
import { TaskPdOrdInfo } from "../../interfaces/task-pd-ord-info.model";
import { PickPdInfo } from "../../interfaces/pick-pd-info.model";
import { PickOrdInfo } from "../../interfaces/pick-ord-info.model";
import { PickPdItemInfo } from "../../interfaces/pick-pd-item-info.model";

export class DocTaskExtService extends DocTaskService {

    get whStorageService() {
        return this.modRef.get<WhStorageExtService>(WhStorageExtService)
    }

    get whSuService() {
        return this.modRef.get<WhSuExtService>(WhSuExtService)
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

    get docPackSuService() {
        return this.modRef.get<DocPackSuExtService>(DocPackSuExtService)
    }

    get docPickService() {
        return this.modRef.get<DocPickExtService>(DocPickExtService)
    }

    assignSuToTask(params: { bid: string; brid: string; whSuId: string; docPickOrdId: string; multipleSu: boolean; }) {
        return new Promise(async (resolve, reject) => {

            try {

                const { bid, brid, whSuId, docPickOrdId, multipleSu } = params;

                const whSu = await this.whSuService.getById(bid, { id: whSuId });

                if (whSu.inPicking) {
                    throw new Error('Storage does not empty.')
                }

            } catch (e) {
                resolve(e)
            }

        });
    }

    createDiscreteTask(params: { bid: string; brid: string; docPickId?: string; docPick?: DocPick; orderIds?: string[]; }) {
        return new Promise<DocTask[]>(async (resolve, reject) => {

            try {

                const { bid, brid } = params;

                resolve(null);

            } catch (e) {

                reject(e)

            }
        })
    }

    createClusterTask(params: { bid: string; brid: string; docPickId?: string; docPick?: DocPick; orderIds?: string[], docPrefix?: string; }) {
        return new Promise<DocTask>(async (resolve, reject) => {

            try {

                let { bid, brid, docPickId, docPick, orderIds, docPrefix } = params;

                if (!docPick && !docPickId) {
                    throw new Error('Doc Pick document not found.')
                } else
                if (!docPick && docPickId) {
                    docPick = await this.docPickService.getById(bid, { id: docPickId })
                }

                if (docPick.pickingType !== '0') {
                    throw new Error('Doc Pick document is not discrete picking type.')
                }

                const docPickPd = docPick.pd;
                const docPickPdMap = keyBy(docPickPd, 'pdId')

                // create ONE-TASK-MULTIPLE-ORDER document
                // complete orders in one task

                const docId = this.service.generateId();

                const docTask: DocTask = {
                    docTaskId: docId,
                    docNo: (docPrefix || 'CP') + '1'.padStart(4, '0'),
                    docDate: new Date().getTime(),
                    pd: []
                };

                const taskPdMap: { [key:string]: TaskPdInfo; } = {};
                const pickPdMap = keyBy(docPick.pd, 'pdId');

                let pickOrds: PickOrdInfo[];

                if (orderIds) {
                    pickOrds = docPick.ord.filter( o => orderIds.includes(o.docId) )
                } else {
                    pickOrds = docPick.ord;
                }

                pickOrds.forEach( ord => {
                    ord.items.forEach( item => {
                        if (taskPdMap[item.pdId]) {
                            const taskOrd: TaskPdOrdInfo = {
                                docId: ord.docId,
                                docNo: ord.docNo,
                                partnerName: ord.partnerName,
                                qtyToPick: item.qtyToPick,
                                pickedQty: 0,
                                finalSuId: ord.finalSuId,
                                itemId: item.itemId,
                                itemIndex: item.itemIndex
                            }

                            taskPdMap[item.pdId].qtyToPick += item.orderedQty
                            taskPdMap[item.pdId].ord.push(taskOrd)
                        } else {
                            const pickPd = pickPdMap[item.pdId];
                            const taskOrd: TaskPdOrdInfo = {
                                docId: ord.docId,
                                docNo: ord.docNo,
                                partnerName: ord.partnerName,
                                qtyToPick: item.qtyToPick,
                                pickedQty: 0,
                                finalSuId: ord.finalSuId,
                                itemId: item.itemId,
                                itemIndex: item.itemIndex
                            }
                            taskPdMap[item.pdId] = {
                                pdId: item.pdId,
                                qtyToPick: item.orderedQty,
                                pickedQty: 0,
                                fromZoneId: pickPd.fromZoneId,
                                fromAisleId: pickPd.fromAisleId,
                                fromRackId: pickPd.fromRackId,
                                fromShelfId: pickPd.fromShelfId,
                                fromStorageId: pickPd.fromStorageId,
                                ord: [ taskOrd ]
                            }
                        }
                    })
                })

                const taskPdKeys = Object.keys(taskPdMap);
                const taskPds = taskPdKeys.map( k => {
                    return taskPdMap[k];
                })

                docTask.pd = taskPds;

                await this.add({ bid, brid, data: docTask });

                resolve(docTask);

            } catch (e) {

                reject(e)

            }
        })
    }

    createBatchTask(params: { bid: string; brid: string; docPickId?: string; docPick?: DocPick; pickPdIds?: string[], docPrefix?: string; }) {
        return new Promise<DocTask>(async (resolve, reject) => {

            try {

                let { bid, brid, docPickId, docPick, pickPdIds, docPrefix } = params;

                if (!docPick && !docPickId) {
                    throw new Error('Doc Pick document not found.')
                } else
                    if (!docPick && docPickId) {
                        docPick = await this.docPickService.getById(bid, { id: docPickId })
                    }

                if (docPick.pickingType !== '0') {
                    throw new Error('Doc Pick document is not discrete picking type.')
                }

                let pickPds: PickPdInfo[];

                if (pickPdIds) {
                    pickPds = docPick.pd.filter( o => pickPdIds.includes(o.pdId) )
                } else {
                    pickPds = docPick.pd;
                }

                // create ONE-TASK-MULTIPLE-PRODUCT document
                // complete products in one task

                const docId = this.service.generateId();

                const docTask: DocTask = {
                    docTaskId: docId,
                    docNo: (docPrefix || 'BP') + '1'.padStart(4, '0'),
                    docDate: new Date().getTime(),
                    pd: []
                };

                const pickOrdMap = keyBy(docPick.ord, 'docId')

                pickPds.forEach(pickPd => {
                    const taskPd: TaskPdInfo = {
                        pdId: pickPd.pdId,
                        qtyToPick: pickPd.qtyToPick,
                        pickedQty: 0,
                        fromZoneId: pickPd.fromZoneId,
                        fromAisleId: pickPd.fromAisleId,
                        fromRackId: pickPd.fromRackId,
                        fromShelfId: pickPd.fromShelfId,
                        fromStorageId: pickPd.fromStorageId,
                        ord: pickPd.srcDoc.map(d => {
                            const ord = pickOrdMap[d.docId]
                            const dstOrd: TaskPdOrdInfo = {
                                docId: ord.docId,
                                docNo: ord.docNo,
                                partnerName: ord.partnerName,
                                finalSuId: ord.finalSuId,
                                qtyToPick: d.qtyToPick,
                                pickedQty: 0,
                                itemId: d.itemId,
                                itemIndex: d.itemIndex
                            }
                            return dstOrd;
                        })
                    }
                    docTask.pd.push(taskPd);
                })

                await this.add({ bid, brid, data: docTask });

                resolve(docTask);

            } catch (e) {

                reject(e)

            }
        })
    }

    // createTaskRoute(params: { bid: string; brid: string; docTaskId: string; }) {
    //     return new Promise( async (resolve, reject) => {

    //         try {

    //             const { bid, brid, docTaskId } = params;

    //             const whStorages = await this.whStorageService.get({ bid, brid });
    //             const whStorageMap = keyBy(whStorages, 'whStorageId')
    //             const whZones = await this.whZoneService.get({ bid, brid });
    //             const whZoneMap = keyBy(whZones, 'whZoneId')
    //             const whAisles = await this.whAisleService.get({ bid, brid });
    //             const whAisleMap = keyBy(whAisles, 'whAisleId')
    //             const whRacks = await this.whRackService.get({ bid, brid });
    //             const whRackMap = keyBy(whRacks, 'whRackId')
    //             const whShelves = await this.whShelfService.get({ bid, brid });
    //             const whShelfMap = keyBy(whShelves, 'whShelfId')
    //             const docTask = await this.getById(bid, { id: docTaskId });
    //             const docTaskPds = await this.docTaskPdService.get({ bid, brid, filter: { docTaskId: docTaskId } });
    //             const pdIds = docTaskPds.map( pd => pd.pdId );
    //             const pdStorages = await this.pdStorageService.get({ bid, brid, filter: { _and: [ { _in: { pdId: pdIds } }, { pickable: true  } ] } });
    //             const pdStorageMap = groupBy(pdStorages, 'pdId');
    //             const pdStorageIdMap = keyBy(pdStorages, 'pdStorageId');

    //             const docTaskStorage: DocTaskStorage[] = [];

    //             docTaskPds.forEach( taskPd => {

    //                 if (taskPd.pickStorageId) {

    //                     const storage = pdStorageIdMap[taskPd.pdStorageId];
    //                     const qtyToPick = storage.qtyToPick || 0;

    //                     const taskStorage: DocTaskStorage = {
    //                         docTaskStorageId: this.service.generateId(),
    //                         docTaskPdId: taskPd.docTaskPdId,
    //                         docTaskId: taskPd.docTaskId,
    //                         pdStorageId: taskPd.pdStorageId,
    //                         qtyToPick: taskPd.qtyToPick,
    //                         pickedQty: 0,
    //                         refPdNo: taskPd.refPdNo,
    //                         refPdName: taskPd.refPdName,
    //                         refStorageNo: storage?.refStorageNo
    //                     }

    //                     docTaskStorage.push(taskStorage);
    //                     storage.qtyToPick = qtyToPick + taskPd.qtyToPick

    //                 } else {

    //                     const unfilterStorages = pdStorageMap[taskPd.pdId];
    //                     let storages: PdStorage[];

    //                     if (taskPd.pickShelfId) {
    //                         storages = unfilterStorages.filter( s => s.whShelfId === taskPd.pickShelfId)
    //                     } else
    //                     if (taskPd.pickRackId) {
    //                         storages = unfilterStorages.filter( s => s.whRackId === taskPd.pickRackId)
    //                     } else
    //                     if (taskPd.pickAisleId) {
    //                         storages = unfilterStorages.filter( s => s.whAisleId === taskPd.pickAisleId)
    //                     } else
    //                     if (taskPd.pickZoneId) {
    //                         storages = unfilterStorages.filter( s => s.whZoneId === taskPd.pickZoneId)
    //                     } else {
    //                         storages = unfilterStorages
    //                     }

    //                     if (storages.length !== 0) {
    //                         const sortedStorage = orderBy(storages.filter( s => s.ohQty > 0), 'ohQty', 'desc') as PdStorage[]
    //                         let remainQty = taskPd.qtyToPick;
    //                         let storageIdx = 0;
    //                         while ( remainQty > 0) {
    //                             const ohQty = sortedStorage[storageIdx].ohQty || 0;
    //                             const allocatedQty = sortedStorage[storageIdx].allocatedQty || 0;
    //                             const qtyToPick = sortedStorage[storageIdx].qtyToPick || 0;
    //                             const availQty = ohQty - allocatedQty - qtyToPick
    //                             if (availQty >= remainQty) {
    //                                 const taskStorage: DocTaskStorage = {
    //                                     docTaskStorageId: this.service.generateId(),
    //                                     docTaskPdId: taskPd.docTaskPdId,
    //                                     docTaskId: taskPd.docTaskId,
    //                                     pdStorageId: sortedStorage[storageIdx].pdStorageId,
    //                                     qtyToPick: taskPd.qtyToPick,
    //                                     pickedQty: 0,
    //                                     refPdNo: taskPd.refPdNo,
    //                                     refPdName: taskPd.refPdName,
    //                                     refStorageNo: sortedStorage[storageIdx].refStorageNo
    //                                 }
    //                                 docTaskStorage.push(taskStorage)
    //                                 sortedStorage[storageIdx].qtyToPick = qtyToPick + remainQty;
    //                                 remainQty = 0;
    //                             } else {
    //                                 const taskStorage: DocTaskStorage = {
    //                                     docTaskStorageId: this.service.generateId(),
    //                                     docTaskPdId: taskPd.docTaskPdId,
    //                                     docTaskId: taskPd.docTaskId,
    //                                     pdStorageId: sortedStorage[storageIdx].pdStorageId,
    //                                     qtyToPick: availQty,
    //                                     pickedQty: 0,
    //                                     refPdNo: taskPd.refPdNo,
    //                                     refPdName: taskPd.refPdName,
    //                                     refStorageNo: sortedStorage[storageIdx].refStorageNo
    //                                 }
    //                                 docTaskStorage.push(taskStorage)
    //                                 sortedStorage[storageIdx].qtyToPick = qtyToPick + availQty;
    //                                 remainQty -= availQty;
    //                                 storageIdx++;
    //                             }
    //                         }
    //                     }

    //                 }

    //             })

    //             const docTaskRoutes: DocTaskRoute[] = [];
    //             const docTaskRouteMap = {};
    //             const storagesToUpdate: PdStorage[] = [];

    //             docTaskStorage.forEach( taskStorage => {

    //                 const storage = pdStorageIdMap[taskStorage.pdStorageId];
    //                 const whStorage = whStorageMap[storage.whStorageId]


    //                 let routeKey: string = '';

    //                 if (docTask.routeLevel === '1') {
    //                     routeKey = storage.whZoneId
    //                 } else
    //                 if (docTask.routeLevel === '2') {
    //                     routeKey = storage.whZoneId + '-' + storage.whAisleId
    //                 } else
    //                 if (docTask.routeLevel === '3') {
    //                     routeKey = storage.whZoneId + '-' + storage.whAisleId + '-' + storage.whRackId
    //                 } else
    //                 if (docTask.routeLevel === '4') {
    //                     routeKey = storage.whZoneId + '-' + storage.whAisleId + '-' + storage.whRackId + '-' + storage.whShelfId
    //                 } else {
    //                     routeKey = storage.whZoneId
    //                 }

    //                 if (!docTaskRouteMap[routeKey]) {

    //                     const taskRout: DocTaskRoute = {
    //                         docTaskRouteId: this.service.generateId(),
    //                         docTaskId: docTaskId,
    //                     }
    //                     if (docTask.routeLevel === '1') {
    //                         taskRout.whZoneId = storage.whZoneId
    //                     } else
    //                     if (docTask.routeLevel === '2') {
    //                         taskRout.whZoneId = storage.whZoneId;
    //                         taskRout.whAisleId = storage.whAisleId;
    //                         taskRout.refZoneNo = whZoneMap[whStorage.whZoneId]?.whZoneNo;
    //                         taskRout.refAisleNo = whAisleMap[whStorage.whAisleId]?.whAisleNo;
    //                     } else
    //                     if (docTask.routeLevel === '3') {
    //                         taskRout.whZoneId = storage.whZoneId;
    //                         taskRout.whAisleId = storage.whAisleId;
    //                         taskRout.whRackId = storage.whRackId
    //                         taskRout.refZoneNo = whZoneMap[whStorage.whZoneId]?.whZoneNo;
    //                         taskRout.refAisleNo = whAisleMap[whStorage.whAisleId]?.whAisleNo;
    //                         taskRout.refRackNo = whRackMap[whStorage.whRackId]?.whRackNo;
    //                     } else
    //                     if (docTask.routeLevel === '4') {
    //                         taskRout.whZoneId = storage.whZoneId;
    //                         taskRout.whAisleId = storage.whAisleId;
    //                         taskRout.whRackId = storage.whRackId
    //                         taskRout.whShelfId = storage.whShelfId
    //                         taskRout.refZoneNo = whZoneMap[whStorage.whZoneId]?.whZoneNo;
    //                         taskRout.refAisleNo = whAisleMap[whStorage.whAisleId]?.whAisleNo;
    //                         taskRout.refRackNo = whRackMap[whStorage.whRackId]?.whRackNo;
    //                         taskRout.refShelfNo = whShelfMap[whStorage.whShelfId]?.rackShelfNo || whShelfMap[whStorage.whShelfId]?.whShelfNo;
    //                     } else {
    //                         taskRout.whZoneId = storage.whZoneId
    //                         taskRout.refZoneNo = whZoneMap[whStorage.whZoneId]?.whZoneNo
    //                         // taskRout.whZoneId = storage.whZoneId;
    //                         // taskRout.whAisleId = storage.whAisleId;
    //                         // taskRout.whRackId = storage.whRackId
    //                         // taskRout.whShelfId = storage.whShelfId
    //                         // taskRout.refZoneNo = whZoneMap[whStorage.whZoneId]?.whZoneNo;
    //                         // taskRout.refAisleNo = whAisleMap[whStorage.whAisleId]?.whAisleNo;
    //                         // taskRout.refRackNo = whRackMap[whStorage.whRackId]?.whRackNo;
    //                         // taskRout.refShelfNo = whShelfMap[whStorage.whShelfId]?.rackShelfNo || whShelfMap[whStorage.whShelfId]?.whShelfNo;
    //                     }

    //                     docTaskRouteMap[routeKey] =  taskRout;
    //                     docTaskRoutes.push(taskRout)
    //                     storagesToUpdate.push(storage)

    //                 }
    //             })

    //             await this.pdStorageService.updateList({ bid, brid, data: storagesToUpdate, batch: true })
    //             await this.docTaskStorageService.addList({ bid, brid, data: docTaskStorage, batch: true })
    //             await this.docTaskRouteService.addList({ bid, brid, data: docTaskRoutes, batch: true })
    //             await this.pdStorageService.flush();
    //             await this.docTaskStorageService.flush();
    //             await this.docTaskRouteService.flush();

    //             resolve(docTaskRoutes)

    //         } catch(e) {

    //             reject(e)

    //         }
    //     })
    // }


}
