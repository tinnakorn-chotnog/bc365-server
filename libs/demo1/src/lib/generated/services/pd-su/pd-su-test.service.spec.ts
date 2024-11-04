import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_SU_PROVIDER } from './pd-su.provider';
import { PdSuTestService } from './pd-su-test.service'
import { BIZ_PROVIDER, BizExtService } from '../biz';
import { INV_TRN_PROVIDER } from '../inv-trn';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { BRANCH_PROVIDER, BranchExtService } from '../branch';
import { PD_BRANCH_PROVIDER, PdBranchExtService } from '../pd-branch';
import { PD_LOT_PROVIDER, PdLotExtService } from '../pd-lot';
import { PD_LOT_STORAGE_PROVIDER, PdLotStorageExtService } from '../pd-lot-storage';
import { PD_STORAGE_PROVIDER, PdStorageExtService } from '../pd-storage';
import { PD_WH_PROVIDER, PdWhExtService } from '../pd-wh';
import { PD_PROVIDER } from '../pd/pd.provider';
import { WH_PROVIDER, WhExtService } from '../wh';
import { WH_AISLE_PROVIDER, WhAisleExtService } from '../wh-aisle';
import { WH_RACK_PROVIDER, WhRackExtService } from '../wh-rack';
import { WH_SHELF_PROVIDER, WhShelfExtService } from '../wh-shelf';
import { WH_STORAGE_PROVIDER, WhStorageExtService } from '../wh-storage';
import { WH_SU_PROVIDER, WhSuExtService } from '../wh-su';
import { WH_ZONE_PROVIDER, WhZoneExtService } from '../wh-zone';
import { Biz } from '../../interfaces/biz.model';
import { Branch } from '../../interfaces/branch.model';
import { PdBranch } from '../../interfaces/pd-branch.model';
import { PdStorage } from '../../interfaces/pd-storage.model';
import { PdSu } from '../../interfaces/pd-su.model';
import { PdWh } from '../../interfaces/pd-wh.model';
import { Pd } from '../../interfaces/pd.model';
import { WhAisle } from '../../interfaces/wh-aisle.model';
import { WhRack } from '../../interfaces/wh-rack.model';
import { WhShelf } from '../../interfaces/wh-shelf.model';
import { WhStorage } from '../../interfaces/wh-storage.model';
import { WhSu } from '../../interfaces/wh-su.model';
import { WhZone } from '../../interfaces/wh-zone.model';
import { Wh } from '../../interfaces/wh.model';
import { PdExtService } from '../pd/pd-ext.service';
import { PdSuExtService } from './pd-su-ext.service';
import { PdAllocationInfo } from '../../interfaces/pd-allocation-info.model';
import { PdLot } from '../../interfaces/pd-lot.model';
import { PdLotStorage } from '../../interfaces/pd-lot-storage.model';
import { groupBy, keyBy } from 'lodash';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PD_SU', () => {
    let poolService: PostgresPoolService;
    let pdSuTestService: PdSuTestService

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
    let pdLotService: PdLotExtService;
    let pdLotStorageService: PdLotStorageExtService;
    let pdBranchService: PdBranchExtService;
    let pdWhService: PdWhExtService;
    let pdStorageService: PdStorageExtService;
    let pdSuService: PdSuExtService;

    let _biz: Biz;
    let _branch: Branch;
    let _whs: Wh[];
    let _wh: Wh;
    let _whZones: WhZone[];
    let _whZone: WhZone;
    let _whAisles: WhAisle[];
    let _whAisle: WhAisle;
    let _whRacks: WhRack[];
    let _whRack: WhRack;
    let _whShelves: WhShelf[];
    let _whShelf: WhShelf;
    let _whStorages: WhStorage[];
    let _whStorage: WhStorage;
    let _whSus: WhSu[];
    let _whSu: WhSu;
    let _pds: Pd[];
    let _pd: Pd;
    let _pdBranches: PdBranch[];
    let _pdBranch: PdBranch;
    let _pdWhs: PdWh[];
    let _pdWh: PdWh;
    let _pdStorages: PdStorage[];
    let _pdStorage: PdStorage;
    let _pdSus: PdSu[];
    let _pdSu: PdSu;

    let _srcWhStorage: WhStorage;
    let _dstWhStorage: WhStorage;
    let _srcWhSu: WhSu;
    let _dstWhSu: WhSu;
    let _whSuAtWh: WhSu;
    let _whSuAtStorage: WhSu;
    let _srcPdSu: PdSu;
    let _dstPdSu: PdSu;

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
                ...WH_PROVIDER,
                ...WH_ZONE_PROVIDER,
                ...WH_AISLE_PROVIDER,
                ...WH_RACK_PROVIDER,
                ...WH_SHELF_PROVIDER,
                ...WH_STORAGE_PROVIDER,
                ...WH_SU_PROVIDER,
                ...PD_PROVIDER,
                ...PD_BRANCH_PROVIDER,
                ...PD_WH_PROVIDER,
                ...PD_STORAGE_PROVIDER,
                ...PD_LOT_PROVIDER,
                ...PD_LOT_STORAGE_PROVIDER,
				...INV_TRN_PROVIDER,
                ...PD_SU_PROVIDER,
                PdSuTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdSuTestService = app.get<PdSuTestService>(PdSuTestService);
        pdStorageService = app.get<PdStorageExtService>(PdStorageExtService);
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
        pdLotService = app.get<PdLotExtService>(PdLotExtService);
        pdLotStorageService = app.get<PdLotStorageExtService>(PdLotStorageExtService);
        pdBranchService = app.get<PdBranchExtService>(PdBranchExtService);
        pdWhService = app.get<PdWhExtService>(PdWhExtService);
        pdStorageService = app.get<PdStorageExtService>(PdStorageExtService);
        pdSuService = app.get<PdSuExtService>(PdSuExtService)

        _biz = {
            bizId: pdSuTestService.service.generateId(),
            bizNo: 'BIZ-01',
            bizName: 'BIZ-NAME-01'
        }

        _branch = {
            branchId: pdSuTestService.service.generateId(),
        }

        _whs = [
            {
                whId: pdSuTestService.service.generateId(),
                whNo: 'WH-01',
                whName: 'WH-NAME-01',
                bizId: bid,
                branchId: brid
            },
            {
                whId: pdSuTestService.service.generateId(),
                whNo: 'WH-02',
                whName: 'WH-NAME-02',
                bizId: bid,
                branchId: brid
            },
            {
                whId: pdSuTestService.service.generateId(),
                whNo: 'WH-03',
                whName: 'WH-NAME-03',
                bizId: bid,
                branchId: brid
            }
        ]

        _wh = _whs[0];

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
                    whZoneId: pdSuTestService.service.generateId(),
                    whZoneNo: sufix,
                    whZoneName: 'ZONE-' + sufix,
                    bizId: bid,
                    branchId: brid,
                    whId: wh.whId
                }
                _whZones.push(whZone);
                // One Aisle one rack
                const whAisle: WhAisle = {
                    whAisleId: pdSuTestService.service.generateId(),
                    whAisleNo: whZone.whZoneNo + 'A1',
                    whAisleName: whZone.whZoneName + '-AISLE1',
                    whId: wh.whId,
                    whZoneId: whZone.whZoneId,
                    bizId: bid,
                    branchId: brid
                }
                _whAisles.push(whAisle)
                // Rack
                const whRack: WhRack = {
                    whRackId: pdSuTestService.service.generateId(),
                    whRackNo: whAisle.whAisleNo + 'R1',
                    whRackName: whAisle.whAisleName + '-R1',
                    whId: wh.whId,
                    whZoneId: whAisle.whZoneId,
                    whAisleId: whAisle.whAisleId,
                    bizId: bid,
                    branchId: brid
                }
                _whRacks.push(whRack)
                // Shelf
                const whShelf: WhShelf = {
                    whShelfId: pdSuTestService.service.generateId(),
                    whShelfNo: whRack.whRackNo + 'S1',
                    whShelfName: whRack.whRackName + '-S1',
                    bizId: bid,
                    branchId: brid,
                    whId: wh.whId,
                    whRackId: whRack.whRackId,
                    whAisleId: whRack.whAisleId,
                    whZoneId: whRack.whZoneId,
                }

                _whShelves.push(whShelf);

                // Storage
                ['1', '2', '3'].forEach(l => {

                    const whStorage: WhStorage = {
                        whStorageId: pdSuTestService.service.generateId(),
                        whId: wh.whId,
                        storageNo: whShelf.whShelfNo + l,
                        storageName: whShelf.whShelfName + '-BIN' + l,
                        whZoneId: whShelf.whZoneId,
                        whAisleId: whShelf.whAisleId,
                        whRackId: whShelf.whRackId,
                        whShelfId: whShelf.whShelfId,
                        bizId: bid,
                        branchId: brid
                    }

                    _whStorages.push(whStorage);

                })
            })
        })

        // Defaule from warehouse 0
        _whZone = _whZones[0]
        _whAisle = _whAisles[0]
        _whRack = _whRacks[0]
        _whShelf = _whShelves[0]
        _whStorage = _whStorages[0]

        _whSus = [];

        _whs.forEach( wh => {
            ['T01','T02','T03','T04','T05','T06','T07','T08','T09','T10'].forEach( s => {
                const whSu: WhSu = {
                    whSuId: pdSuTestService.service.generateId(),
                    suNo: wh.whNo + '-' + s,
                    whId: wh.whId
                }
                _whSus.push(whSu);
            })
        })

        bid = _biz.bizId;
        brid = _branch.branchId;

        _whSus = [
            {
                whSuId: pdSuTestService.service.generateId(),
                suNo: 'SU-01',
                whId: _wh.whId,
                bizId: bid,
                branchId: brid,
                whStorageId: _whStorage.whStorageId
            },
            {
                whSuId: pdSuTestService.service.generateId(),
                suNo: 'SU-02',
                whId: _wh.whId,
                bizId: bid,
                branchId: brid,
                whStorageId: _whStorage.whStorageId
            },
            {
                whSuId: pdSuTestService.service.generateId(),
                suNo: 'SU-03',
                whId: _wh.whId,
                bizId: bid,
                branchId: brid,
                whStorageId: _whStorage.whStorageId
            },
            {
                whSuId: pdSuTestService.service.generateId(),
                suNo: 'SU-04',
                whId: _wh.whId,
                bizId: bid,
                branchId: brid,
                whStorageId: _whStorage.whStorageId
            },
        ];

        _whSu = _whSus[0]

        _srcWhSu = {
            whSuId: pdSuTestService.service.generateId(),
            suNo: 'SRC-SU-01',
            whId: _wh.whId,
            bizId: bid,
            branchId: brid,
            whStorageId: _whStorage.whStorageId
        }

        _dstWhSu = {
            whSuId: pdSuTestService.service.generateId(),
            suNo: 'DST-SU-01',
            whId: _wh.whId,
            bizId: bid,
            branchId: brid,
            whStorageId: _whStorage.whStorageId
        }

        _whSuAtWh = {
            whSuId: pdSuTestService.service.generateId(),
            suNo: 'DST-SU-01',
            whId: _wh.whId,
            bizId: bid,
            branchId: brid,
        }

        _whSuAtStorage = {
            whSuId: pdSuTestService.service.generateId(),
            suNo: 'DST-SU-01',
            whId: _wh.whId,
            bizId: bid,
            branchId: brid,
            whStorageId: _whStorage.whStorageId
        }

        _whSus.push(_srcWhSu, _dstWhSu, _whSuAtStorage, _whSuAtWh)

        pdIdx = 1;
        _pds = _whStorages.map( ws => {
            const pd: Pd = {
                pdId: pdSuTestService.service.generateId(),
                pdNo: 'P' + pdIdx.toString().padStart(3, '0'),
                pdName: 'P-NAME-' + pdIdx.toString().padStart(3, '0'),
                ohQty: 100,
                allocatedQty: 0,
                useLot: false,
                bizId: bid,
            }
            pdIdx++;
            return pd;
        })

        _pd = _pds[0]

        _pdBranches = [];

        _pds.forEach( pd => {
            const o: PdBranch =  {
                pdBranchId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                ohQty: 0,
                allocatedQty: 0,
                bizId: bid,
                branchId: brid
            }
            _pdBranches.push(o)
        })

        _pdBranch = _pdBranches[0]

        _pdWhs = [];

        _pds.forEach( pd => {
            _whs.forEach( wh => {
                const o: PdWh =  {
                    pdWhId: pdSuTestService.service.generateId(),
                    pdId: pd.pdId,
                    whId: wh.whId,
                    ohQty: 0,
                    allocatedQty: 0,
                    pdBranchId: _pdBranch.pdBranchId,
                    bizId: bid,
                    branchId: brid
                }
                _pdWhs.push(o)
            })
        })

        _pdWh = _pdWhs[0]

        _pdStorages = [];
        _pds.forEach( pd => {
            _whStorages.forEach( storage => {
                const o: PdStorage =  {
                    pdStorageId: pdSuTestService.service.generateId(),
                    pdId: pd.pdId,
                    whStorageId: storage.whStorageId,
                    whShelfId: storage.whShelfId,
                    whRackId: storage.whRackId,
                    whAisleId: storage.whAisleId,
                    whZoneId: storage.whZoneId,
                    ohQty: 10,
                    allocatedQty: 0,
                    bizId: bid,
                    branchId: brid
                }
                _pdStorages.push(o)
            })
        })

        _pdStorage = _pdStorages[0]

        _pdSus = [];

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
        _whSus = await whSuService.addList({ bid, brid, data: _whSus, batch: true })
        _pds = await pdService.addList({ bid, brid, data: _pds, batch: true })
        _pdBranches = await pdBranchService.addList({ bid, brid, data: _pdBranches, batch: true })
        _pdWhs = await pdWhService.addList({ bid, brid, data: _pdWhs, batch: true })
        _pdStorages = await pdStorageService.addList({ bid, brid, data: _pdStorages, batch: true })

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_SU <test case group description>', () => {
        it('#1.1 Before insert', async () => {
            let pdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _whSu.whSuId,
                ohQty: 10,
                allocatedQty: 0
            }
            pdSu = await pdSuTestService.beforeInsert({ bid, brid, data: pdSu })
            expect(pdSu).toEqual({
                pdSuId: pdSu.pdSuId,
                pdId: pdSu.pdId,
                whSuId: pdSu.whSuId,
                pdWhId: pdSu.pdWhId,
                pdStorageId: pdSu.pdStorageId,
                whStorageId: pdSu.whStorageId,
                allocatedQty: 0,
                ohQty: 10,
                whId: pdSu.whId
            })
        })
        it('#1.1 Get or create', async () => {
            const res = await pdSuTestService.getOrCreate({ bid, brid, pdId: _pd.pdId, whSuId: _whSu.whSuId });
        })
        it('#1.1 Allocate without quantity', async () => {
            let pdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _whSu.whSuId,
                ohQty: 0,
                allocatedQty: 0
            }
            pdSu = await pdSuTestService.add({ bid, brid, data: pdSu })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdSuTestService.allocateQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: qtyToAllocate, bubble: true })
              }).rejects.toThrow('No quantity for allocation.')
        })
        it('#1.1 Allocate with not enough quantity', async () => {
            let pdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _whSu.whSuId,
                ohQty: 4,
                allocatedQty: 0
            }
            pdSu = await pdSuTestService.add({ bid, brid, data: pdSu })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdSuTestService.allocateQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: qtyToAllocate, bubble: true })
              }).rejects.toThrow('Quantity can allocate 4 of 5. current on-hand: 4, current allocated: 0')
        })
        it('#1.1 Allocate Qty for su park at storage', async () => {
            let pdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _whSu.whSuId,
                ohQty: 5,
                allocatedQty: 0
            }
            pdSu = await pdSuTestService.add({ bid, brid, data: pdSu })
            const oldAllocatedQty = pdSu.allocatedQty;
            const qtyToAllocate = 5;
            const allocateQty = jest.spyOn(pdSuTestService.pdStorageService, 'allocateQty').mockImplementation( () => null );
            let res = await pdSuTestService.allocateQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: qtyToAllocate, bubble: true })
            expect(res).toEqual({
                "lastAllocatedQty": pdSu.allocatedQty || 0,
                "allocatedQty": oldAllocatedQty + qtyToAllocate,
                "pdSuId": pdSu.pdSuId,
            })
            expect(allocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdSu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToAllocate,
                "sharedClient": undefined,
            })
            allocateQty.mockReset();
        })
        it('#1.1 Deallocate Qty', async () => {
            let pdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _whSu.whSuId,
                ohQty: 5,
                allocatedQty: 5,
            }
            pdSu = await pdSuTestService.add({ bid, brid, data: pdSu })
            const oldAllocatedQty = pdSu.allocatedQty;
            const qtyToDeallocate = 5;
            const allocateQty = jest.spyOn(pdSuTestService.pdStorageService, 'deallocateQty').mockImplementation( () => null );
            let res = await pdSuTestService.deallocateQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: qtyToDeallocate, bubble: true })
            expect(res).toEqual({
                "lastAllocatedQty": pdSu.allocatedQty,
                "allocatedQty": oldAllocatedQty - qtyToDeallocate,
                "pdSuId": pdSu.pdSuId,
            })
            expect(allocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdSu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToDeallocate,
                "sharedClient": undefined,
            })
            allocateQty.mockReset();
            pdSu = await pdSuTestService.getById(bid, { id: pdSu.pdSuId })
            expect(pdSu.allocation).toEqual([])
            expect(pdSu.allocatedQty).toEqual(0)
        })
        it('#1.1 Increase Qty', async () => {
            let pdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _whSu.whSuId,
                ohQty: 5,
                allocatedQty: 0,
            }
            pdSu = await pdSuTestService.add({ bid, brid, data: pdSu })
            const qtyToIncrease = 5;
            const increaseQty = jest.spyOn(pdSuTestService.pdStorageService, 'increaseQty').mockImplementation( () => null );
            const res = await pdSuTestService.increaseQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: qtyToIncrease, bubble: true })
            expect(res).toEqual({
                "lastQty": pdSu.ohQty,
                "newQty": pdSu.ohQty + qtyToIncrease,
                "pdSuId": pdSu.pdSuId,
            })
            expect(increaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdSu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToIncrease,
                "sharedClient": undefined,
            })
            increaseQty.mockReset();
            pdSu = await pdSuTestService.getById(bid, { id: pdSu.pdSuId })
            expect(pdSu.ohQty).toEqual(10)
        })
        it('#1.1 Decrease Qty', async () => {
            let pdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _whSu.whSuId,
                ohQty: 5,
                allocatedQty: 0,
            }
            pdSu = await pdSuTestService.add({ bid, brid, data: pdSu })
            const qtyToDecrease = 5;
            const decreaseQty = jest.spyOn(pdSuTestService.pdStorageService, 'decreaseQty').mockImplementation( () => null );
            const res = await pdSuTestService.decreaseQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: qtyToDecrease, bubble: true })
            expect(res).toEqual({
                "lastQty": pdSu.ohQty,
                "newQty": pdSu.ohQty - qtyToDecrease,
                "pdSuId": pdSu.pdSuId,
            })
            expect(decreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdSu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToDecrease,
                "sharedClient": undefined,
            })
            decreaseQty.mockReset();
            pdSu = await pdSuTestService.getById(bid, { id: pdSu.pdSuId })
            expect(pdSu.ohQty).toEqual(0)
        })
        it('#1.1 Adjust Qty Increase', async () => {
            let pdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _whSu.whSuId,
                ohQty: 5,
                allocatedQty: 0,
            }
            pdSu = await pdSuTestService.add({ bid, brid, data: pdSu })
            const diffQty = 10;
            const qtyToAdjust = pdSu.ohQty + diffQty;
            const increaseQty = jest.spyOn(pdSuTestService.pdStorageService, 'increaseQty').mockImplementation( () => null );
            const res = await pdSuTestService.adjustQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: qtyToAdjust, bubble: true })
            expect(res).toEqual({
                "lastQty": pdSu.ohQty,
                "newQty": qtyToAdjust,
                "pdSuId": pdSu.pdSuId,
            })
            expect(increaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdSu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": diffQty,
                "sharedClient": undefined,
            })
            increaseQty.mockReset();
            pdSu = await pdSuTestService.getById(bid, { id: pdSu.pdSuId })
            expect(pdSu.ohQty).toEqual(15)
        })
        it('#1.1 Adjust Qty Decrease', async () => {
            let pdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _whSu.whSuId,
                ohQty: 25,
                allocatedQty: 0,
            }
            pdSu = await pdSuTestService.add({ bid, brid, data: pdSu })
            const diffQty = 20;
            const qtyToAdjust = pdSu.ohQty - diffQty;
            const decreaseQty = jest.spyOn(pdSuTestService.pdStorageService, 'decreaseQty').mockImplementation( () => null );
            const res = await pdSuTestService.adjustQty({ bid, brid, pdSuId: pdSu.pdSuId, qty: qtyToAdjust, bubble: true })
            expect(res).toEqual({
                "lastQty": pdSu.ohQty,
                "newQty": qtyToAdjust,
                "pdSuId": pdSu.pdSuId,
            })
            expect(decreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdSu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": diffQty,
                "sharedClient": undefined,
            })
            decreaseQty.mockReset();
            pdSu = await pdSuTestService.getById(bid, { id: pdSu.pdSuId })
            expect(pdSu.ohQty).toEqual(5)
        })
        it('#1.1 Transfer Qty', async () => {
            let srcPdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _srcWhSu.whSuId,
                ohQty: 100,
                allocatedQty: 0,
            }
            srcPdSu = await pdSuTestService.add({ bid, brid, data: srcPdSu })
            let dstPdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _dstWhSu.whSuId,
                ohQty: 20,
                allocatedQty: 0,
            }
            dstPdSu = await pdSuTestService.add({ bid, brid, data: dstPdSu })
            const qtyToTransfer = 10;
            const res = await pdSuTestService.transferQty({ bid, brid, srcPdSuId: srcPdSu.pdSuId, dstPdSuId: dstPdSu.pdSuId, qty: qtyToTransfer, bubble: false })
            expect(res).toEqual({
                src: {
                    "lastQty": srcPdSu.ohQty,
                    "newQty": srcPdSu.ohQty - qtyToTransfer,
                    "pdSuId": srcPdSu.pdSuId,
                },
                dst: {
                    "lastQty": dstPdSu.ohQty,
                    "newQty": dstPdSu.ohQty + qtyToTransfer,
                    "pdSuId": dstPdSu.pdSuId,
                }
            })
        })
        it('#1.1 Transfer Qty to storage with lot', async () => {
            let pd: Pd = {
                pdId: pdSuTestService.service.generateId(),
                pdNo: 'PD',
                pdName: 'PD-NAME',
                useLot: true
            }
            pd = await pdService.add({ bid, brid, data: pd })
            let pdLot: PdLot = {
                pdLotId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                lotNo: 'LOT-1',

            }
            pdLot = await pdLotService.add({ bid, brid, data: pdLot})
            let pdStorage: PdStorage = {
                pdStorageId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                whStorageId: _whStorage.whStorageId,
                ohQty: 100,
            }
            pdStorage = await pdStorageService.add({ bid, brid, data: pdStorage })
            let pdLotStorage: PdLotStorage = {
                pdLotStorageId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                pdLotId: pdLot.pdLotId,
                pdStorageId: pdStorage.pdStorageId,
                ohQty: 100,
            }
            pdLotStorage = await pdLotStorageService.add({ bid, brid, data: pdLotStorage })
            let dstWhStorage: WhStorage = {
                whStorageId: pdSuTestService.service.generateId(),
                storageNo: 'S-1',
                storageName: 'Warehouse 1 Storage 1',
                whId: _wh.whId
            }
            dstWhStorage = await whStorageService.add({ bid, brid, data: dstWhStorage })
            let dstPdStorage: PdStorage = {
                pdStorageId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                whStorageId: dstWhStorage.whStorageId,
                ohQty: 100,
            }
            dstPdStorage = await pdStorageService.add({ bid, brid, data: dstPdStorage })
            let dstPdLotStorage: PdLotStorage = {
                pdLotStorageId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                pdLotId: pdLot.pdLotId,
                pdStorageId: dstPdStorage.pdStorageId,
                ohQty: 100,
            }
            dstPdLotStorage = await pdLotStorageService.add({ bid, brid, data: dstPdLotStorage })
            let whSu: WhSu = {
                whSuId: pdSuTestService.service.generateId(),
                suNo: 'SU-1',
                whId: _whStorage.whId,
                whStorageId: _whStorage.whStorageId
            }
            whSu = await whSuService.add({ bid, brid, data: whSu})
            let srcPdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                whSuId: whSu.whSuId,
                pdLotId: pdLot.pdLotId,
                ohQty: 100,
                allocatedQty: 0,
            }
            srcPdSu = await pdSuTestService.add({ bid, brid, data: srcPdSu })
            const lotIncreaseQty = jest.spyOn(pdSuTestService.pdLotStorageService, 'increaseQty').mockImplementation( () => null );
            const res = await pdSuTestService.transferToStorage({ bid, brid, pdId: srcPdSu.pdId, pdLotId: srcPdSu.pdLotId, srcWhSuId: srcPdSu.whSuId, dstWhStorageId: dstWhStorage.whStorageId, transferQty: 10 })
            expect(lotIncreaseQty).toBeCalledWith({
                "pdLotStorageId": dstPdLotStorage.pdLotStorageId,
                "qty": 10,
                "bid": bid,
                "brid": brid,
                "sharedClient": undefined,
            })
            const after = await pdSuTestService.getById(bid, { id: srcPdSu.pdSuId })
            expect(after.ohQty).toEqual(90)
        })
        it('#1.1 Transfer Qty to storage without lot', async () => {
            let pd: Pd = {
                pdId: pdSuTestService.service.generateId(),
                pdNo: 'PD',
                pdName: 'PD-NAME',
            }
            pd = await pdService.add({ bid, brid, data: pd })
            let pdStorage: PdStorage = {
                pdStorageId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                whStorageId: _whStorage.whStorageId,
                ohQty: 100,
            }
            pdStorage = await pdStorageService.add({ bid, brid, data: pdStorage })
            let dstWhStorage: WhStorage = {
                whStorageId: pdSuTestService.service.generateId(),
                storageNo: 'S-1',
                storageName: 'Warehouse 1 Storage 1',
                whId: _wh.whId
            }
            dstWhStorage = await whStorageService.add({ bid, brid, data: dstWhStorage })
            let dstPdStorage: PdStorage = {
                pdStorageId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                whStorageId: dstWhStorage.whStorageId,
                ohQty: 100,
            }
            dstPdStorage = await pdStorageService.add({ bid, brid, data: dstPdStorage })
            let whSu: WhSu = {
                whSuId: pdSuTestService.service.generateId(),
                suNo: 'SU-1',
                whId: _whStorage.whId,
                whStorageId: _whStorage.whStorageId
            }
            whSu = await whSuService.add({ bid, brid, data: whSu})
            let srcPdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                whSuId: whSu.whSuId,
                ohQty: 100,
                allocatedQty: 0,
            }
            srcPdSu = await pdSuTestService.add({ bid, brid, data: srcPdSu })
            const storageIncreaseQty = jest.spyOn(pdSuTestService.pdStorageService, 'increaseQty').mockImplementation( () => null );
            const res = await pdSuTestService.transferToStorage({ bid, brid, pdId: srcPdSu.pdId, srcWhSuId: srcPdSu.whSuId, dstWhStorageId: dstWhStorage.whStorageId, transferQty: 10 })
            expect(storageIncreaseQty).toBeCalledWith({
                "pdStorageId": dstPdStorage.pdStorageId,
                "qty": 10,
                "bid": bid,
                "brid": brid,
                "sharedClient": undefined,
            })
            const afterSu = await pdSuTestService.getById(bid, { id: srcPdSu.pdSuId })
            expect(afterSu.ohQty).toEqual(90)
        })
        it('#1.1 Dump Qty to storage', async () => {
            let pd: Pd = {
                pdId: pdSuTestService.service.generateId(),
                pdNo: 'PD',
                pdName: 'PD-NAME',
                useLot: true
            }
            pd = await pdService.add({ bid, brid, data: pd })
            let pdLot: PdLot = {
                pdLotId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                lotNo: 'LOT-1',
            }
            pdLot = await pdLotService.add({ bid, brid, data: pdLot})
            let pdStorage: PdStorage = {
                pdStorageId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                whStorageId: _whStorage.whStorageId,
                ohQty: 100,
            }
            pdStorage = await pdStorageService.add({ bid, brid, data: pdStorage })
            let pdLotStorage: PdLotStorage = {
                pdLotStorageId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                pdLotId: pdLot.pdLotId,
                pdStorageId: pdStorage.pdStorageId,
                ohQty: 100,
            }
            pdLotStorage = await pdLotStorageService.add({ bid, brid, data: pdLotStorage })
            let dstWhStorage: WhStorage = {
                whStorageId: pdSuTestService.service.generateId(),
                storageNo: 'S-1',
                storageName: 'Warehouse 1 Storage 1',
                whId: _wh.whId
            }
            dstWhStorage = await whStorageService.add({ bid, brid, data: dstWhStorage })
            let dstPdStorage: PdStorage = {
                pdStorageId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                whStorageId: dstWhStorage.whStorageId,
                ohQty: 100,
            }
            dstPdStorage = await pdStorageService.add({ bid, brid, data: dstPdStorage })
            let dstPdLotStorage: PdLotStorage = {
                pdLotStorageId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                pdLotId: pdLot.pdLotId,
                pdStorageId: dstPdStorage.pdStorageId,
                ohQty: 100,
            }
            dstPdLotStorage = await pdLotStorageService.add({ bid, brid, data: dstPdLotStorage })
            let whSu: WhSu = {
                whSuId: pdSuTestService.service.generateId(),
                suNo: 'SU-1',
                whId: _whStorage.whId,
                whStorageId: _whStorage.whStorageId
            }
            whSu = await whSuService.add({ bid, brid, data: whSu})
            let srcPdSu: PdSu = {
                pdSuId: pdSuTestService.service.generateId(),
                pdId: pd.pdId,
                whSuId: whSu.whSuId,
                pdLotId: pdLot.pdLotId,
                ohQty: 100,
                allocatedQty: 0,
            }
            srcPdSu = await pdSuTestService.add({ bid, brid, data: srcPdSu })
            const lotIncreaseQty = jest.spyOn(pdSuTestService.pdLotStorageService, 'increaseQty').mockImplementation( () => null );
            const res = await pdSuTestService.dumpToStorage({ bid, brid, srcWhSuId: srcPdSu.whSuId, dstWhStorageId: dstWhStorage.whStorageId })
            expect(lotIncreaseQty).toBeCalledWith({
                "pdLotStorageId": dstPdLotStorage.pdLotStorageId,
                "qty": 100,
                "bid": bid,
                "brid": brid,
                "sharedClient": undefined,
            })
            const after = await pdSuTestService.getById(bid, { id: srcPdSu.pdSuId })
            expect(after.ohQty).toEqual(0)
        })
        it('#1.1 Dump Qty to su', async () => {
            const srcWhSu = _whSus[3];
            const dstWhSu = _whSus[4];
            let srcPdSuArray: PdSu[] = [
                { pdSuId: pdSuTestService.service.generateId(), pdId: _pds[4].pdId, whSuId: srcWhSu.whSuId, ohQty: 80},
                { pdSuId: pdSuTestService.service.generateId(), pdId: _pds[5].pdId, whSuId: srcWhSu.whSuId, ohQty: 70},
                { pdSuId: pdSuTestService.service.generateId(), pdId: _pds[6].pdId, whSuId: srcWhSu.whSuId, ohQty: 20}
            ]
            srcPdSuArray = await pdSuTestService.addList({ bid, brid, data: srcPdSuArray, batch: true})
            const res = await pdSuTestService.dumpToSu({ bid, brid, srcWhSuId: srcWhSu.whSuId, dstWhSuId: dstWhSu.whSuId })
            const afterSrc = await pdSuTestService.get({ bid, brid, filter: { whSuId: srcWhSu.whSuId }})
            const afterDst = await pdSuTestService.get({ bid, brid, filter: { whSuId: dstWhSu.whSuId }})
            const afterMap = keyBy(afterDst, 'pdId')
            expect(afterSrc[0].ohQty).toEqual(0)
            expect(afterSrc[1].ohQty).toEqual(0)
            expect(afterSrc[2].ohQty).toEqual(0)
            expect(afterMap[afterSrc[0].pdId].ohQty).toEqual(80)
            expect(afterMap[afterSrc[1].pdId].ohQty).toEqual(70)
            expect(afterMap[afterSrc[2].pdId].ohQty).toEqual(20)
        })
        describe('#1.1 Children test', () => {
            let pds: Pd[];
            let wh: Wh;
            let pdWh: PdWh;
            let parentWhSu: WhSu;
            let parentPdSus: PdSu[];
            let whSuChildren: WhSu[];
            let pdSuChildren: PdSu[];
            let pdStorages: PdStorage[];
            beforeAll( async () => {
                wh = _wh;
                pds = _pds.slice(0,4)
                pdWh = _pdWh;
                parentWhSu = {
                    whSuId: pdSuTestService.service.generateId(),
                    whId: wh.whId,
                    whStorageId: _whStorage.whStorageId,
                    suNo: 'P1'
                }
                parentPdSus = [
                    { pdSuId: pdSuTestService.service.generateId(), pdId: pds[0].pdId, whSuId: parentWhSu.whSuId, ohQty: 20, allocatedQty: 0 },
                    { pdSuId: pdSuTestService.service.generateId(), pdId: pds[1].pdId, whSuId: parentWhSu.whSuId, ohQty: 20, allocatedQty: 0 },
                    { pdSuId: pdSuTestService.service.generateId(), pdId: pds[2].pdId, whSuId: parentWhSu.whSuId, ohQty: 20, allocatedQty: 0 },
                    { pdSuId: pdSuTestService.service.generateId(), pdId: pds[3].pdId, whSuId: parentWhSu.whSuId, ohQty: 20, allocatedQty: 0 },
                ]
                whSuChildren = [
                    { whSuId: pdSuTestService.service.generateId(), whId: wh.whId, suNo: 'C1', parentSuId: parentWhSu.whSuId },
                    { whSuId: pdSuTestService.service.generateId(), whId: wh.whId, suNo: 'C2', parentSuId: parentWhSu.whSuId },
                    { whSuId: pdSuTestService.service.generateId(), whId: wh.whId, suNo: 'C3', parentSuId: parentWhSu.whSuId },
                    { whSuId: pdSuTestService.service.generateId(), whId: wh.whId, suNo: 'C4', parentSuId: parentWhSu.whSuId },
                ]
                pdSuChildren = [
                    { pdSuId: pdSuTestService.service.generateId(), pdId: pds[0].pdId, whSuId: whSuChildren[0].whSuId, ohQty: 20, allocatedQty: 0 },
                    { pdSuId: pdSuTestService.service.generateId(), pdId: pds[1].pdId, whSuId: whSuChildren[1].whSuId, ohQty: 20, allocatedQty: 0 },
                    { pdSuId: pdSuTestService.service.generateId(), pdId: pds[2].pdId, whSuId: whSuChildren[2].whSuId, ohQty: 20, allocatedQty: 0 },
                    { pdSuId: pdSuTestService.service.generateId(), pdId: pds[3].pdId, whSuId: whSuChildren[3].whSuId, ohQty: 20, allocatedQty: 0 },
                ]

                parentWhSu = await whSuService.add({ bid, brid, data: parentWhSu })
                parentPdSus = await pdSuService.addList({ bid, brid, data: parentPdSus, batch: true})

                whSuChildren = await whSuService.addList({ bid, brid, data: whSuChildren, batch: true})
                pdSuChildren = await pdSuService.addList({ bid, brid, data: pdSuChildren, batch: true})

            })
            it('#1.1 Increase qty', async () => {
                const bfC0 = await pdSuTestService.getById(bid, { id: pdSuChildren[0].pdSuId })
                const bfC0p = await pdSuTestService.getById(bid, { id: pdSuChildren[0].parentId })

                const storageIncreaseQty = jest.spyOn(pdSuTestService.pdStorageService, 'increaseQty').mockImplementation( () => null );

                const resC0 = await pdSuTestService.increaseQty({ bid, brid, pdSuId: pdSuChildren[0].pdSuId, qty: 10 });

                expect(storageIncreaseQty).toBeCalledWith({
                    "bid": bid,
                    "brid": brid,
                    "pdStorageId": parentPdSus[0].pdStorageId ,
                    "bubble": undefined,
                    "preloaded": undefined,
                    "qty": 10,
                    "sharedClient": undefined,
                })

                const afC0 = await pdSuTestService.getById(bid, { id: pdSuChildren[0].pdSuId })
                const afC0p = await pdSuTestService.getById(bid, { id: pdSuChildren[0].parentId })

                expect(afC0.ohQty).toEqual(bfC0.ohQty + 10)
                expect(afC0p.ohQty).toEqual(bfC0p.ohQty + 10)
            })
            it('#1.1 Decrease qty', async () => {
                const bfC0 = await pdSuTestService.getById(bid, { id: pdSuChildren[0].pdSuId })
                const bfC0p = await pdSuTestService.getById(bid, { id: pdSuChildren[0].parentId })

                const storageDecreaseQty = jest.spyOn(pdSuTestService.pdStorageService, 'decreaseQty').mockImplementation( () => null );

                const resC0 = await pdSuTestService.decreaseQty({ bid, brid, pdSuId: pdSuChildren[0].pdSuId, qty: 10 });

                expect(storageDecreaseQty).toBeCalledWith({
                    "bid": bid,
                    "brid": brid,
                    "pdStorageId": parentPdSus[0].pdStorageId ,
                    "bubble": undefined,
                    "preloaded": undefined,
                    "qty": 10,
                    "sharedClient": undefined,
                })

                const afC0 = await pdSuTestService.getById(bid, { id: pdSuChildren[0].pdSuId })
                const afC0p = await pdSuTestService.getById(bid, { id: pdSuChildren[0].parentId })

                expect(afC0.ohQty).toEqual(bfC0.ohQty - 10)
                expect(afC0p.ohQty).toEqual(bfC0p.ohQty - 10)
            })
        })
    })

});