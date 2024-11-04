import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_LOT_STORAGE_PROVIDER } from './pd-lot-storage.provider';
import { PdLotStorageTestService } from './pd-lot-storage-test.service'
import { BIZ_PROVIDER, BizExtService } from '../biz';
import { INV_TRN_PROVIDER } from '../inv-trn';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { BRANCH_PROVIDER, BranchExtService } from '../branch';
import { PD_BRANCH_PROVIDER, PdBranchExtService } from '../pd-branch';
import { PD_LOT_PROVIDER } from '../pd-lot/pd-lot.provider';
import { PD_STORAGE_PROVIDER, PdStorageExtService } from '../pd-storage';
import { PD_WH_PROVIDER, PdWhExtService } from '../pd-wh';
import { PD_PROVIDER } from '../pd/pd.provider';
import { WH_PROVIDER, WhExtService } from '../wh';
import { WH_AISLE_PROVIDER, WhAisleExtService } from '../wh-aisle';
import { WH_RACK_PROVIDER, WhRackExtService } from '../wh-rack';
import { WH_SHELF_PROVIDER, WhShelfExtService } from '../wh-shelf';
import { WH_STORAGE_PROVIDER, WhStorageExtService } from '../wh-storage';
import { WH_ZONE_PROVIDER, WhZoneExtService } from '../wh-zone';
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
import { PdLotExtService } from '../pd-lot/pd-lot-ext.service';
import { PdExtService } from '../pd/pd-ext.service';
import { PdLotStorageExtService } from './pd-lot-storage-ext.service';
import { PdAllocationInfo } from '../../interfaces/pd-allocation-info.model';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PD_LOT_STORAGE', () => {
    let poolService: PostgresPoolService;
    let pdLotStorageTestService: PdLotStorageTestService

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
    let pdService: PdExtService;
    let pdBranchService: PdBranchExtService;
    let pdWhService: PdWhExtService;
    let pdStorageService: PdStorageExtService;
    let pdLotService: PdLotExtService;
    let pdLotStorageService: PdLotStorageExtService;

    let _biz: Biz;
    let _branch: Branch;
    let _wh: Wh;
    let _whZone: WhZone;
    let _whAisle: WhAisle;
    let _whRack: WhRack;
    let _whShelf: WhShelf;
    let _whStorages: WhStorage[];
    let _pd: Pd;
    let _pdBranch: PdBranch;
    let _pdWh: PdWh;
    let _pdStorages: PdStorage[];
    let _pdLots: PdLot[];
    let _pdLotStorages: PdLotStorage[];

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
                ...PD_PROVIDER,
                ...PD_BRANCH_PROVIDER,
                ...PD_WH_PROVIDER,
                ...PD_STORAGE_PROVIDER,
                ...PD_LOT_PROVIDER,
                ...INV_TRN_PROVIDER,
                ...PD_LOT_STORAGE_PROVIDER,
                PdLotStorageTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdLotStorageTestService = app.get<PdLotStorageTestService>(PdLotStorageTestService);
        bizService = app.get<BizExtService>(BizExtService);
        branchService = app.get<BranchExtService>(BranchExtService);
        whService = app.get<WhExtService>(WhExtService);
        whZoneService = app.get<WhZoneExtService>(WhZoneExtService);
        whAisleService = app.get<WhAisleExtService>(WhAisleExtService);
        whRackService = app.get<WhRackExtService>(WhRackExtService);
        whShelfService = app.get<WhShelfExtService>(WhShelfExtService);
        whStorageService = app.get<WhStorageExtService>(WhStorageExtService);
        pdService = app.get<PdExtService>(PdExtService);
        pdBranchService = app.get<PdBranchExtService>(PdBranchExtService);
        pdWhService = app.get<PdWhExtService>(PdWhExtService);
        pdStorageService = app.get<PdStorageExtService>(PdStorageExtService);
        pdLotService = app.get<PdLotExtService>(PdLotExtService);
        pdLotStorageService = app.get<PdLotStorageExtService>(PdLotStorageExtService);

        _biz = {
            bizId: pdLotStorageTestService.service.generateId(),
            bizNo: 'BIZ-01',
            bizName: 'BIZ-NAME-01'
        }

        _branch = {
            branchId: pdLotStorageTestService.service.generateId(),
        }

        _wh = {
            whId: pdLotStorageTestService.service.generateId(),
            whNo: 'WH-01',
            whName: 'WH-NAME-01',
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _whZone = {
            whZoneId: pdLotStorageTestService.service.generateId(),
            whZoneNo: 'ZONE-01',
            whZoneName: 'ZONE-NAME-01',
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _whAisle = {
            whAisleId: pdLotStorageTestService.service.generateId(),
            whAisleNo: 'AISLE-01',
            whAisleName: 'AISLE-NAME-01',
            whZoneId: _whZone.whZoneId,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _whRack = {
            whRackId: pdLotStorageTestService.service.generateId(),
            whRackNo: 'RACK-01',
            whRackName: 'RACK-NAME-01',
            whZoneId: _whZone.whZoneId,
            whAisleId: _whAisle.whAisleId,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _whShelf = {
            whShelfId: pdLotStorageTestService.service.generateId(),
            whShelfNo: 'SHELF-01',
            whShelfName: 'SHELF-NAME-01',
            whZoneId: _whZone.whZoneId,
            whRackId: _whRack.whRackId,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _whStorages = [
            {
                whStorageId: pdLotStorageTestService.service.generateId(),
                whId: _wh.whId,
                storageNo: 'BIN-01',
                storageName: 'BIN-NAME-01',
                whZoneId: _whZone.whZoneId,
                whAisleId: _whAisle.whAisleId,
                whRackId: _whRack.whRackId,
                whShelfId: _whShelf.whShelfId,
                bizId: _biz.bizId,
                branchId: _branch.branchId
            },
            {
                whStorageId: pdLotStorageTestService.service.generateId(),
                whId: _wh.whId,
                storageNo: 'BIN-02',
                storageName: 'BIN-NAME-02',
                whZoneId: _whZone.whZoneId,
                whAisleId: _whAisle.whAisleId,
                whRackId: _whRack.whRackId,
                whShelfId: _whShelf.whShelfId,
                bizId: _biz.bizId,
                branchId: _branch.branchId
            }
        ]

        _pd = {
            pdId: pdLotStorageTestService.service.generateId(),
            pdNo: 'PD-0001',
            pdName: 'PD-NAME-0001',
            ohQty: 0,
            allocatedQty: 0,
            useLot: false,
            bizId: _biz.bizId,
        }

        _pdBranch = {
            pdBranchId: pdLotStorageTestService.service.generateId(),
            pdId: _pd.pdId,
            ohQty: 0,
            allocatedQty: 0,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _pdWh = {
            pdWhId: pdLotStorageTestService.service.generateId(),
            pdId: _pd.pdId,
            whId: _wh.whId,
            ohQty: 0,
            allocatedQty: 0,
            pdBranchId: _pdBranch.pdBranchId,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _pdLots = [
            {
                pdLotId: pdLotStorageTestService.service.generateId(),
                pdId: _pd.pdId,
                lotNo: 'LOT-01',
                ohQty: 0,
                allocatedQty: 0,
                bizId: _biz.bizId,
            },
            {
                pdLotId: pdLotStorageTestService.service.generateId(),
                pdId: _pd.pdId,
                lotNo: 'LOT-02',
                ohQty: 0,
                allocatedQty: 0,
                bizId: _biz.bizId,
            }
        ]

        _pdStorages = [
            {
                pdStorageId: pdLotStorageTestService.service.generateId(),
                pdId: _pd.pdId,
                whStorageId: _whStorages[0].whStorageId,
                ohQty: 0,
                allocatedQty: 0,
                whId: _wh.whId,
                pdWhId: _pdWh.pdWhId,
                pdBranchId: _pdBranch.pdBranchId,
                whZoneId: _whStorages[0].whZoneId,
                whAisleId: _whStorages[0].whAisleId,
                whRackId: _whStorages[0].whRackId,
                whShelfId: _whStorages[0].whShelfId,
                bizId: _biz.bizId,
                branchId: _branch.branchId
            },
            {
                pdStorageId: pdLotStorageTestService.service.generateId(),
                pdId: _pd.pdId,
                whStorageId: _whStorages[1].whStorageId,
                ohQty: 0,
                allocatedQty: 0,
                whId: _wh.whId,
                pdWhId: _pdWh.pdWhId,
                pdBranchId: _pdBranch.pdBranchId,
                whZoneId: _whStorages[1].whZoneId,
                whAisleId: _whStorages[1].whAisleId,
                whRackId: _whStorages[1].whRackId,
                whShelfId: _whStorages[1].whShelfId,
                bizId: _biz.bizId,
                branchId: _branch.branchId
            }
        ]

        _pdLotStorages = [
            {
                pdLotStorageId: pdLotStorageTestService.service.generateId(),
                pdId: _pd.pdId,
                pdLotId: _pdLots[0].pdLotId,
                whStorageId: _whStorages[0].whStorageId,
                pdStorageId: _pdStorages[0].pdStorageId,
                ohQty: 0,
                allocatedQty: 0,
                whZoneId: _pdStorages[0].whZoneId,
                whAisleId: _pdStorages[0].whAisleId,
                whRackId: _pdStorages[0].whRackId,
                whShelfId: _pdStorages[0].whShelfId,
                bizId: _biz.bizId,
                branchId: _branch.branchId
            },
            {
                pdLotStorageId: pdLotStorageTestService.service.generateId(),
                pdId: _pd.pdId,
                pdLotId: _pdLots[0].pdLotId,
                whStorageId: _whStorages[1].whStorageId,
                pdStorageId: _pdStorages[1].pdStorageId,
                ohQty: 0,
                allocatedQty: 0,
                whZoneId: _pdStorages[1].whZoneId,
                whAisleId: _pdStorages[1].whAisleId,
                whRackId: _pdStorages[1].whRackId,
                whShelfId: _pdStorages[1].whShelfId,
                bizId: _biz.bizId,
                branchId: _branch.branchId
            },
            {
                pdLotStorageId: pdLotStorageTestService.service.generateId(),
                pdId: _pd.pdId,
                pdLotId: _pdLots[1].pdLotId,
                whStorageId: _whStorages[0].whStorageId,
                pdStorageId: _pdStorages[0].pdStorageId,
                ohQty: 0,
                allocatedQty: 0,
                whZoneId: _pdStorages[0].whZoneId,
                whAisleId: _pdStorages[0].whAisleId,
                whRackId: _pdStorages[0].whRackId,
                whShelfId: _pdStorages[0].whShelfId,
                bizId: _biz.bizId,
                branchId: _branch.branchId
            },
            {
                pdLotStorageId: pdLotStorageTestService.service.generateId(),
                pdId: _pd.pdId,
                pdLotId: _pdLots[1].pdLotId,
                whStorageId: _whStorages[1].whStorageId,
                pdStorageId: _pdStorages[1].pdStorageId,
                ohQty: 0,
                allocatedQty: 0,
                whZoneId: _pdStorages[1].whZoneId,
                whAisleId: _pdStorages[1].whAisleId,
                whRackId: _pdStorages[1].whRackId,
                whShelfId: _pdStorages[1].whShelfId,
                bizId: _biz.bizId,
                branchId: _branch.branchId
            }
        ]

        bid = _biz.bizId;
        brid = _branch.branchId;

        _biz = await bizService.add({ bid, brid, data: _biz })
        _branch = await branchService.add({ bid, brid, data: _branch })
        _wh = await whService.add({ bid, brid, data: _wh })
        _whZone = await whZoneService.add({ bid, brid, data: _whZone })
        _whAisle = await whAisleService.add({ bid, brid, data: _whAisle })
        _whRack = await whRackService.add({ bid, brid, data: _whRack })
        _whShelf = await whShelfService.add({ bid, brid, data: _whShelf })
        _whStorages = await whStorageService.addList({ bid, brid, data: _whStorages, batch: true })
        _pd = await pdService.add({ bid, brid, data: _pd })
        _pdBranch = await pdBranchService.add({ bid, brid, data: _pdBranch })
        _pdWh = await pdWhService.add({ bid, brid, data: _pdWh })
        _pdStorages = await pdStorageService.addList({ bid, brid, data: _pdStorages, batch: true })
        _pdLots = await pdLotService.addList({ bid, brid, data: _pdLots, batch: true })
        _pdLotStorages = await pdLotStorageService.addList({ bid, brid, data: _pdLotStorages, batch: true })

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_LOT_STORAGE <test case group description>', () => {
        it('#1.1 Before insert', async () => {
            const before = await pdLotStorageTestService.beforeInsert({ bid, brid, data: _pdLotStorages[0] })
            expect(before).toEqual(_pdLotStorages[0])
        })
        it('#1.1 Get or create', async () => {
            const res = await pdLotStorageTestService.getOrCreate({ bid, brid, pdLotId: _pdLots[0].pdLotId, pdStorageId: _pdStorages[0].pdStorageId })
            console.log(res)
        })
        it('#1.1 Allocate without quantity', async () => {
            const before = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            await pdLotStorageTestService.update({ bid, brid, data: { pdLotStorageId: before.pdLotStorageId, ohQty: 0, allocatedQty: 0 } })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdLotStorageTestService.allocateQty({ bid, brid, pdLotStorageId: before.pdLotStorageId, qty: qtyToAllocate, bubble: true })
            }).rejects.toThrow('No quantity for allocation.')
        })
        it('#1.1 Allocate with not enough quantity', async () => {
            const before = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            await pdLotStorageTestService.update({ bid, brid, data: { pdLotStorageId: before.pdLotStorageId, ohQty: 4, allocatedQty: 0 } })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdLotStorageTestService.allocateQty({ bid, brid, pdLotStorageId: before.pdLotStorageId, qty: qtyToAllocate, bubble: true })
            }).rejects.toThrow('Quantity can allocate 4 of 5. current on-hand: 4, current allocated: 0')
        })
        it('#1.1 Allocate Qty', async () => {
            let before = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            before = await pdLotStorageTestService.update({ bid, brid, data: { pdLotStorageId: before.pdLotStorageId, ohQty: 10, allocatedQty: 0 } })
            const oldAllocatedQty = before.allocatedQty;
            const qtyToAllocate = 5;
            const lotDeallocateQty = jest.spyOn(pdLotStorageTestService.pdLotService, 'allocateQty').mockImplementation(() => null);
            const storageDeallocateQty = jest.spyOn(pdLotStorageTestService.pdStorageService, 'allocateQty').mockImplementation(() => null);
            let res = await pdLotStorageTestService.allocateQty({ bid, brid, pdLotStorageId: before.pdLotStorageId, qty: qtyToAllocate, bubble: true })
            expect(res).toEqual({
                "lastAllocatedQty": before.allocatedQty || 0,
                "allocatedQty": oldAllocatedQty + qtyToAllocate,
                "pdLotStorageId": before.pdLotStorageId,
            })
            expect(lotDeallocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdLotId": before.pdLotId,
                "preloaded": undefined,
                "qty": qtyToAllocate,
                "sharedClient": undefined,
            })
            expect(storageDeallocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": before.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToAllocate,
                "sharedClient": undefined,
            })
            lotDeallocateQty.mockReset();
            storageDeallocateQty.mockReset();
            const after = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            expect(after.allocatedQty).toEqual(before.allocatedQty + qtyToAllocate)
        })
        it('#1.1 Deallocate Qty', async () => {
            let before = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            const oldAllocatedQty = before.allocatedQty;
            const qtyToDeallocate = 5;
            const lotDeallocateQty = jest.spyOn(pdLotStorageTestService.pdLotService, 'deallocateQty').mockImplementation(() => null);
            const storageDeallocateQty = jest.spyOn(pdLotStorageTestService.pdStorageService, 'deallocateQty').mockImplementation(() => null);
            let res = await pdLotStorageTestService.deallocateQty({ bid, brid, pdLotStorageId: before.pdLotStorageId, qty: qtyToDeallocate, bubble: true })
            expect(res).toEqual({
                "lastAllocatedQty": before.allocatedQty,
                "allocatedQty": oldAllocatedQty - qtyToDeallocate,
                "pdLotStorageId": before.pdLotStorageId,
            })
            expect(lotDeallocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdLotId": before.pdLotId,
                "preloaded": undefined,
                "qty": qtyToDeallocate,
                "sharedClient": undefined,
            })
            expect(storageDeallocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": before.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToDeallocate,
                "sharedClient": undefined,
            })
            lotDeallocateQty.mockReset();
            storageDeallocateQty.mockReset();
            const after = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            expect(after.allocation).toEqual([])
            expect(after.allocatedQty).toEqual(0)
        })
        it('#1.1 Increase Qty', async () => {
            const before = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            const qtyToIncrease = 5;
            const lotIncreaseQty = jest.spyOn(pdLotStorageTestService.pdLotService, 'increaseQty').mockImplementation(() => null);
            const storageIncreaseQty = jest.spyOn(pdLotStorageTestService.pdStorageService, 'increaseQty').mockImplementation(() => null);
            const res = await pdLotStorageTestService.increaseQty({ bid, brid, pdLotStorageId: before.pdLotStorageId, qty: qtyToIncrease, bubble: true })
            expect(res).toEqual({
                "lastQty": before.ohQty,
                "newQty": before.ohQty + qtyToIncrease,
                "pdLotStorageId": before.pdLotStorageId,
                "refLotNo": before.refLotNo,
                "refPdName": before.refPdName,
                "refPdNo": before.refPdNo,
                "refStorageNo": before.refStorageNo,
            })
            expect(lotIncreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdLotId": before.pdLotId,
                "preloaded": undefined,
                "qty": qtyToIncrease,
                "sharedClient": undefined,
            })
            expect(storageIncreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": before.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToIncrease,
                "sharedClient": undefined,
            })
            storageIncreaseQty.mockReset();
            const after = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            expect(after.ohQty).toEqual(before.ohQty + qtyToIncrease)
        })
        it('#1.1 Decrease Qty', async () => {
            let before = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            before = await pdLotStorageTestService.update({ bid, brid, data: { pdLotStorageId: before.pdLotStorageId, ohQty: 10, allocatedQty: 0 } })
            const qtyToDecrease = 5;
            const lotIncreaseQty = jest.spyOn(pdLotStorageTestService.pdLotService, 'decreaseQty').mockImplementation(() => null);
            const storageIncreaseQty = jest.spyOn(pdLotStorageTestService.pdStorageService, 'decreaseQty').mockImplementation(() => null);
            const res = await pdLotStorageTestService.decreaseQty({ bid, brid, pdLotStorageId: before.pdLotStorageId, qty: qtyToDecrease, bubble: true })
            expect(res).toEqual({
                "lastQty": before.ohQty,
                "newQty": before.ohQty - qtyToDecrease,
                "pdLotStorageId": before.pdLotStorageId,
                "refLotNo": before.refLotNo,
                "refPdName": before.refPdName,
                "refPdNo": before.refPdNo,
                "refStorageNo": before.refStorageNo,
            })
            expect(lotIncreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdLotId": before.pdLotId,
                "preloaded": undefined,
                "qty": qtyToDecrease,
                "sharedClient": undefined,
            })
            expect(storageIncreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": before.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToDecrease,
                "sharedClient": undefined,
            })
            storageIncreaseQty.mockReset();
            let after = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            expect(after.ohQty).toEqual(before.ohQty - qtyToDecrease);
        })
        it('#1.1 Adjust Qty Increase', async () => {
            let before = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            before = await pdLotStorageTestService.update({ bid, brid, data: { pdLotStorageId: before.pdLotStorageId, ohQty: 20, allocatedQty: 0 } })
            const diffQty = 10;
            const qtyToAdjust = before.ohQty + diffQty;
            const lotIncreaseQty = jest.spyOn(pdLotStorageTestService.pdLotService, 'increaseQty').mockImplementation(() => null);
            const storageIncreaseQty = jest.spyOn(pdLotStorageTestService.pdStorageService, 'increaseQty').mockImplementation(() => null);
            const res = await pdLotStorageTestService.adjustQty({ bid, brid, pdLotStorageId: before.pdLotStorageId, qty: qtyToAdjust, bubble: true })
            expect(res).toEqual({
                "lastQty": before.ohQty,
                "newQty": qtyToAdjust,
                "pdLotStorageId": before.pdLotStorageId,
                "refLotNo": before.refLotNo,
                "refPdName": before.refPdName,
                "refPdNo": before.refPdNo,
                "refStorageNo": before.refStorageNo,
            })
            expect(lotIncreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdLotId": before.pdLotId,
                "preloaded": undefined,
                "qty": diffQty,
                "sharedClient": undefined,
            })
            expect(storageIncreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": before.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": diffQty,
                "sharedClient": undefined,
            })
            storageIncreaseQty.mockReset();
            let after = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            expect(after.ohQty).toEqual(qtyToAdjust);
        })
        it('#1.1 Adjust Qty Decrease', async () => {
            let before = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            before = await pdLotStorageTestService.update({ bid, brid, data: { pdLotStorageId: before.pdLotStorageId, ohQty: 30, allocatedQty: 0 } })
            const diffQty = 20;
            const qtyToAdjust = before.ohQty - diffQty;
            const lotDecreaseQty = jest.spyOn(pdLotStorageTestService.pdLotService, 'decreaseQty').mockImplementation(() => null);
            const storageDecreaseQty = jest.spyOn(pdLotStorageTestService.pdStorageService, 'decreaseQty').mockImplementation(() => null);
            const res = await pdLotStorageTestService.adjustQty({ bid, brid, pdLotStorageId: before.pdLotStorageId, qty: qtyToAdjust, bubble: true })
            expect(res).toEqual({
                "lastQty": before.ohQty,
                "newQty": qtyToAdjust,
                "pdLotStorageId": before.pdLotStorageId,
                "refLotNo": before.refLotNo,
                "refPdName": before.refPdName,
                "refPdNo": before.refPdNo,
                "refStorageNo": before.refStorageNo,
            })
            expect(lotDecreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdLotId": before.pdLotId,
                "preloaded": undefined,
                "qty": diffQty,
                "sharedClient": undefined,
            })
            expect(storageDecreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": before.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": diffQty,
                "sharedClient": undefined,
            })
            storageDecreaseQty.mockReset();
            let after = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            expect(after.ohQty).toEqual(qtyToAdjust);
        })
        it('#1.1 Tranfer Qty', async () => {
            await pdLotStorageTestService.update({ bid, brid, data: { pdLotStorageId: _pdLotStorages[0].pdLotStorageId, ohQty: 100, allocatedQty: 0 } })
            const beforeSrc = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            const beforeDst = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[1].pdLotStorageId })
            const qtyToTransfer = 10;
            const res = await pdLotStorageTestService.transferQty({ bid, brid, srcPdLotStorageId: beforeSrc.pdLotStorageId, dstPdLotStorageId: beforeDst.pdLotStorageId, qty: qtyToTransfer, bubble: false })
            expect(res).toEqual({
                src: {
                    "lastQty": beforeSrc.ohQty,
                    "newQty": beforeSrc.ohQty - qtyToTransfer,
                    "pdLotStorageId": beforeSrc.pdLotStorageId,
                    "refLotNo": beforeSrc.refLotNo,
                    "refPdName": beforeSrc.refPdName,
                    "refPdNo": beforeSrc.refPdNo,
                    "refStorageNo": beforeSrc.refStorageNo,
                },
                dst: {
                    "lastQty": beforeDst.ohQty,
                    "newQty": beforeDst.ohQty + qtyToTransfer,
                    "pdLotStorageId": beforeDst.pdLotStorageId,
                    "refLotNo": beforeDst.refLotNo,
                    "refPdName": beforeDst.refPdName,
                    "refPdNo": beforeDst.refPdNo,
                    "refStorageNo": beforeDst.refStorageNo,
                }
            })
            const afterSrc = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[0].pdLotStorageId })
            const afterDst = await pdLotStorageTestService.getById(bid, { id: _pdLotStorages[1].pdLotStorageId })
            expect(afterSrc.ohQty).toEqual(beforeSrc.ohQty - qtyToTransfer)
            expect(afterDst.ohQty).toEqual(beforeDst.ohQty + qtyToTransfer)
        })
    })

});