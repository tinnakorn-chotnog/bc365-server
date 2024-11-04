import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { faker } from '@faker-js/faker';
import { DOC_TASK_PROVIDER } from './doc-task.provider';
import { DocTaskTestService } from './doc-task-test.service'
import { BIZ_PROVIDER, BizExtService } from '../biz';
import { WH_SU_PROVIDER, WhSuExtService } from '../wh-su';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { DOC_PICK_PROVIDER, DocPickExtService } from '../doc-pick';
import { Biz } from '../../interfaces/biz.model';
import { Branch } from '../../interfaces/branch.model';
import { DocPick } from '../../interfaces/doc-pick.model';
import { PdBranch } from '../../interfaces/pd-branch.model';
import { PdStorage } from '../../interfaces/pd-storage.model';
import { PdWh } from '../../interfaces/pd-wh.model';
import { Pd } from '../../interfaces/pd.model';
import { WhAisle } from '../../interfaces/wh-aisle.model';
import { WhRack } from '../../interfaces/wh-rack.model';
import { WhShelf } from '../../interfaces/wh-shelf.model';
import { WhStorage } from '../../interfaces/wh-storage.model';
import { WhZone } from '../../interfaces/wh-zone.model';
import { Wh } from '../../interfaces/wh.model';
import { BRANCH_PROVIDER, BranchExtService } from '../branch';
import { PD_PROVIDER, PdExtService } from '../pd';
import { PD_BRANCH_PROVIDER, PdBranchExtService } from '../pd-branch';
import { PD_STORAGE_PROVIDER, PdStorageExtService } from '../pd-storage';
import { PD_WH_PROVIDER, PdWhExtService } from '../pd-wh';
import { WH_PROVIDER, WhExtService } from '../wh';
import { WH_AISLE_PROVIDER, WhAisleExtService } from '../wh-aisle';
import { WH_RACK_PROVIDER, WhRackExtService } from '../wh-rack';
import { WH_SHELF_PROVIDER, WhShelfExtService } from '../wh-shelf';
import { WH_STORAGE_PROVIDER, WhStorageExtService } from '../wh-storage';
import { WH_ZONE_PROVIDER, WhZoneExtService } from '../wh-zone';
import { DOC_PACK_SU_PROVIDER } from '../doc-pack-su';
import { DOC_SO_PROVIDER } from '../doc-so';
import { RPN_PLAN_PROVIDER } from '../rpn-plan';
import { SU_TYPE_PROVIDER } from '../su-type';
import { groupBy, keyBy } from 'lodash';
import { PickOrdInfo } from '../../interfaces/pick-ord-info.model';
import { PickPdInfo } from '../../interfaces/pick-pd-info.model';
import { DocTask } from '../../interfaces/doc-task.model';
import { WhSu } from '../../interfaces/wh-su.model';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('DOC_TASK', () => {
    let poolService: PostgresPoolService;
    let docTaskTestService: DocTaskTestService

    let bid: string;
    let brid: string;

    let bizService: BizExtService;
    let branchService: BranchExtService;
    let whService: WhExtService;
    let whZoneService: WhZoneExtService;
    let whAisleService: WhAisleExtService;
    let whRackService: WhRackExtService;
    let whShelfService: WhShelfExtService;
    let whStorageService: WhStorageExtService;
    let whSuService: WhSuExtService;
    let pdService: PdExtService;
    let pdBranchService: PdBranchExtService;
    let pdWhService: PdWhExtService;
    let pdStorageService: PdStorageExtService;
    let docPickService: DocPickExtService;

    let _biz: Biz;
    let _branch: Branch;
    let _whs: Wh[];
    let _whZones: WhZone[];
    let _whAisles: WhAisle[];
    let _whRacks: WhRack[];
    let _whShelves: WhShelf[];
    let _whStorages: WhStorage[];
    let _whSus: WhSu[];
    let _pdWhs: PdWh[];
    let _pds: Pd[];
    let _pdBranches: PdBranch[];
    let _pdStorages: PdStorage[];
    let _docPickSameWh: DocPick;
    let _docPickDiffWh: DocPick;
    let _pdWhMap: { [key: string]: PdWh[]; };

    let docIdSameWh = '74n6qcrmF4tKTq8kWkhz6Y';
    let docIdDiffWh = 'eL4GJsib74SuTnEUgPKT8Z';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: ['.test.env'],
                    isGlobal: true,
                    validationSchema: Joi.object(configSchema)
                }),
            ],
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
                ...BIZ_PROVIDER,
                ...BRANCH_PROVIDER,
                ...DOC_PACK_SU_PROVIDER,
                ...PD_PROVIDER,
                ...PD_BRANCH_PROVIDER,
                ...PD_WH_PROVIDER,
                ...PD_STORAGE_PROVIDER,
                ...DOC_SO_PROVIDER,
                ...WH_PROVIDER,
                ...WH_ZONE_PROVIDER,
                ...WH_AISLE_PROVIDER,
                ...WH_RACK_PROVIDER,
                ...WH_SHELF_PROVIDER,
                ...WH_SU_PROVIDER,
                ...WH_STORAGE_PROVIDER,
                ...SU_TYPE_PROVIDER,
                ...RPN_PLAN_PROVIDER,
                ...DOC_TASK_PROVIDER,
                ...DOC_PICK_PROVIDER,
                DocTaskTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docTaskTestService = app.get<DocTaskTestService>(DocTaskTestService);
        bizService = app.get<BizExtService>(BizExtService);
        branchService = app.get<BranchExtService>(BranchExtService);
        whService = app.get<WhExtService>(WhExtService);
        whZoneService = app.get<WhZoneExtService>(WhZoneExtService);
        whAisleService = app.get<WhAisleExtService>(WhAisleExtService);
        whRackService = app.get<WhRackExtService>(WhRackExtService);
        whShelfService = app.get<WhShelfExtService>(WhShelfExtService);
        whStorageService = app.get<WhStorageExtService>(WhStorageExtService);
        whSuService = app.get<WhSuExtService>(WhSuExtService);
        pdService = app.get<PdExtService>(PdExtService);
        pdBranchService = app.get<PdBranchExtService>(PdBranchExtService);
        pdWhService = app.get<PdWhExtService>(PdWhExtService);
        pdStorageService = app.get<PdStorageExtService>(PdStorageExtService);
        docPickService = app.get<DocPickExtService>(DocPickExtService);

        _biz = {
            bizId: docTaskTestService.service.generateId(),
            bizNo: 'BIZ-01',
            bizName: 'BIZ-NAME-01'
        }

        _branch = {
            branchId: docTaskTestService.service.generateId(),
        }

        _whs = [
            {
                whId: docTaskTestService.service.generateId(),
                whNo: 'WH-01',
                whName: 'WH-NAME-01',
                bizId: _biz.bizId,
                branchId: _branch.branchId
            },
            {
                whId: docTaskTestService.service.generateId(),
                whNo: 'WH-02',
                whName: 'WH-NAME-02',
                bizId: _biz.bizId,
                branchId: _branch.branchId
            },
            {
                whId: docTaskTestService.service.generateId(),
                whNo: 'WH-03',
                whName: 'WH-NAME-03',
                bizId: _biz.bizId,
                branchId: _branch.branchId
            }
        ]

        _whZones = [];
        _whAisles = [];
        _whRacks = [];
        _whShelves = [];
        _whStorages = [];
        _pds = [];
        _pdStorages = [];

        // Suppose there 2 warehouse for testing and each warehouse consists of
        // 3-zone
        //   each zone has one aisle
        //      each aisle hasone rack
        //          each rack has one shelf
        //              each shelf has three storages
        // summary
        //  one-shelf has 3 storages
        //  one-rack has 3 storages because one-shelf-one-rack
        //  one-aisle has 3 storages because one-rack-one-aisle
        //  one-zone has 3 storages because one-aisle-one-zone
        //  one-warehouse has 9 storages because one-warehouse-three-zone

        let pdIdx = 1;
        _whs.forEach(wh => {
            ['01', '02', '03'].forEach(sufix => {
                // Zone
                const whZone: WhZone = {
                    whZoneId: docTaskTestService.service.generateId(),
                    whZoneNo: sufix,
                    whZoneName: 'ZONE-' + sufix,
                    bizId: _biz.bizId,
                    branchId: _branch.branchId,
                    whId: wh.whId
                }
                _whZones.push(whZone);
                // One Aisle one rack
                const whAisle: WhAisle = {
                    whAisleId: docTaskTestService.service.generateId(),
                    whAisleNo: whZone.whZoneNo + 'A1',
                    whAisleName: whZone.whZoneName + '-AISLE1',
                    whId: wh.whId,
                    whZoneId: whZone.whZoneId,
                    bizId: _biz.bizId,
                    branchId: _branch.branchId,
                }
                _whAisles.push(whAisle)
                // Rack
                const whRack: WhRack = {
                    whRackId: docTaskTestService.service.generateId(),
                    whRackNo: whAisle.whAisleNo + 'R1',
                    whRackName: whAisle.whAisleName + '-R1',
                    whId: wh.whId,
                    whZoneId: whAisle.whZoneId,
                    whAisleId: whAisle.whAisleId,
                    bizId: _biz.bizId,
                    branchId: _branch.branchId,
                }
                _whRacks.push(whRack)
                // Shelf
                const whShelf: WhShelf = {
                    whShelfId: docTaskTestService.service.generateId(),
                    whShelfNo: whRack.whRackNo + 'S1',
                    whShelfName: whRack.whRackName + '-S1',
                    bizId: _biz.bizId,
                    branchId: _branch.branchId,
                    whId: wh.whId,
                    whRackId: whRack.whRackId,
                    whAisleId: whRack.whAisleId,
                    whZoneId: whRack.whZoneId,
                }

                _whShelves.push(whShelf);

                // Storage
                ['1', '2', '3'].forEach(l => {

                    const whStorage: WhStorage = {
                        whStorageId: docTaskTestService.service.generateId(),
                        whId: wh.whId,
                        storageNo: whShelf.whShelfNo + l,
                        storageName: whShelf.whShelfName + '-BIN' + l,
                        whZoneId: whShelf.whZoneId,
                        whAisleId: whShelf.whAisleId,
                        whRackId: whShelf.whRackId,
                        whShelfId: whShelf.whShelfId,
                        bizId: _biz.bizId,
                        branchId: _branch.branchId
                    }

                    _whStorages.push(whStorage);

                })
            })
        })

        _whSus = [];

        _whs.forEach( wh => {
            ['T01','T02','T03','T04','T05','T06','T07','T08','T09','T10'].forEach( s => {
                const whSu: WhSu = {
                    whSuId: docTaskTestService.service.generateId(),
                    suNo: wh.whNo + '-' + s,
                    whId: wh.whId
                }
                _whSus.push(whSu);
            })
        })

        bid = _biz.bizId;
        brid = _branch.branchId;

        _biz = await bizService.add({ bid, brid, data: _biz })
        _branch = await branchService.add({ bid, brid, data: _branch })
        _whs = await whService.addList({ bid, brid, data: _whs, batch: true })
        _whZones = await whZoneService.addList({ bid, brid, data: _whZones, batch: true })
        _whAisles = await whAisleService.addList({ bid, brid, data: _whAisles, batch: true })
        _whRacks = await whRackService.addList({ bid, brid, data: _whRacks, batch: true })
        _whShelves = await whShelfService.addList({ bid, brid, data: _whShelves, batch: true })
        _whStorages = await whStorageService.addList({ bid, brid, data: _whStorages, batch: true })

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_TASK <test case group description>', () => {

        beforeAll(async () => {

            let pdIdx = 0;

            // Create product one-product-one-storage, so single product force to sit in single warehouse
            _pdStorages = [];
            _pds = _whStorages.map(ws => {
                const pd: Pd = {
                    pdId: docPickService.service.generateId(),
                    pdNo: 'P' + pdIdx.toString().padStart(3, '0'),
                    pdName: faker.commerce.productName(),
                    ohQty: 100,
                    allocatedQty: 0,
                    useLot: false,
                    bizId: _biz.bizId,
                }
                const pdStorage: PdStorage = {
                    pdStorageId: docPickService.service.generateId(),
                    pdId: pd.pdId,
                    whId: ws.whId,
                    whStorageId: ws.whStorageId,
                    whShelfId: ws.whShelfId,
                    whRackId: ws.whRackId,
                    whAisleId: ws.whAisleId,
                    whZoneId: ws.whZoneId,
                    ohQty: 100,
                    allocatedQty: 0,
                    bizId: _biz.bizId,
                    branchId: _branch.branchId

                }
                _pdStorages.push(pdStorage)
                return pd;
            })

            _pdBranches = _pds.map(pd => {
                return {
                    pdBranchId: docPickService.service.generateId(),
                    pdId: pd.pdId,
                    ohQty: 200,
                    allocatedQty: 0,
                    bizId: _biz.bizId,
                    branchId: _branch.branchId
                }
            })

            const pdBranchMap = keyBy(_pdBranches, 'pdId')

            _pdWhs = [];

            _whs.forEach(wh => {
                _pdStorages.filter(s => s.whId === wh.whId).forEach(pdStorage => {
                    const pdWh: PdWh = {
                        pdWhId: docPickService.service.generateId(),
                        pdId: pdStorage.pdId,
                        whId: wh.whId,
                        ohQty: 200,
                        allocatedQty: 0,
                        pdBranchId: pdBranchMap[pdStorage.pdId]?.pdBranchId,
                        bizId: _biz.bizId,
                        branchId: _branch.branchId,
                        whPref: {
                            defaultZoneId: pdStorage.whZoneId,
                            defaultAisleId: pdStorage.whAisleId,
                            defaultRackId: pdStorage.whRackId,
                            defaultShelfId: pdStorage.whShelfId,
                            defaultStorageId: pdStorage.whStorageId
                        }
                    }
                    _pdWhs.push(pdWh)
                })
            })

            _pdWhMap = groupBy(_pdWhs, 'whId');

            _pds = await pdService.addList({ bid, brid, data: _pds, batch: true });
            _pdBranches = await pdBranchService.addList({ bid, brid, data: _pdBranches, batch: true });
            _pdWhs = await pdWhService.addList({ bid, brid, data: _pdWhs, batch: true });
            _pdStorages = await pdStorageService.addList({ bid, brid, data: _pdStorages, batch: true })

        })
        describe('Pick in the same warehouse', () => {

            beforeAll(async () => {

            })
            it('#1.0 Create Pick Order', async () => {

                let pdIdx = 0;

                const wh = _whs[0];
                const whZones = _whZones.filter(z => z.whId === wh.whId)
                const zonePdMap = groupBy(_pdStorages.filter(s => s.whId === wh.whId), 'whZoneId');

                // products from zone 0
                const zone0Pds = zonePdMap[whZones[0].whZoneId]
                // products from zone 1
                const zone1Pds = zonePdMap[whZones[1].whZoneId]
                // products from zone 2
                const zone2Pds = zonePdMap[whZones[2].whZoneId]

                // first product from zone 0
                const zone0pd = zone0Pds[0]
                // first product from zone 1
                const zone1pd = zone1Pds[0]
                // first product from zone 2
                const zone2pd = zone2Pds[0]

                // each item of and order pick from difference zone in a warehouse
                const pickOrd: PickOrdInfo[] = [
                    {
                        docId: '1',
                        docType: 'SO',
                        docNo: `SO001`,
                        docDate: new Date().getTime(),
                        items: [
                            { pdId: zone0pd.pdId, orderedQty: 1, qtyToPick: 1, pickedQty: 0 },
                        ]
                    },
                    {
                        docId: '1',
                        docType: 'SO',
                        docNo: `SO002`,
                        docDate: new Date().getTime(),
                        items: [
                            { pdId: zone1pd.pdId, orderedQty: 1, qtyToPick: 1, pickedQty: 0 },
                        ]
                    },
                    {
                        docId: '1',
                        docType: 'SO',
                        docNo: `SO002`,
                        docDate: new Date().getTime(),
                        items: [
                            { pdId: zone2pd.pdId, orderedQty: 1, qtyToPick: 1, pickedQty: 0 },
                        ]
                    },
                ]

                const pdMap: { [key: string]: PickPdInfo } = {};
                const pdWhMap = keyBy(_pdWhs, 'pdId');

                // Discrete Order
                pickOrd.forEach(ord => {
                    ord.items.forEach(item => {
                        if (pdMap[item.pdId]) {
                            pdMap[item.pdId].qtyToPick += item.qtyToPick;
                        } else {
                            pdMap[item.pdId] = {
                                pdId: item.pdId,
                                qtyToPick: item.qtyToPick,
                                pickedQty: 0,
                                fromWhId: wh.whId,
                                fromZoneId: pdWhMap[item.pdId]?.whPref?.defaultZoneId,
                                fromAisleId: pdWhMap[item.pdId]?.whPref?.defaultAisleId,
                                fromRackId: pdWhMap[item.pdId]?.whPref?.defaultRackId,
                                fromShelfId: pdWhMap[item.pdId]?.whPref?.defaultShelfId,
                                fromStorageId: pdWhMap[item.pdId]?.whPref?.defaultStorageId,
                                srcDoc: [
                                    {
                                        docId: ord.docId,
                                        docNo: ord.docNo,
                                        itemId: item.itemId,
                                        itemIndex: item.itemIndex,
                                        qtyToPick: item.qtyToPick,
                                        pickedQty: 0,
                                    }
                                ]
                            }
                        }
                    })
                    return null;
                });

                const pdKeys = Object.keys(pdMap)
                const pickPd = pdKeys.map(pdId => {
                    return pdMap[pdId]
                })

                _docPickSameWh = {
                    docPickId: docIdSameWh,
                    docNo: 'PICK0001',
                    docDate: new Date().getTime(),
                    whId: wh.whId,
                    pickingType: '0',
                    ord: pickOrd,
                    pd: pickPd
                }

                _docPickSameWh = await docPickService.add({ bid, brid, data: _docPickSameWh })

                expect(true).toBe(true)
            })
            it('#1.1 Branch exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdSameWh })
                const pdIds = docPick.pd.map(pd => pd.pdId)
                const pdBranches = await pdBranchService.get({ bid, brid, filter: { _in: { pdId: pdIds } } });
                const pdBranchMap = keyBy(pdBranches, 'pdId');
                docPick.pd[0].qtyToPick = pdBranchMap[docPick.pd[0].pdId].ohQty + 2;
                docPick.pd[1].qtyToPick = pdBranchMap[docPick.pd[1].pdId].ohQty + 2;
                docPick.pd[2].qtyToPick = pdBranchMap[docPick.pd[2].pdId].ohQty + 2;
                const after = await docPickService.checkAvailabity({ bid, brid, docPick })
                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Same Wh exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdSameWh });
                const pickPds = docPick.pd;
                const pdIds = pickPds.map(p => p.pdId);
                const pdWhs = await docPickService.pdWhService.get({ bid, brid, filter: { _and: [{ whId: docPick.whId }, { _in: { pdId: pdIds } }] } });
                const pd0Wh = pdWhs.find(pd => pd.pdId === pickPds[0].pdId && pd.whId === pickPds[0].fromWhId)
                const pd1Wh = pdWhs.find(pd => pd.pdId === pickPds[1].pdId && pd.whId === pickPds[1].fromWhId)
                const pd2Wh = pdWhs.find(pd => pd.pdId === pickPds[2].pdId && pd.whId === pickPds[2].fromWhId)
                pickPds[0].qtyToPick = pd0Wh?.ohQty + 2;
                pickPds[1].qtyToPick = pd1Wh?.ohQty + 2;
                pickPds[2].qtyToPick = pd2Wh?.ohQty + 2;
                const after = await docPickService.checkAvailabity({ bid, brid, docPick })
                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Zone exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdSameWh });
                const pickPds = docPick.pd;
                const pd0: any = await docPickService.pdStorageService.pdAvailableByZone({ bid, brid, whZoneId: pickPds[0].fromZoneId, pdId: pickPds[0].pdId })
                const pd1: any = await docPickService.pdStorageService.pdAvailableByZone({ bid, brid, whZoneId: pickPds[1].fromZoneId, pdId: pickPds[1].pdId })
                const pd2: any = await docPickService.pdStorageService.pdAvailableByZone({ bid, brid, whZoneId: pickPds[2].fromZoneId, pdId: pickPds[2].pdId })

                // Reset aisle, rack , shelf, storage for testing zone only
                pickPds[0].fromAisleId = null;
                pickPds[1].fromAisleId = null;
                pickPds[2].fromAisleId = null;

                pickPds[0].fromRackId = null;
                pickPds[1].fromRackId = null;
                pickPds[2].fromRackId = null;

                pickPds[0].fromShelfId = null;
                pickPds[1].fromShelfId = null;
                pickPds[2].fromShelfId = null;

                pickPds[0].fromStorageId = null;
                pickPds[1].fromStorageId = null;
                pickPds[2].fromStorageId = null;

                pickPds[0].qtyToPick = pd0.ohQty + 2;
                pickPds[1].qtyToPick = pd1.ohQty + 2;
                pickPds[2].qtyToPick = pd2.ohQty + 2;

                const after = await docPickService.checkAvailabity({ bid, brid, docPick })
                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Aisle exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdSameWh });

                const pickPds = docPick.pd;

                const pd0: any = await docPickService.pdStorageService.pdAvailableByAisle({ bid, brid, whAisleId: pickPds[0].fromAisleId, pdId: pickPds[0].pdId })
                const pd1: any = await docPickService.pdStorageService.pdAvailableByAisle({ bid, brid, whAisleId: pickPds[1].fromAisleId, pdId: pickPds[1].pdId })
                const pd2: any = await docPickService.pdStorageService.pdAvailableByAisle({ bid, brid, whAisleId: pickPds[2].fromAisleId, pdId: pickPds[2].pdId })

                // Reset rack , shelf, storage for testing aisle only

                pickPds[0].fromRackId = null;
                pickPds[1].fromRackId = null;
                pickPds[2].fromRackId = null;

                pickPds[0].fromShelfId = null;
                pickPds[1].fromShelfId = null;
                pickPds[2].fromShelfId = null;

                pickPds[0].fromStorageId = null;
                pickPds[1].fromStorageId = null;
                pickPds[2].fromStorageId = null;

                pickPds[0].qtyToPick = pd0.ohQty + 2;
                pickPds[1].qtyToPick = pd1.ohQty + 2;
                pickPds[2].qtyToPick = pd2.ohQty + 2;

                const after = await docPickService.checkAvailabity({ bid, brid, docPick })

                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Rack exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdSameWh });

                const pickPds = docPick.pd;

                const pd0: any = await docPickService.pdStorageService.pdAvailableByRack({ bid, brid, whRackId: pickPds[0].fromRackId, pdId: pickPds[0].pdId })
                const pd1: any = await docPickService.pdStorageService.pdAvailableByRack({ bid, brid, whRackId: pickPds[1].fromRackId, pdId: pickPds[1].pdId })
                const pd2: any = await docPickService.pdStorageService.pdAvailableByRack({ bid, brid, whRackId: pickPds[2].fromRackId, pdId: pickPds[2].pdId })

                // Reset shelf, storage for testing rack only

                pickPds[0].fromShelfId = null;
                pickPds[1].fromShelfId = null;
                pickPds[2].fromShelfId = null;

                pickPds[0].fromStorageId = null;
                pickPds[1].fromStorageId = null;
                pickPds[2].fromStorageId = null;

                pickPds[0].qtyToPick = pd0.ohQty + 2;
                pickPds[1].qtyToPick = pd1.ohQty + 2;
                pickPds[2].qtyToPick = pd2.ohQty + 2;

                const after = await docPickService.checkAvailabity({ bid, brid, docPick })

                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Shelf exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdSameWh });

                const pickPds = docPick.pd;

                const pd0: any = await docPickService.pdStorageService.pdAvailableByShelf({ bid, brid, whShelfId: pickPds[0].fromShelfId, pdId: pickPds[0].pdId })
                const pd1: any = await docPickService.pdStorageService.pdAvailableByShelf({ bid, brid, whShelfId: pickPds[1].fromShelfId, pdId: pickPds[1].pdId })
                const pd2: any = await docPickService.pdStorageService.pdAvailableByShelf({ bid, brid, whShelfId: pickPds[2].fromShelfId, pdId: pickPds[2].pdId })

                // Reset storage for testing shelf only

                pickPds[0].fromStorageId = null;
                pickPds[1].fromStorageId = null;
                pickPds[2].fromStorageId = null;

                pickPds[0].qtyToPick = pd0.ohQty + 2;
                pickPds[1].qtyToPick = pd1.ohQty + 2;
                pickPds[2].qtyToPick = pd2.ohQty + 2;

                const after = await docPickService.checkAvailabity({ bid, brid, docPick })

                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Storage exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdSameWh });

                const pickPds = docPick.pd;

                const pd0: any = await docPickService.pdStorageService.pdAvailableByStorage({ bid, brid, whStorageId: pickPds[0].fromStorageId, pdId: pickPds[0].pdId })
                const pd1: any = await docPickService.pdStorageService.pdAvailableByStorage({ bid, brid, whStorageId: pickPds[1].fromStorageId, pdId: pickPds[1].pdId })
                const pd2: any = await docPickService.pdStorageService.pdAvailableByStorage({ bid, brid, whStorageId: pickPds[2].fromStorageId, pdId: pickPds[2].pdId })

                // Reset storage for testing shelf only

                pickPds[0].qtyToPick = pd0.ohQty + 2;
                pickPds[1].qtyToPick = pd1.ohQty + 2;
                pickPds[2].qtyToPick = pd2.ohQty + 2;

                const after = await docPickService.checkAvailabity({ bid, brid, docPick })

                expect(after.length).toBeGreaterThan(0)

            })
            describe('#1.1 Create cluster picking task', () => {
                let docPick: DocPick;
                let docTask: DocTask;
                beforeAll(async () => {
                    docPick = await docPickService.getById(bid, { id: docIdSameWh });
                })
                it('#1.1 Create cluster picking task', async () => {
                    docTask = await docTaskTestService.createClusterTask({ bid, brid, docPick });
                })
                it('#1.1 Create batch picking task', async () => {
                    docTask = await docTaskTestService.createBatchTask({ bid, brid, docPick });
                })
                it('#1.1 Create route', async () => {
                    // console.log(docTask.pd.map( pd => pd.ord))
                })
            })
        })
        describe('Pick in the different warehouse', () => {
            it('#1.0 Create Pick Order', async () => {

                let pdIdx = 0;

                // we suppose that each order has different product
                const wh0 = _whs[0];
                const wh1 = _whs[1];
                const wh2 = _whs[2];
                const wh0Zones = _whZones.filter(z => z.whId === wh0.whId)
                const wh1Zones = _whZones.filter(z => z.whId === wh1.whId)
                const wh2Zones = _whZones.filter(z => z.whId === wh2.whId)
                // Storarge of warehouse 0 group by zone
                const wh0ZonePdMap = groupBy(_pdStorages.filter(s => s.whId === wh0.whId), 'whZoneId');
                // Storarge of warehouse 1 group by zone
                const wh1ZonePdMap = groupBy(_pdStorages.filter(s => s.whId === wh1.whId), 'whZoneId');
                // Storarge of warehouse 2 group by zone
                const wh2ZonePdMap = groupBy(_pdStorages.filter(s => s.whId === wh2.whId), 'whZoneId');
                // Storage of warehouse 0 zone 0 of 3
                const wh0Zone0Pds = wh0ZonePdMap[wh0Zones[0].whZoneId]
                // Storage of warehouse 1 zone 0 of 3
                const wh1Zone0Pds = wh1ZonePdMap[wh1Zones[0].whZoneId]
                // Storage of warehouse 2 zone 0 of 3
                const wh2Zone0Pds = wh2ZonePdMap[wh2Zones[0].whZoneId]
                // Fist product of warehouse 0 zone 0
                const wh0Zone0pd = wh0Zone0Pds[0]
                // Fist product of warehouse 0 zone 0
                const wh1Zone0pd = wh1Zone0Pds[0]
                // Fist product of warehouse 0 zone 0
                const wh2Zone0pd = wh2Zone0Pds[0]

                const pickOrd: PickOrdInfo[] = [
                    {
                        docId: '1',
                        docType: 'SO',
                        docNo: `SO001`,
                        docDate: new Date().getTime(),
                        items: [
                            {
                                itemId: docPickService.service.generateId(),
                                pdId: wh0Zone0pd.pdId,
                                orderedQty: 1,
                                qtyToPick: 1,
                                pickedQty: 0,
                                fromWhId: wh0Zone0pd.whId,
                                fromZoneId: wh0Zone0pd.whZoneId,
                                fromAisleId: wh0Zone0pd.whAisleId,
                                fromRackId: wh0Zone0pd.whRackId,
                                fromShelfId: wh0Zone0pd.whShelfId,
                                fromStorageId: wh0Zone0pd.whStorageId,
                            },
                        ]
                    },
                    {
                        docId: '1',
                        docType: 'SO',
                        docNo: `SO002`,
                        docDate: new Date().getTime(),
                        items: [
                            {
                                pdId: wh1Zone0pd.pdId,
                                orderedQty: 1,
                                qtyToPick: 1,
                                pickedQty: 0,
                                fromWhId: wh1Zone0pd.whId,
                                fromZoneId: wh1Zone0pd.whZoneId,
                                fromAisleId: wh1Zone0pd.whAisleId,
                                fromRackId: wh1Zone0pd.whRackId,
                                fromShelfId: wh1Zone0pd.whShelfId,
                                fromStorageId: wh1Zone0pd.whStorageId,
                            },
                        ]
                    },
                    {
                        docId: '1',
                        docType: 'SO',
                        docNo: `SO002`,
                        docDate: new Date().getTime(),
                        items: [
                            {
                                pdId: wh2Zone0pd.pdId,
                                orderedQty: 1,
                                qtyToPick: 1,
                                pickedQty: 0,
                                fromWhId: wh2Zone0pd.whId,
                                fromZoneId: wh2Zone0pd.whZoneId,
                                fromAisleId: wh2Zone0pd.whAisleId,
                                fromRackId: wh2Zone0pd.whRackId,
                                fromShelfId: wh2Zone0pd.whShelfId,
                                fromStorageId: wh2Zone0pd.whStorageId,
                            },
                        ]
                    },
                ]

                const pdMap: { [key: string]: PickPdInfo } = {};
                const pdWhMap = keyBy(_pdWhs, 'pdId');

                // Discrete Order
                pickOrd.forEach(ord => {
                    ord.items.forEach(item => {
                        if (pdMap[item.pdId]) {
                            pdMap[item.pdId].qtyToPick += item.qtyToPick;
                        } else {
                            pdMap[item.pdId] = {
                                pdId: item.pdId,
                                qtyToPick: item.qtyToPick,
                                pickedQty: 0,
                                fromWhId: item.fromWhId,
                                fromZoneId: item.fromZoneId,
                                fromAisleId: item.fromAisleId,
                                fromRackId: item.fromRackId,
                                fromShelfId: item.fromShelfId,
                                fromStorageId: item.fromStorageId,
                                srcDoc: [
                                    {
                                        docId: ord.docId,
                                        docNo: ord.docNo,
                                        itemId: item.itemId,
                                        itemIndex: item.itemIndex,
                                        qtyToPick: item.qtyToPick,
                                        pickedQty: 0,
                                    }
                                ]
                            }
                        }
                    })
                    return null;
                });

                const pdKeys = Object.keys(pdMap)
                const pickPd = pdKeys.map(pdId => {
                    return pdMap[pdId]
                })

                _docPickDiffWh = {
                    docPickId: docIdDiffWh,
                    docNo: 'PICK0002',
                    docDate: new Date().getTime(),
                    pickingType: '0',
                    ord: pickOrd,
                    pd: pickPd
                }

                _docPickDiffWh = await docPickService.add({ bid, brid, data: _docPickDiffWh })
            });

            it('#1.1 Branch exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdDiffWh })
                const pdIds = docPick.pd.map(pd => pd.pdId)
                const pdBranches = await pdBranchService.get({ bid, brid, filter: { _in: { pdId: pdIds } } });
                const pdBranchMap = keyBy(pdBranches, 'pdId');
                docPick.pd[0].qtyToPick = pdBranchMap[docPick.pd[0].pdId].ohQty + 2;
                docPick.pd[1].qtyToPick = pdBranchMap[docPick.pd[1].pdId].ohQty + 2;
                docPick.pd[2].qtyToPick = pdBranchMap[docPick.pd[2].pdId].ohQty + 2;
                const after = await docPickService.checkAvailabity({ bid, brid, docPick })
                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Wh exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdDiffWh });
                const pickPds = docPick.pd;
                const pdIds = pickPds.map(p => p.pdId);
                const whIds = pickPds.map(p => p.fromWhId);
                const pdWhs = await docPickService.pdWhService.get({ bid, brid, filter: { _and: [{ _in: { whId: whIds } }, { _in: { pdId: pdIds } }] } });
                const pd0Wh = pdWhs.find(pd => pd.pdId === pickPds[0].pdId && pd.whId === pickPds[0].fromWhId)
                const pd1Wh = pdWhs.find(pd => pd.pdId === pickPds[1].pdId && pd.whId === pickPds[1].fromWhId)
                const pd2Wh = pdWhs.find(pd => pd.pdId === pickPds[2].pdId && pd.whId === pickPds[2].fromWhId)
                pickPds[0].qtyToPick = pd0Wh?.ohQty + 2;
                pickPds[1].qtyToPick = pd1Wh?.ohQty + 2;
                pickPds[2].qtyToPick = pd2Wh?.ohQty + 2;
                const after = await docPickService.checkAvailabity({ bid, brid, docPick })
                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Zone exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdDiffWh });
                const pickPds = docPick.pd;
                const pd0: any = await docPickService.pdStorageService.pdAvailableByZone({ bid, brid, whZoneId: pickPds[0].fromZoneId, pdId: pickPds[0].pdId })
                const pd1: any = await docPickService.pdStorageService.pdAvailableByZone({ bid, brid, whZoneId: pickPds[1].fromZoneId, pdId: pickPds[1].pdId })
                const pd2: any = await docPickService.pdStorageService.pdAvailableByZone({ bid, brid, whZoneId: pickPds[2].fromZoneId, pdId: pickPds[2].pdId })

                // Reset aisle, rack , shelf, storage for testing zone only
                pickPds[0].fromAisleId = null;
                pickPds[1].fromAisleId = null;
                pickPds[2].fromAisleId = null;

                pickPds[0].fromRackId = null;
                pickPds[1].fromRackId = null;
                pickPds[2].fromRackId = null;

                pickPds[0].fromShelfId = null;
                pickPds[1].fromShelfId = null;
                pickPds[2].fromShelfId = null;

                pickPds[0].fromStorageId = null;
                pickPds[1].fromStorageId = null;
                pickPds[2].fromStorageId = null;

                pickPds[0].qtyToPick = pd0.ohQty + 2;
                pickPds[1].qtyToPick = pd1.ohQty + 2;
                pickPds[2].qtyToPick = pd2.ohQty + 2;

                const after = await docPickService.checkAvailabity({ bid, brid, docPick })
                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Aisle exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdDiffWh });

                const pickPds = docPick.pd;

                const pd0: any = await docPickService.pdStorageService.pdAvailableByAisle({ bid, brid, whAisleId: pickPds[0].fromAisleId, pdId: pickPds[0].pdId })
                const pd1: any = await docPickService.pdStorageService.pdAvailableByAisle({ bid, brid, whAisleId: pickPds[1].fromAisleId, pdId: pickPds[1].pdId })
                const pd2: any = await docPickService.pdStorageService.pdAvailableByAisle({ bid, brid, whAisleId: pickPds[2].fromAisleId, pdId: pickPds[2].pdId })

                // Reset rack , shelf, storage for testing aisle only

                pickPds[0].fromRackId = null;
                pickPds[1].fromRackId = null;
                pickPds[2].fromRackId = null;

                pickPds[0].fromShelfId = null;
                pickPds[1].fromShelfId = null;
                pickPds[2].fromShelfId = null;

                pickPds[0].fromStorageId = null;
                pickPds[1].fromStorageId = null;
                pickPds[2].fromStorageId = null;

                pickPds[0].qtyToPick = pd0.ohQty + 2;
                pickPds[1].qtyToPick = pd1.ohQty + 2;
                pickPds[2].qtyToPick = pd2.ohQty + 2;

                const after = await docPickService.checkAvailabity({ bid, brid, docPick })

                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Rack exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdDiffWh });

                const pickPds = docPick.pd;

                const pd0: any = await docPickService.pdStorageService.pdAvailableByRack({ bid, brid, whRackId: pickPds[0].fromRackId, pdId: pickPds[0].pdId })
                const pd1: any = await docPickService.pdStorageService.pdAvailableByRack({ bid, brid, whRackId: pickPds[1].fromRackId, pdId: pickPds[1].pdId })
                const pd2: any = await docPickService.pdStorageService.pdAvailableByRack({ bid, brid, whRackId: pickPds[2].fromRackId, pdId: pickPds[2].pdId })

                // Reset shelf, storage for testing rack only

                pickPds[0].fromShelfId = null;
                pickPds[1].fromShelfId = null;
                pickPds[2].fromShelfId = null;

                pickPds[0].fromStorageId = null;
                pickPds[1].fromStorageId = null;
                pickPds[2].fromStorageId = null;

                pickPds[0].qtyToPick = pd0.ohQty + 2;
                pickPds[1].qtyToPick = pd1.ohQty + 2;
                pickPds[2].qtyToPick = pd2.ohQty + 2;

                const after = await docPickService.checkAvailabity({ bid, brid, docPick })

                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Shelf exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdDiffWh });

                const pickPds = docPick.pd;

                const pd0: any = await docPickService.pdStorageService.pdAvailableByShelf({ bid, brid, whShelfId: pickPds[0].fromShelfId, pdId: pickPds[0].pdId })
                const pd1: any = await docPickService.pdStorageService.pdAvailableByShelf({ bid, brid, whShelfId: pickPds[1].fromShelfId, pdId: pickPds[1].pdId })
                const pd2: any = await docPickService.pdStorageService.pdAvailableByShelf({ bid, brid, whShelfId: pickPds[2].fromShelfId, pdId: pickPds[2].pdId })

                // Reset storage for testing shelf only

                pickPds[0].fromStorageId = null;
                pickPds[1].fromStorageId = null;
                pickPds[2].fromStorageId = null;

                pickPds[0].qtyToPick = pd0.ohQty + 2;
                pickPds[1].qtyToPick = pd1.ohQty + 2;
                pickPds[2].qtyToPick = pd2.ohQty + 2;

                const after = await docPickService.checkAvailabity({ bid, brid, docPick })

                expect(after.length).toBeGreaterThan(0)
            })
            it('#1.1 Storage exception', async () => {
                const docPick = await docPickService.getById(bid, { id: docIdDiffWh });

                const pickPds = docPick.pd;

                const pd0: any = await docPickService.pdStorageService.pdAvailableByStorage({ bid, brid, whStorageId: pickPds[0].fromStorageId, pdId: pickPds[0].pdId })
                const pd1: any = await docPickService.pdStorageService.pdAvailableByStorage({ bid, brid, whStorageId: pickPds[1].fromStorageId, pdId: pickPds[1].pdId })
                const pd2: any = await docPickService.pdStorageService.pdAvailableByStorage({ bid, brid, whStorageId: pickPds[2].fromStorageId, pdId: pickPds[2].pdId })

                // Reset storage for testing shelf only

                pickPds[0].qtyToPick = pd0.ohQty + 2;
                pickPds[1].qtyToPick = pd1.ohQty + 2;
                pickPds[2].qtyToPick = pd2.ohQty + 2;

                const after = await docPickService.checkAvailabity({ bid, brid, docPick })

                expect(after.length).toBeGreaterThan(0)

            })

        })
    })

});