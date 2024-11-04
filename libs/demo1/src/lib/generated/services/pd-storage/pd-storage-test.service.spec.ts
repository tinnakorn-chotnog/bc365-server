import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_STORAGE_PROVIDER } from './pd-storage.provider';
import { PdStorageTestService } from './pd-storage-test.service'
import { BIZ_PROVIDER, BizExtService } from '../biz';
import { PD_STORAGE_BAL_PROVIDER } from '../pd-storage-bal';
import { PD_LOT_STORAGE_PROVIDER, PdLotStorageExtService } from '../pd-lot-storage';
import { INV_TRN_PROVIDER } from '../inv-trn';
import { PD_WH_PROVIDER, PdWhExtService } from '../pd-wh';
import { PD_HU_PROVIDER } from '../pd-hu';
import { PD_SU_PROVIDER, PdSuExtService } from '../pd-su';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { Biz } from '../../interfaces/biz.model';
import { Branch } from '../../interfaces/branch.model';
import { PdBranch } from '../../interfaces/pd-branch.model';
import { PdLotStorage } from '../../interfaces/pd-lot-storage.model';
import { PdLot } from '../../interfaces/pd-lot.model';
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
import { PD_BRANCH_PROVIDER, PdBranchExtService } from '../pd-branch';
import { PD_LOT_PROVIDER, PdLotExtService } from '../pd-lot';
import { PdExtService } from '../pd/pd-ext.service';
import { WH_PROVIDER, WhExtService } from '../wh';
import { WH_AISLE_PROVIDER, WhAisleExtService } from '../wh-aisle';
import { WH_RACK_PROVIDER, WhRackExtService } from '../wh-rack';
import { WH_SHELF_PROVIDER, WhShelfExtService } from '../wh-shelf';
import { WH_STORAGE_PROVIDER, WhStorageExtService } from '../wh-storage';
import { WH_ZONE_PROVIDER, WhZoneExtService } from '../wh-zone';
import { PdStorageExtService } from './pd-storage-ext.service';
import { PD_PROVIDER } from '../pd/pd.provider';
import { PdAllocationInfo } from '../../interfaces/pd-allocation-info.model';
import { groupBy } from 'lodash';
import { PdAvailableByAisleReturnType, PdAvailableByRackReturnType, PdAvailableByShelfReturnType, PdAvailableByZoneReturnType } from './pd-storage.interface';
import { PdSu } from '../../interfaces/pd-su.model';
import { WhSu } from '../../interfaces/wh-su.model';
import { WH_SU_PROVIDER, WhSuExtService } from '../wh-su';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PD_STORAGE', () => {
    let poolService: PostgresPoolService;
    let pdStorageTestService: PdStorageTestService

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
    let _srcStorage: PdStorage;
    let _dstStorage: PdStorage;
    let _pdSus: PdSu[];
    let _pdSu: PdSu;

    let _srcSu: WhSu;
    let _dstSu: WhSu;

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
				...PD_STORAGE_BAL_PROVIDER,
				...PD_LOT_STORAGE_PROVIDER,
				...INV_TRN_PROVIDER,
				...PD_WH_PROVIDER,
				...PD_HU_PROVIDER,
				...PD_SU_PROVIDER,
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
                ...PD_LOT_PROVIDER,
                ...INV_TRN_PROVIDER,
                ...PD_LOT_STORAGE_PROVIDER,
                ...PD_STORAGE_PROVIDER,
                PdStorageTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdStorageTestService = app.get<PdStorageTestService>(PdStorageTestService);
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
        pdSuService = app.get<PdSuExtService>(PdSuExtService);

        _biz = {
            bizId: pdStorageTestService.service.generateId(),
            bizNo: 'BIZ-01',
            bizName: 'BIZ-NAME-01'
        }

        bid = _biz.bizId;

        _branch = {
            branchId: pdStorageTestService.service.generateId(),
            branchNo: 'B01',
            branchName: 'BRANCH 01',
            bizId: bid
        }

        brid = _branch.branchId;

        _whs = [
            {
                whId: pdStorageTestService.service.generateId(),
                whNo: 'WH-01',
                whName: 'WH-NAME-01',
                bizId: bid,
                branchId: brid
            },
            {
                whId: pdStorageTestService.service.generateId(),
                whNo: 'WH-02',
                whName: 'WH-NAME-02',
                bizId: bid,
                branchId: brid
            },
            {
                whId: pdStorageTestService.service.generateId(),
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
                    whZoneId: pdStorageTestService.service.generateId(),
                    whZoneNo: sufix,
                    whZoneName: 'ZONE-' + sufix,
                    bizId: bid,
                    branchId: brid,
                    whId: wh.whId
                }
                _whZones.push(whZone);
                // One Aisle one rack
                const whAisle: WhAisle = {
                    whAisleId: pdStorageTestService.service.generateId(),
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
                    whRackId: pdStorageTestService.service.generateId(),
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
                    whShelfId: pdStorageTestService.service.generateId(),
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
                        whStorageId: pdStorageTestService.service.generateId(),
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
                    whSuId: pdStorageTestService.service.generateId(),
                    suNo: wh.whNo + '-' + s,
                    whId: wh.whId
                }
                _whSus.push(whSu);
            })
        })

        bid = _biz.bizId;
        brid = _branch.branchId;

        _whSus = [];

        _whSu = {
            whSuId: pdStorageTestService.service.generateId(),
            suNo: 'SU-01',
            whId: _wh.whId,
            bizId: bid,
            branchId: brid        }

        _srcSu = {
            whSuId: pdStorageTestService.service.generateId(),
            suNo: 'SRC-SU-01',
            whId: _wh.whId,
            bizId: bid,
            branchId: brid        }

        _dstSu = {
            whSuId: pdStorageTestService.service.generateId(),
            suNo: 'DST-SU-01',
            whId: _wh.whId,
            bizId: bid,
            branchId: brid
        }

        _whSus.push(_whSu, _srcSu, _dstSu)

        _pds = _whStorages.map( ws => {
            const pd: Pd = {
                pdId: pdStorageTestService.service.generateId(),
                pdNo: 'P' + pdIdx.toString().padStart(3, '0'),
                pdName: 'P-NAME-' + pdIdx.toString().padStart(3, '0'),
                ohQty: 0,
                allocatedQty: 0,
                useLot: false,
                bizId: bid,
            }
            return pd;
        })

        _pd = _pds[0]

        _pdBranches = [];

        _pds.forEach( pd => {
            const o: PdBranch =  {
                pdBranchId: pdStorageTestService.service.generateId(),
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
                    pdWhId: pdStorageTestService.service.generateId(),
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
                    pdStorageId: pdStorageTestService.service.generateId(),
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

        _pds.forEach( pd => {
            _whSus.forEach( su => {
                const o: PdSu = {
                    pdSuId: pdStorageTestService.service.generateId(),
                    pdId: pd.pdId,
                    whId: su.whId,
                    whSuId: su.whSuId,
                    ohQty: 10,
                    allocatedQty: 0,
                    bizId: bid,
                    branchId: brid
                }
                _pdSus.push(o)
            })
        })

        _pdSu = _pdSus[0]

        bid = _biz.bizId;
        brid = _branch.branchId;

        _srcStorage = {
            pdStorageId: pdStorageTestService.service.generateId(),
            pdId: _pd.pdId,
            whStorageId: _whStorages[0].whStorageId,
            ohQty: 0,
            allocatedQty: 0
        }

        _dstStorage = {
            pdStorageId: pdStorageTestService.service.generateId(),
            pdId: _pd.pdId,
            whStorageId: _whStorages[1].whStorageId,
            ohQty: 0,
            allocatedQty: 0
        }

        _pdStorages.push(_srcStorage)
        _pdStorages.push(_dstStorage)


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
        _pdSus = await pdSuService.addList({ bid, brid, data: _pdSus, batch: true})


    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_STORAGE <test case group description>', () => {
        it('#1.1 Before insert', async () => {
            const after = await pdStorageTestService.beforeInsert({ bid, brid, data: _pdStorage })
            expect(after.refPdNo).not.toBeNull();
            expect(after.refPdName).not.toBeNull();
            expect(after.refStorageNo).not.toBeNull();
        })
        it('#1.1 Allocate without quantity', async () => {
            const before = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            await pdStorageTestService.update({ bid, brid, data: { pdLotStorageId: before.pdStorageId, ohQty: 0, allocatedQty: 0 } })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdStorageTestService.allocateQty({ bid, brid, pdStorageId: before.pdStorageId, qty: qtyToAllocate, bubble: true })
            }).rejects.toThrow('No quantity for allocation.')
        })
        it('#1.1 Allocate with not enough quantity', async () => {
            const before = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            await pdStorageTestService.update({ bid, brid, data: { pdStorageId: before.pdStorageId, ohQty: 4, allocatedQty: 0 } })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdStorageTestService.allocateQty({ bid, brid, pdStorageId: before.pdStorageId, qty: qtyToAllocate, bubble: true })
            }).rejects.toThrow('Quantity can allocate 4 of 5. current on-hand: 4, current allocated: 0')
        })
        it('#1.1 Allocate Qty', async () => {
            let before = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            before = await pdStorageTestService.update({ bid, brid, data: { pdStorageId: before.pdStorageId, ohQty: 10, allocatedQty: 0 } })
            const oldAllocatedQty = before.allocatedQty;
            const qtyToAllocate = 5;
            const deallocateQty = jest.spyOn(pdStorageTestService.pdWhService, 'allocateQty').mockImplementation(() => null);
            let res = await pdStorageTestService.allocateQty({ bid, brid, pdStorageId: before.pdStorageId, qty: qtyToAllocate, bubble: true })
            expect(res).toEqual({
                "pdBranchId": before.pdBranchId,
                "pdWhId": before.pdWhId,
                "whStorageId": before.whStorageId,
                "lastAllocatedQty": before.allocatedQty || 0,
                "allocatedQty": oldAllocatedQty + qtyToAllocate,
                "pdStorageId": before.pdStorageId,
            })
            expect(deallocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdWhId": before.pdWhId,
                "preloaded": undefined,
                "qty": qtyToAllocate,
                "sharedClient": undefined,
            })
            deallocateQty.mockReset();
            const after = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            expect(after.allocatedQty).toEqual(before.allocatedQty + qtyToAllocate)
        })
        it('#1.1 Deallocate Qty', async () => {
            let before = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            const oldAllocatedQty = before.allocatedQty;
            const qtyToDeallocate = 5;
            const deallocateQty = jest.spyOn(pdStorageTestService.pdWhService, 'deallocateQty').mockImplementation(() => null);
            let res = await pdStorageTestService.deallocateQty({ bid, brid, pdStorageId: before.pdStorageId, qty: qtyToDeallocate, bubble: true })
            expect(res).toEqual({
                "pdBranchId": before.pdBranchId,
                "pdWhId": before.pdWhId,
                "whStorageId": before.whStorageId,
                "lastAllocatedQty": before.allocatedQty,
                "allocatedQty": oldAllocatedQty - qtyToDeallocate,
                "pdStorageId": before.pdStorageId,
            })
            expect(deallocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdWhId": before.pdWhId,
                "preloaded": undefined,
                "qty": qtyToDeallocate,
                "sharedClient": undefined,
            })
            deallocateQty.mockReset();
            const after = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            expect(after.allocation).toEqual([])
            expect(after.allocatedQty).toEqual(0)
        })
        it('#1.1 Increase Qty', async () => {
            const before = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            const qtyToIncrease = 5;
            const increaseQty = jest.spyOn(pdStorageTestService.pdWhService, 'increaseQty').mockImplementation(() => null);
            const res = await pdStorageTestService.increaseQty({ bid, brid, pdStorageId: before.pdStorageId, qty: qtyToIncrease, bubble: true })
            expect(res).toEqual({
                "pdBranchId": before.pdBranchId,
                "pdWhId": before.pdWhId,
                "whStorageId": before.whStorageId,
                "lastQty": before.ohQty,
                "newQty": before.ohQty + qtyToIncrease,
                "pdStorageId": before.pdStorageId,
                "refStorageNo": before.refStorageNo,
            })
            expect(increaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdWhId": before.pdWhId,
                "preloaded": undefined,
                "qty": qtyToIncrease,
                "sharedClient": undefined,
            })
            increaseQty.mockReset();
            const after = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            expect(after.ohQty).toEqual(before.ohQty + qtyToIncrease)
        })
        it('#1.1 Decrease Qty', async () => {
            let before = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            before = await pdStorageTestService.update({ bid, brid, data: { pdStorageId: before.pdStorageId, ohQty: 10, allocatedQty: 0 } })
            const qtyToDecrease = 5;
            const decreaseQty = jest.spyOn(pdStorageTestService.pdWhService, 'decreaseQty').mockImplementation(() => null);
            const res = await pdStorageTestService.decreaseQty({ bid, brid, pdStorageId: before.pdStorageId, qty: qtyToDecrease, bubble: true })
            expect(res).toEqual({
                "pdBranchId": before.pdBranchId,
                "pdWhId": before.pdWhId,
                "whStorageId": before.whStorageId,
                "lastQty": before.ohQty,
                "newQty": before.ohQty - qtyToDecrease,
                "pdStorageId": before.pdStorageId,
                "refStorageNo": before.refStorageNo,
            })
            expect(decreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdWhId": before.pdWhId,
                "preloaded": undefined,
                "qty": qtyToDecrease,
                "sharedClient": undefined,
            })

            decreaseQty.mockReset();
            let after = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            expect(after.ohQty).toEqual(before.ohQty - qtyToDecrease);
        })
        it('#1.1 Adjust Qty Increase', async () => {
            let before = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            before = await pdStorageTestService.update({ bid, brid, data: { pdStorageId: before.pdStorageId, ohQty: 20, allocatedQty: 0 } })
            const diffQty = 10;
            const qtyToAdjust = before.ohQty + diffQty;
            const increaseQty = jest.spyOn(pdStorageTestService.pdWhService, 'increaseQty').mockImplementation(() => null);
            const res = await pdStorageTestService.adjustQty({ bid, brid, pdStorageId: before.pdStorageId, qty: qtyToAdjust, bubble: true })
            expect(res).toEqual({
                "pdBranchId": before.pdBranchId,
                "pdWhId": before.pdWhId,
                "whStorageId": before.whStorageId,
                "lastQty": before.ohQty,
                "newQty": qtyToAdjust,
                "pdStorageId": before.pdStorageId,
                "refStorageNo": before.refStorageNo,
            })
            expect(increaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdWhId": before.pdWhId,
                "preloaded": undefined,
                "qty": diffQty,
                "sharedClient": undefined,
            })
            increaseQty.mockReset();
            let after = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            expect(after.ohQty).toEqual(qtyToAdjust);
        })
        it('#1.1 Adjust Qty Decrease', async () => {
            let before = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            before = await pdStorageTestService.update({ bid, brid, data: { pdStorageId: before.pdStorageId, ohQty: 30, allocatedQty: 0 } })
            const diffQty = 20;
            const qtyToAdjust = before.ohQty - diffQty;
            const decreaseQty = jest.spyOn(pdStorageTestService.pdWhService, 'decreaseQty').mockImplementation(() => null);
            const res = await pdStorageTestService.adjustQty({ bid, brid, pdStorageId: before.pdStorageId, qty: qtyToAdjust, bubble: true })
            expect(res).toEqual({
                "pdBranchId": before.pdBranchId,
                "pdWhId": before.pdWhId,
                "whStorageId": before.whStorageId,
                "lastQty": before.ohQty,
                "newQty": qtyToAdjust,
                "pdStorageId": before.pdStorageId,
                "refStorageNo": before.refStorageNo,
            })
            expect(decreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdWhId": before.pdWhId,
                "preloaded": undefined,
                "qty": diffQty,
                "sharedClient": undefined,
            })

            decreaseQty.mockReset();
            let after = await pdStorageTestService.getById(bid, { id: _pdStorage.pdStorageId })
            expect(after.ohQty).toEqual(qtyToAdjust);
        })

        it('#1.1 Available by shelf', async () => {
            const avail = await pdStorageTestService.pdAvailableByShelf({ bid, brid, whShelfId: _whShelf.whShelfId, pdId: _pd.pdId}) as PdAvailableByShelfReturnType
            expect(avail.availQty).toEqual(30)
        });
        it('#1.1 Available by rack', async () => {
            const avail = await pdStorageTestService.pdAvailableByRack({ bid, brid, whRackId: _whRack.whRackId, pdId: _pd.pdId}) as PdAvailableByRackReturnType
            expect(avail.availQty).toEqual(30)
        });
        it('#1.1 Available by aisle', async () => {
            const avail = await pdStorageTestService.pdAvailableByAisle({ bid, brid, whAisleId: _whAisle.whAisleId, pdId: _pd.pdId}) as PdAvailableByAisleReturnType
            expect(avail.availQty).toEqual(30)
        });
        it('#1.1 Available by zone', async () => {
            const avail = await pdStorageTestService.pdAvailableByZone({ bid, brid, whZoneId: _whZone.whZoneId, pdId: _pd.pdId}) as PdAvailableByZoneReturnType
            expect(avail.availQty).toEqual(30)
        });
        it('#1.1 Tranfer Qty', async () => {
            await pdStorageTestService.update({ bid, brid, data: { pdStorageId: _srcStorage.pdStorageId, ohQty: 100, allocatedQty: 0 } })
            const beforeSrc = await pdStorageTestService.getById(bid, { id: _srcStorage.pdStorageId })
            const beforeDst = await pdStorageTestService.getById(bid, { id: _dstStorage.pdStorageId })
            const qtyToTransfer = 10;
            const res = await pdStorageTestService.transferQty({ bid, brid, srcPdStorageId: beforeSrc.pdStorageId, dstPdStorageId: beforeDst.pdStorageId, qty: qtyToTransfer })
            expect(res).toEqual({
                src: {
                    "pdBranchId": beforeSrc.pdBranchId,
                    "pdWhId": beforeSrc.pdWhId,
                    "whStorageId": beforeSrc.whStorageId,
                    "lastQty": beforeSrc.ohQty,
                    "newQty": beforeSrc.ohQty - qtyToTransfer,
                    "pdStorageId": beforeSrc.pdStorageId,
                    "refStorageNo": beforeSrc.refStorageNo,
                },
                dst: {
                    "pdBranchId": beforeDst.pdBranchId,
                    "pdWhId": beforeDst.pdWhId,
                    "whStorageId": beforeDst.whStorageId,
                    "lastQty": beforeDst.ohQty,
                    "newQty": beforeDst.ohQty + qtyToTransfer,
                    "pdStorageId": beforeDst.pdStorageId,
                    "refStorageNo": beforeDst.refStorageNo,
                }
            })
            const afterSrc = await pdStorageTestService.getById(bid, { id: _srcStorage.pdStorageId })
            const afterDst = await pdStorageTestService.getById(bid, { id: _dstStorage.pdStorageId })
            expect(afterSrc.ohQty).toEqual(beforeSrc.ohQty - qtyToTransfer)
            expect(afterDst.ohQty).toEqual(beforeDst.ohQty + qtyToTransfer)
        })
        it('#3.1 Transfer product from storage to su.', async () => {
            const pd = _pd;
            let _newSu: WhSu = {
                whSuId: pdStorageTestService.service.generateId(),
                suNo: 'DST SU',
                whId: _wh.whId
            }
            _newSu = await whSuService.add({ bid, brid, data: _newSu})
            let _newPdSu: PdSu = {
                pdSuId: pdStorageTestService.service.generateId(),
                pdId: _pd.pdId,
                whSuId: _newSu.whSuId
            }
            _newPdSu = await pdSuService.add({ bid, brid, data: _newPdSu })
            let _newStorage: WhStorage = {
                whStorageId: pdStorageTestService.service.generateId(),
                storageNo: 'SRC-01',
                storageName: 'SRC STORAGE',
                whId: _wh.whId
            }
            _newStorage = await whStorageService.add({ bid, brid, data: _newStorage})
            let _newPdStorage: PdStorage = {
                pdStorageId: pdStorageTestService.service.generateId(),
                pdId: _pd.pdId,
                whStorageId: _newStorage.whStorageId,
                ohQty: 100,
                allocatedQty: 0
            }
            _newPdStorage = await pdStorageService.add({ bid, brid, data: _newPdStorage})

            const increaseQty = jest.spyOn(pdStorageTestService.pdSuService, 'increaseQty').mockImplementation( () => null );

            await pdStorageTestService.transferToSu({ bid, brid, pdId: _pd.pdId, srcWhStorageId: _newStorage.whStorageId, dstWhSuId: _newSu.whSuId, transferQty: 1})
            expect(increaseQty).toBeCalledWith({
                bid: bid,
                brid: brid,
                pdSuId: _newPdSu.pdSuId,
                preloaded: {
                    pdSuMap: {
                       [_newPdSu.pdSuId]: _newPdSu
                    },
                },
                qty: 1,
                sharedClient: undefined,
            })
        })
    })

});