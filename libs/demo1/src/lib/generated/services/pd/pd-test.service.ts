import { PdExtService } from "./pd-ext.service";
import { Uom } from "../../interfaces/uom.model";
import shortUUID from "short-uuid";
import { Pd } from "../../interfaces/pd.model";
import { groupBy, keyBy } from "lodash";

import { faker } from '@faker-js/faker';
import { PdUom } from "../../interfaces/pd-uom.model";
import { PdBranch } from "../../interfaces/pd-branch.model";
import { PdWh } from "../../interfaces/pd-wh.model";
import { WhExtService } from "../wh";
import { WhStorageExtService } from "../wh-storage";
import { PdStorage } from "../../interfaces/pd-storage.model";
import { UomExtService } from "../uom";
import { PdWhExtService } from "../pd-wh";
import { WhStorage } from "../../interfaces/wh-storage.model";
import { PoolClient } from "pg";
import { BranchExtService } from "../branch";
import { writeFileSync } from "fs-extra";
import { PdLot } from "../../interfaces/pd-lot.model";
import { PdLotStorage } from "../../interfaces/pd-lot-storage.model";
import { PdLotExtService } from "../pd-lot";
import { PdLotStorageExtService } from "../pd-lot-storage";
import { pid } from "process";
import { PdStorageExtService, PdStorageService } from "../pd-storage";
import { PdCateExtService } from "../pd-cate";
import { PdSubcateExtService } from "../pd-subcate";

export class PdTestService extends PdExtService {

    get branchService() {
        return this.modRef.get<BranchExtService>(BranchExtService);
    }

    get uomService() {
        return this.modRef.get<UomExtService>(UomExtService);
    }

    get whService() {
        return this.modRef.get<WhExtService>(WhExtService);
    }

    override get pdStorageService(): PdStorageExtService {
        return this.modRef.get<PdStorageExtService>(PdStorageExtService);
    }

    override get pdWhService(): PdWhExtService {
        return this.modRef.get<PdWhExtService>(PdWhExtService);
    }

    override get pdLotService(): PdLotExtService {
        return this.modRef.get<PdLotExtService>(PdLotExtService);
    }

    override get pdLotStorageService(): PdLotStorageExtService {
        return this.modRef.get<PdLotStorageExtService>(PdLotStorageExtService);
    }

    get storageService() {
        return this.modRef.get<WhStorageExtService>(WhStorageExtService);
    }

    get pdCateService() {
        return this.modRef.get<PdCateExtService>(PdCateExtService);
    }

    get pdSubcateService() {
        return this.modRef.get<PdSubcateExtService>(PdSubcateExtService);
    }

    createTestData(bid: string, brid: string, options: { skipUom?: boolean; skipPd?: boolean; skipPdUom?: boolean; skipPdBranch?: boolean; skipPdWh?: boolean; skipPdStorage?: boolean; }) {
        return new Promise( async (resolve, reject) => {

            let sharedClient: PoolClient;

            let { skipUom, skipPd, skipPdUom, skipPdBranch, skipPdWh, skipPdStorage} = options;

            try {

                sharedClient = await this.service.bizConnect(bid);

                let uoms = await this.uomService.get({bid, brid});

                if (!uoms || uoms.length  === 0) {
                    uoms = [
                        { uomId: shortUUID.generate(), uomNo: 'PCS', uomName: 'Pieces'},
                        { uomId: shortUUID.generate(), uomNo: 'BOX', uomName: 'Boxes'},
                    ]
                } else {
                    skipUom = true;
                }

                const uomMap = keyBy(uoms, 'uomNo')

                const pdMap = {}

                let pds = await this.get({bid, brid})

                if (!pds || pds.length === 0) {
                    pds = Array.from({length: 200}, (_, index): Pd => {
                        const i = index + 1;
                        let pdName = faker.commerce.productName();
                        while (pdMap[pdName]) {
                            pdName = faker.commerce.productName();
                        }
                        pdMap[pdName] = true;
                        return { pdId: shortUUID.generate(), pdNo: `${i.toString().padStart(4,'0')}`, pdName: pdName, uomId: uomMap['PCS'].uomId, useLot: false, useSn: false, ohQty: 0, rop: 0, allocatedQty: 0, allowNegativeQty: false, stdPrice: parseFloat(faker.commerce.price()) }
                    });
                } else {
                    skipPd = true;
                }

                const branches = await this.branchService.get({ bid, brid, skipBridCheck: true, sharedClient })
                const whs = await this.whService.get({ bid, brid, skipBridCheck: true, sharedClient })
                const storages = await this.storageService.get({ bid, brid, skipBridCheck: true, sharedClient })

                let pdUoms: PdUom[] = [];
                let pdBranches: PdBranch[] = [];
                const pdWhs: PdWh[] = [];
                let pdStorages: PdStorage[] = [];

                let storageMap = {}

                whs.forEach( async wh => {
                    storageMap[wh.whId] = storages.filter( storage => storage.whId === wh.whId);
                })

                const whStorageIdx = {};
                await Promise.all(pds.map( async pd => {

                    if (!skipPdUom) {
                        const pduom: PdUom[] = [
                            { pdUomId: shortUUID.generate(), pdId: pd.pdId, uomId: pd.uomId, pdUnitNo: `${pd.pdNo}`, pdUnitName: `${pd.pdName}`, cnvFactor: 1, printUnit: uoms[0].uomNo },
                            { pdUomId: shortUUID.generate(), pdId: pd.pdId, uomId: pd.uomId, pdUnitNo: `${pd.pdNo}-${uoms[1].uomNo}-12`, pdUnitName: `${pd.pdName} (${uoms[1].uomName} 12 ${uoms[0].uomName})`, cnvFactor: 12, printUnit: uoms[1].uomNo },
                            { pdUomId: shortUUID.generate(), pdId: pd.pdId, uomId: pd.uomId, pdUnitNo: `${pd.pdNo}-${uoms[1].uomNo}-24`, pdUnitName: `${pd.pdName} (${uoms[1].uomName} 24 ${uoms[0].uomName})`, cnvFactor: 24 , printUnit: uoms[1].uomNo},
                        ]

                        pdUoms.push(...pduom);
                    }

                    if (!skipPdBranch) {
                        branches.forEach( branch => {
                            const pdBranch: PdBranch = { pdBranchId: shortUUID.generate(), branchId: branch.branchId, pdId: pd.pdId, ohQty: 0, allocatedQty: 0, allowNegativeQty: false}
                            pdBranches.push(pdBranch)
                        })
                    } else {
                        pdBranches = await this.pdBranchService.get({ bid, brid, skipBridCheck: true, filter: { pdId: pd.pdId } });
                    }


                    await Promise.all(whs.map( async wh => {
                        const st: WhStorage[] = storageMap[wh.whId];
                        if (!st) {

                            console.log('WHID ', wh.whId)
                        }

                        const pdBranch = pdBranches.find( pdb => pdb.branchId === wh.branchId)

                        whStorageIdx[wh.whId] = whStorageIdx[wh.whId] || { i: 0 };

                        const opdWh = {
                            pdWhId: shortUUID.generate(),
                            branchId: wh.branchId,
                            pdBranchId: pdBranch?.pdBranchId,
                            pdId: pd.pdId,
                            whId: wh.whId,
                            ohQty: 0,
                            ropQty: 0,
                            allocatedQty: 0,
                            allowNegativeQty: false
                        }

                        const pdWh = await this.pdWhService.beforeInsert({ bid, brid: wh.branchId, data: opdWh})

                        pdWhs.push(pdWh);

                        if (!st[whStorageIdx[wh.whId].i]) {
                            whStorageIdx[wh.whId].i = 0;
                        }

                        Array.from({length: 10}, (_, index) => {

                            const storage = st[whStorageIdx[wh.whId].i];

                            const pdStorage: PdStorage = {
                                branchId: wh.branchId,
                                pdStorageId: shortUUID.generate(),
                                pdId: pd.pdId,
                                whId: wh.whId,
                                pdBranchId: pdWh.pdBranchId,
                                pdWhId: pdWh.pdWhId,
                                whStorageId: storage.whStorageId,
                                ohQty: Math.max(100, Math.floor(Math.random() * 500)),
                                allocatedQty: 0,
                                allowNegativeQty: false,
                                whZoneId: storage.whZoneId,
                                whAisleId: storage.whAisleId,
                                whRackId: storage.whRackId,
                                whShelfId: storage.whShelfId
                            };

                            if (typeof pdStorage.pdBranchId === 'undefined' || pdStorage.pdBranchId === null ) {
                                console.log(pdStorage)
                            }

                            pdStorages.push(pdStorage);

                            whStorageIdx[wh.whId].i++;

                        })

                    }));

                }));

                // writeFileSync('pd-storages.json', JSON.stringify(pdStorages, null, 2))

                if (!skipUom) {
                    await this.uomService.addList({ bid, brid, data:uoms, batch: true, sharedClient });
                }
                if (!skipPd) {
                    await this.addList({ bid, brid, data:pds, batch: true, sharedClient });
                }
                if (!skipPdUom) {
                    await this.pdUomService.addList({ bid, brid, data:pdUoms, batch: true, sharedClient });
                }
                if (skipPdBranch) {
                    await this.pdBranchService.addList({ bid, brid, data:pdBranches, batch: true, sharedClient, skipBridCheck: true });
                }
                if (!skipPdWh) {
                    await this.pdWhService.addList({ bid, brid, data:pdWhs, batch: true, sharedClient, skipBridCheck: true });
                }
                if (!skipPdStorage) {
                    await this.pdStorageService.addList({ bid, brid, data:pdStorages, batch: true, sharedClient, skipBridCheck: true });
                }

                resolve('OK')

            } catch(e) {
                console.log(e)
                reject(e)
            } finally {
                try {
                    if (!skipUom) {
                        await this.uomService.flush();
                    }
                    if (!skipPd) {
                        await this.flush();
                    }
                    if (!skipPdUom) {
                        await this.pdUomService.flush();
                    }
                    if (!skipPdBranch) {
                        await this.pdBranchService.flush();
                    }
                    if (!skipPdWh) {
                        await this.pdWhService.flush();
                    }
                    if (!skipPdStorage) {
                        await this.pdStorageService.flush();
                    }
                    sharedClient?.release(true);
                } catch(e) {
                }
            }
        })
    }

    createTestLotData(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {

            try {

                const pds = await this.get({ bid, brid, filter: { useLot: true }})

                await Promise.all(pds.map( async pd => {

                    const pdStorages = await this.pdStorageService.get({ bid, brid, skipBridCheck: true, filter: { _and: [ { pdId: pd.pdId }, { _gt: { ohQty: 0 }} ] } });

                    const pdLots: PdLot[] = [1,2,3,4,5].map( i => {
                        const pdLot: PdLot = {
                            pdLotId: shortUUID.generate(),
                            pdId: pd.pdId,
                            lotNo: `LOT-${i.toString().padStart(4, '0')}`,
                            mfgDate: new Date().getTime(),
                            ohQty: 0,
                            allocatedQty: 0,
                            allowNegativeQty: false,
                            bizId: bid
                        }
                        return pdLot
                    })


                    const pdLotStorages: PdLotStorage[] = [];
                    let ohQty = 0;
                    let allocateQty = 0;

                    pdLots.forEach( pdLot => {
                        pdStorages.forEach( pdStorage => {
                            const qty = Math.max(80, Math.floor(Math.random() * 200));
                            const pdLotStorage: PdLotStorage = {
                                pdLotStorageId: shortUUID.generate(),
                                pdId: pd.pdId,
                                pdLotId: pdLot.pdLotId,
                                pdStorageId: pdStorage.pdStorageId,
                                ohQty: qty,
                                allocatedQty: 0,
                                allowNegativeQty: false,
                                suspended: false,
                                bizId: bid,
                                branchId: pdStorage.branchId,
                                whId: pdStorage.whId,
                                whZoneId: pdStorage.whZoneId,
                                whAisleId: pdStorage.whAisleId,
                                whRackId: pdStorage.whRackId,
                                whShelfId: pdStorage.whShelfId,
                                whStorageId: pdStorage.whStorageId,
                            }
                            ohQty = ohQty + pdLotStorage.ohQty
                            allocateQty = allocateQty + pdLotStorage.allocatedQty;
                            pdLotStorages.push(pdLotStorage);
                        });
                        pdLot.ohQty = ohQty;
                        pdLot.allocatedQty = allocateQty;
                    })
                    await this.pdLotService.addList({ bid, brid, data: pdLots, batch: true })
                    await this.pdLotStorageService.addList({ bid, brid, skipBridCheck: true, data: pdLotStorages, batch: true });
                }))
                await this.pdLotService.flush();
                await this.pdLotStorageService.flush();
                resolve('OK')
            } catch(e) {
                reject(e)
            }
        })
    }

    syncAllQty(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            let sharedClient: PoolClient;
            try {

                sharedClient = await this.service.bizConnect(bid);

                let pdBranches = await this.pdBranchService.get({ bid, brid, sharedClient, skipBridCheck: true });
                const pdBranchMap = groupBy(pdBranches, 'pdId')
                let pdWhs = await this.pdWhService.get({ bid, brid, sharedClient, skipBridCheck: true })
                const pdWhMap = groupBy(pdWhs, 'pdId')
                let pdStorages = await this.pdStorageService.get({ bid, brid, sharedClient, skipBridCheck: true })
                const pdStorageMap = groupBy(pdStorages, 'pdId');
                const pds = await this.pdService.get({ bid, brid, sharedClient })
                const pdMap = keyBy(pds, 'pdId');
                const whs = await this.whService.get({ bid, brid, sharedClient, skipBridCheck: true })
                const whMap = keyBy(whs, 'whId')
                const storages = await this.storageService.get({ bid, brid, sharedClient, skipBridCheck: true })
                const storageMap = keyBy(storages, 'storageId')

                // const branchs = await this.branchService.get({ bid, brid, sharedClient })
                // const branchMap = keyBy(branchs, 'branchId')

                // const whs = await this.whService.get({ bid, brid, skipBridCheck: true, sharedClient })
                // whs.forEach( wh => console.log(branchMap[wh.branchId].branchName, wh.whName))


                const pdQty = await Promise.all(pds.map( async pd => {
                     return await this.syncQty({ bid, brid, pd, cascading: true, persistOutside: true, preloaded: { pdBranchMap, pdWhMap, pdStorageMap, pdMap, whMap, storageMap }, sharedClient })
                }))

                // console.log(pdQty)

                const pdData = pdQty.filter( item => item.persist).map( item => item.pd);
                pdBranches = [];
                pdWhs = [];
                pdStorages = [];

                pdData.forEach( pd => {
                    const _pdBranches: any[] = pd.pdBranch;
                    delete pd.pdBranch;
                    _pdBranches.forEach( pdBranch => {
                        const _pdWhs: any[] = pdBranch.pdWh;
                        delete pdBranch.pdWh;
                        _pdWhs.forEach( pdWh => {
                            const _pdStorage: any[] = pdWh.pdStorage;
                            delete pdWh.pdStorage;
                            pdStorages.push(..._pdStorage)
                        })
                        pdWhs.push(..._pdWhs)
                    })
                    pdBranches.push(..._pdBranches)
                })

                await this.updateList({bid, brid, data: pdData, batch: true, sharedClient })
                await this.pdBranchService.updateList({bid, brid, data: pdBranches, batch: true, sharedClient })
                await this.pdWhService.updateList({bid, brid, data: pdWhs, batch: true, sharedClient })
                await this.pdStorageService.updateList({bid, brid, data: pdStorages, batch: true, sharedClient })

                resolve('OK')
            } catch(e) {
                console.log(e)
                reject(e)
            } finally {
                this.flush();
                this.pdBranchService.flush();
                this.pdWhService.flush();
                this.pdStorageService.flush();
            }
        })
    }

    testSkipBridCheck(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            const data = require('./pd-branch.json')
            let sharedClient: PoolClient;
            try {
                sharedClient = await this.service.bizConnect(bid);
                await this.pdBranchService.addList({ bid, brid, data, batch: true, sharedClient, skipBridCheck: true });
                resolve('OK')
            } catch (e) {
                console.log(e)
                reject(e)
            } finally {
            }
        })
    }

    createCateAndSubcate(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const subcates = await this.pdSubcateService.get({ bid, brid });
                const pds = await this.get({ bid, brid });
                pds.forEach( pd => {
                    const idx = Math.floor(Math.random() * subcates.length);
                    pd.pdSubcateId = subcates[idx].pdSubcateId;
                    pd.pdCateId = subcates[idx].pdCateId;
                })
                await this.updateList({ bid, brid, data: pds, batch: true })
                await this.flush();
                resolve('OK')
            } catch (e) {
                reject(e)
            } finally {
            }
        })

    }

    createPreferfedSupp(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const pdSupps = await this.pdSuppService.get({ bid, brid });
                const pdSuppMap = groupBy(pdSupps, 'pdId');
                const pds = await this.get({ bid, brid });
                pds.forEach( pd => {
                    const supps = pdSuppMap[pd.pdId];
                    const idx = Math.floor(Math.random() * supps.length);
                    pd.preferredSuppId = supps[idx].suppId;
                })
                await this.updateList({ bid, brid, data: pds, batch: true })
                await this.flush();
                resolve('OK')
            } catch (e) {
                reject(e)
            } finally {
            }
        })

    }

}
