import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_HU_PROVIDER } from './pd-hu.provider';
import { PdHuTestService } from './pd-hu-test.service'
import { BIZ_PROVIDER, BizExtService } from '../biz';
import shortUUID from 'short-uuid';
import { WH_HU_PROVIDER, WhHuExtService } from '../wh-hu';
import { PD_PROVIDER } from '../pd/pd.provider';
import { PD_WH_PROVIDER, PdWhExtService } from '../pd-wh';
import { PD_STORAGE_PROVIDER, PdStorageExtService } from '../pd-storage';
import { PdAllocationInfo } from '../../interfaces/pd-allocation-info.model';
import { WhHu } from '../../interfaces/wh-hu.model';
import { PdHu } from '../../interfaces/pd-hu.model';
import { PdBranch } from '../../interfaces/pd-branch.model';
import { PdWh } from '../../interfaces/pd-wh.model';
import { PdStorage } from '../../interfaces/pd-storage.model';
import { PdLot } from '../../interfaces/pd-lot.model';
import { PdLotStorage } from '../../interfaces/pd-lot-storage.model';
import { Pd } from '../../interfaces/pd.model';
import { WhStorage } from '../../interfaces/wh-storage.model';
import { WhZone } from '../../interfaces/wh-zone.model';
import { WhAisle } from '../../interfaces/wh-aisle.model';
import { WhRack } from '../../interfaces/wh-rack.model';
import { WhShelf } from '../../interfaces/wh-shelf.model';
import { Wh } from '../../interfaces/wh.model';
import { Branch } from '../../interfaces/branch.model';
import { Biz } from '../../interfaces/biz.model';
import { BRANCH_PROVIDER, BranchExtService } from '../branch';
import { WH_PROVIDER, WhExtService } from '../wh';
import { WH_ZONE_PROVIDER, WhZoneExtService } from '../wh-zone';
import { WH_AISLE_PROVIDER, WhAisleExtService } from '../wh-aisle';
import { WH_RACK_PROVIDER, WhRackExtService } from '../wh-rack';
import { WH_SHELF_PROVIDER, WhShelfExtService } from '../wh-shelf';
import { WH_STORAGE_PROVIDER, WhStorageExtService } from '../wh-storage';
import { PdExtService } from '../pd/pd-ext.service';
import { PD_BRANCH_PROVIDER, PdBranchExtService } from '../pd-branch';
import { PD_LOT_PROVIDER, PdLotExtService } from '../pd-lot';
import { PD_LOT_STORAGE_PROVIDER, PdLotStorageExtService } from '../pd-lot-storage';
import { PdHuExtService } from './pd-hu-ext.service';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PD_HU', () => {
    let poolService: PostgresPoolService;
    let pdHuTestService: PdHuTestService
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
    let whHuService: WhHuExtService;
    let pdService: PdExtService;
    let pdBranchService: PdBranchExtService;
    let pdWhService: PdWhExtService;
    let pdStorageService: PdStorageExtService;
    let pdLotService: PdLotExtService;
    let pdLotStorageService: PdLotStorageExtService;
    let pdHuService: PdHuExtService;

    let _biz: Biz;
    let _branch: Branch;
    let _wh: Wh;
    let _whZone: WhZone;
    let _whAisle: WhAisle;
    let _whRack: WhRack;
    let _whShelf: WhShelf;
    let _whStorages: WhStorage[];
    let _whHus: WhHu[];
    let _pd: Pd;
    let _pdBranch: PdBranch;
    let _pdWh: PdWh;
    let _pdStorages: PdStorage[];
    let _pdLot: PdLot;
    let _pdLotStorages: PdLotStorage[];
    let _pdHus: PdHu[];

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
                ...WH_HU_PROVIDER,
                ...PD_PROVIDER,
                ...PD_BRANCH_PROVIDER,
                ...PD_WH_PROVIDER,
                ...PD_STORAGE_PROVIDER,
                ...PD_LOT_PROVIDER,
                ...PD_LOT_STORAGE_PROVIDER,
                ...PD_HU_PROVIDER,
                PdHuTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        bizService = app.get<BizExtService>(BizExtService);
        pdHuTestService = app.get<PdHuTestService>(PdHuTestService);
        branchService = app.get<BranchExtService>(BranchExtService);
        whService = app.get<WhExtService>(WhExtService);
        whZoneService = app.get<WhZoneExtService>(WhZoneExtService);
        whAisleService = app.get<WhAisleExtService>(WhAisleExtService);
        whRackService = app.get<WhRackExtService>(WhRackExtService);
        whShelfService = app.get<WhShelfExtService>(WhShelfExtService);
        whStorageService = app.get<WhStorageExtService>(WhStorageExtService);
        whHuService = app.get<WhHuExtService>(WhHuExtService);
        pdService = app.get<PdExtService>(PdExtService);
        pdBranchService = app.get<PdBranchExtService>(PdBranchExtService);
        pdWhService = app.get<PdWhExtService>(PdWhExtService);
        pdStorageService = app.get<PdStorageExtService>(PdStorageExtService);
        pdLotService = app.get<PdLotExtService>(PdLotExtService);
        pdLotStorageService = app.get<PdLotStorageExtService>(PdLotStorageExtService);
        pdHuService = app.get<PdHuExtService>(PdHuExtService);


        _biz = {
            bizId: pdHuTestService.service.generateId(),
            bizNo: 'BIZ-01',
            bizName: 'BIZ-NAME-01'
        }

        _branch = {
            branchId: pdHuTestService.service.generateId(),
        }

        _wh = {
            whId: pdHuTestService.service.generateId(),
            whNo: 'WH-01',
            whName: 'WH-NAME-01',
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _whZone = {
            whZoneId: pdHuTestService.service.generateId(),
            whZoneNo: 'ZONE-01',
            whZoneName: 'ZONE-NAME-01',
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _whAisle = {
            whAisleId: pdHuTestService.service.generateId(),
            whAisleNo: 'AISLE-01',
            whAisleName: 'AISLE-NAME-01',
            whZoneId: _whZone.whZoneId,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _whRack = {
            whRackId: pdHuTestService.service.generateId(),
            whRackNo: 'RACK-01',
            whRackName: 'RACK-NAME-01',
            whZoneId: _whZone.whZoneId,
            whAisleId: _whAisle.whAisleId,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _whShelf = {
            whShelfId: pdHuTestService.service.generateId(),
            whShelfNo: 'SHELF-01',
            whShelfName: 'SHELF-NAME-01',
            whZoneId: _whZone.whZoneId,
            whRackId: _whRack.whRackId,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _whHus = [
            {
                whHuId: pdHuTestService.service.generateId(),
                huNo: 'HU-01',
                huTypeId: '1',
                bizId: _biz.bizId,
                branchId: _branch.branchId,
                whId: _wh.whId,
            },
            {
                whHuId: pdHuTestService.service.generateId(),
                huNo: 'HU-02',
                huTypeId: '1',
                bizId: _biz.bizId,
                branchId: _branch.branchId,
                whId: _wh.whId,
            },
            {
                whHuId: pdHuTestService.service.generateId(),
                huNo: 'HU-03',
                huTypeId: '1',
                bizId: _biz.bizId,
                branchId: _branch.branchId,
                whId: _wh.whId,
            },
            {
                whHuId: pdHuTestService.service.generateId(),
                huNo: 'HU-04',
                huTypeId: '1',
                bizId: _biz.bizId,
                branchId: _branch.branchId,
                whId: _wh.whId,
            }
        ]


        _whStorages = [
            {
                whStorageId: pdHuTestService.service.generateId(),
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
                whStorageId: pdHuTestService.service.generateId(),
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
            pdId: pdHuTestService.service.generateId(),
            pdNo: 'PD-0001',
            pdName: 'PD-NAME-0001',
            ohQty: 0,
            allocatedQty: 0,
            useLot: false,
            bizId: _biz.bizId,
        }

        _pdBranch = {
            pdBranchId: pdHuTestService.service.generateId(),
            pdId: _pd.pdId,
            ohQty: 0,
            allocatedQty: 0,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _pdWh = {
            pdWhId: pdHuTestService.service.generateId(),
            pdId: _pd.pdId,
            whId: _wh.whId,
            ohQty: 0,
            allocatedQty: 0,
            pdBranchId: _pdBranch.pdBranchId,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _pdLot = {
            pdLotId: pdHuTestService.service.generateId(),
            pdId: _pd.pdId,
            lotNo: 'LOT-01',
            ohQty: 0,
            allocatedQty: 0,
            bizId: _biz.bizId,
        }

        _pdStorages = [
            {
                pdStorageId: pdHuTestService.service.generateId(),
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
                pdStorageId: pdHuTestService.service.generateId(),
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
                pdLotStorageId: pdHuTestService.service.generateId(),
                pdId: _pd.pdId,
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
                pdLotStorageId: pdHuTestService.service.generateId(),
                pdId: _pd.pdId,
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

        _pdHus = [
            {
                pdHuId: pdHuTestService.service.generateId(),
                pdId: _pd.pdId,
                whHuId: _whHus[0].whHuId,
                ohQty: 0,
                allocatedQty: 0,
                pdStorageId: _pdStorages[0].pdStorageId,
                pdWhId: _pdStorages[0].pdWhId,
                whStorageId: _pdStorages[0].whStorageId,
                whZoneId: _pdStorages[0].whZoneId,
                whAisleId: _pdStorages[0].whAisleId,
                whRackId: _pdStorages[0].whRackId,
                whShelfId: _pdStorages[0].whShelfId,
                bizId: _biz.bizId,
            },
            {
                pdHuId: pdHuTestService.service.generateId(),
                pdId: _pd.pdId,
                whHuId: _whHus[1].whHuId,
                ohQty: 0,
                allocatedQty: 0,
                pdStorageId: _pdStorages[0].pdStorageId,
                pdWhId: _pdStorages[0].pdWhId,
                whStorageId: _pdStorages[0].whStorageId,
                whZoneId: _pdStorages[0].whZoneId,
                whAisleId: _pdStorages[0].whAisleId,
                whRackId: _pdStorages[0].whRackId,
                whShelfId: _pdStorages[0].whShelfId,
                bizId: _biz.bizId,
            },
            {
                pdHuId: pdHuTestService.service.generateId(),
                pdId: _pd.pdId,
                whHuId: _whHus[2].whHuId,
                ohQty: 0,
                allocatedQty: 0,
                pdStorageId: _pdStorages[1].pdStorageId,
                whStorageId: _pdStorages[1].whStorageId,
                whZoneId: _pdStorages[1].whZoneId,
                whAisleId: _pdStorages[1].whAisleId,
                whRackId: _pdStorages[1].whRackId,
                whShelfId: _pdStorages[1].whShelfId,
                bizId: _biz.bizId,
            },
            {
                pdHuId: pdHuTestService.service.generateId(),
                pdId: _pd.pdId,
                whHuId: _whHus[3].whHuId,
                ohQty: 0,
                allocatedQty: 0,
                pdStorageId: _pdStorages[1].pdStorageId,
                whStorageId: _pdStorages[1].whStorageId,
                whZoneId: _pdStorages[1].whZoneId,
                whAisleId: _pdStorages[1].whAisleId,
                whRackId: _pdStorages[1].whRackId,
                whShelfId: _pdStorages[1].whShelfId,
                bizId: _biz.bizId,
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
        _whHus = await whHuService.addList({ bid, brid, data: _whHus, batch: true })
        _pd = await pdService.add({ bid, brid, data: _pd })
        _pdBranch = await pdBranchService.add({ bid, brid, data: _pdBranch })
        _pdWh = await pdWhService.add({ bid, brid, data: _pdWh })
        _pdStorages = await pdStorageService.addList({ bid, brid, data: _pdStorages, batch: true })
        _pdLot = await pdLotService.add({ bid, brid, data: _pdLot })
        _pdLotStorages = await pdLotStorageService.addList({ bid, brid, data: _pdLotStorages, batch: true })
        _pdHus = await pdHuService.addList({ bid, brid, data: _pdHus, batch: true })

    });


    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_HU <test case group description>', () => {
        it('#1.1 Before insert', async () => {
            const pdHu = await pdHuTestService.beforeInsert({ bid, brid, data:{ pdHuId: pdHuTestService.service.generateId(), pdId: _pd.pdId, whHuId: _whHus[0].whHuId  } })
            expect(pdHu).toEqual({
                pdHuId: pdHu.pdHuId,
                pdId: _pd.pdId,
                whHuId: _whHus[0].whHuId,
                pdWhId: _pdWh.pdWhId,
            })
        })

        it('#1.1 Allocate without quantity', async () => {
            const pdHu = await pdHuTestService.getById(bid, { id: _pdHus[0].pdHuId })
            await pdHuTestService.update({ bid, brid, data: { pdHuId: pdHu.pdHuId, ohQty: 0, allocatedQty: 0}})
            const qtyToAllocate = 5;
            const allocation: PdAllocationInfo = {
                docId: 'doc-1',
                docType: 'SO',
                partnerName: 'test',
                docNo: '00001',
                itemId: 'item-1',
                itemIndex: 1,
                allocatedQty: qtyToAllocate
            }
            expect(async () => {
                await pdHuTestService.allocateQty({ bid, brid, pdHuId: pdHu.pdHuId, qty: qtyToAllocate, bubble: true })
              }).rejects.toThrow('No quantity for allocation.')
        })
        it('#1.1 Allocate with not enough quantity', async () => {
            const pdHu = await pdHuTestService.getById(bid, { id: _pdHus[0].pdHuId })
            await pdHuTestService.update({ bid, brid, data: { pdHuId: pdHu.pdHuId, ohQty: 4, allocatedQty: 0}})
            const qtyToAllocate = 5;
            expect(async () => {
                await pdHuTestService.allocateQty({ bid, brid, pdHuId: pdHu.pdHuId, qty: qtyToAllocate, bubble: true })
              }).rejects.toThrow('Quantity can allocate 4 of 5. current on-hand: 4, current allocated: 0')
        })
        it('#1.1 Allocate Qty', async () => {
            const pdHu = await pdHuTestService.getById(bid, { id: _pdHus[0].pdHuId })
            await pdHuTestService.update({ bid, brid, data: { pdHuId: pdHu.pdHuId, ohQty: 10, allocatedQty: 0}})
            const oldAllocatedQty = pdHu.allocatedQty;
            const qtyToAllocate = 5;
            const allocateQty = jest.spyOn(pdHuTestService.pdStorageService, 'allocateQty').mockImplementation( () => null );
            let res = await pdHuTestService.allocateQty({ bid, brid, pdHuId: pdHu.pdHuId, qty: qtyToAllocate, bubble: true })
            expect(res).toEqual({
                "lastAllocatedQty": pdHu.allocatedQty || 0,
                "allocatedQty": oldAllocatedQty + qtyToAllocate,
                "pdHuId": pdHu.pdHuId,
            })
            expect(allocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdHu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToAllocate,
                "sharedClient": undefined,
            })
            allocateQty.mockReset();
        })
        it('#1.1 Deallocate Qty', async () => {
            let pdHu = await pdHuTestService.getById(bid, { id: _pdHus[0].pdHuId })
            const oldAllocatedQty = pdHu.allocatedQty;
            const qtyToDeallocate = 5;
            const allocateQty = jest.spyOn(pdHuTestService.pdStorageService, 'deallocateQty').mockImplementation( () => null );
            let res = await pdHuTestService.deallocateQty({ bid, brid, pdHuId: pdHu.pdHuId, qty: qtyToDeallocate, bubble: true })
            expect(res).toEqual({
                "lastAllocatedQty": pdHu.allocatedQty,
                "allocatedQty": oldAllocatedQty - qtyToDeallocate,
                "pdHuId": pdHu.pdHuId,
            })
            expect(allocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdHu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToDeallocate,
                "sharedClient": undefined,
            })
            allocateQty.mockReset();
            pdHu = await pdHuTestService.getById(bid, { id: _pdHus[0].pdHuId })
            expect(pdHu.allocation).toEqual([])
            expect(pdHu.allocatedQty).toEqual(0)
        })
        it('#1.1 Increase Qty', async () => {
            const pdHu = await pdHuTestService.getById(bid, { id: _pdHus[0].pdHuId })
            const qtyToIncrease = 5;
            const increaseQty = jest.spyOn(pdHuTestService.pdStorageService, 'increaseQty').mockImplementation( () => null );
            const res = await pdHuTestService.increaseQty({ bid, brid, pdHuId: pdHu.pdHuId, qty: qtyToIncrease, bubble: true })
            expect(res).toEqual({
                "lastQty": pdHu.ohQty,
                "newQty": pdHu.ohQty + qtyToIncrease,
                "pdHuId": pdHu.pdHuId,
            })
            expect(increaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdHu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToIncrease,
                "sharedClient": undefined,
            })
            increaseQty.mockReset();
        })
        it('#1.1 Decrease Qty', async () => {
            let pdHu = await pdHuTestService.getById(bid, { id: _pdHus[0].pdHuId })
            pdHu = await pdHuTestService.update({ bid, brid, data: { pdHuId: pdHu.pdHuId, ohQty: 10, allocatedQty: 0}})
            const qtyToDecrease = 5;
            const decreaseQty = jest.spyOn(pdHuTestService.pdStorageService, 'decreaseQty').mockImplementation( () => null );
            const res = await pdHuTestService.decreaseQty({ bid, brid, pdHuId: pdHu.pdHuId, qty: qtyToDecrease, bubble: true })
            expect(res).toEqual({
                "lastQty": pdHu.ohQty,
                "newQty": pdHu.ohQty - qtyToDecrease,
                "pdHuId": pdHu.pdHuId,
            })
            expect(decreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdHu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToDecrease,
                "sharedClient": undefined,
            })
            decreaseQty.mockReset();
        })
        it('#1.1 Adjust Qty Increase', async () => {
            let pdHu = await pdHuTestService.getById(bid, { id: _pdHus[0].pdHuId })
            pdHu = await pdHuTestService.update({ bid, brid, data: { pdHuId: pdHu.pdHuId, ohQty: 20, allocatedQty: 0}})
            const diffQty = 10;
            const qtyToAdjust = pdHu.ohQty + diffQty;
            const increaseQty = jest.spyOn(pdHuTestService.pdStorageService, 'increaseQty').mockImplementation( () => null );
            const res = await pdHuTestService.adjustQty({ bid, brid, pdHuId: pdHu.pdHuId, qty: qtyToAdjust, bubble: true })
            expect(res).toEqual({
                "lastQty": pdHu.ohQty,
                "newQty": qtyToAdjust,
                "pdHuId": pdHu.pdHuId,
            })
            expect(increaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdHu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": diffQty,
                "sharedClient": undefined,
            })
            increaseQty.mockReset();
        })
        it('#1.1 Adjust Qty Decrease', async () => {
            let pdHu = await pdHuTestService.getById(bid, { id: _pdHus[0].pdHuId })
            pdHu = await pdHuTestService.update({ bid, brid, data: { pdHuId: pdHu.pdHuId, ohQty: 20, allocatedQty: 0}})
            const diffQty = 20;
            const qtyToAdjust = pdHu.ohQty - diffQty;
            const decreaseQty = jest.spyOn(pdHuTestService.pdStorageService, 'decreaseQty').mockImplementation( () => null );
            const res = await pdHuTestService.adjustQty({ bid, brid, pdHuId: pdHu.pdHuId, qty: qtyToAdjust, bubble: true })
            expect(res).toEqual({
                "lastQty": pdHu.ohQty,
                "newQty": qtyToAdjust,
                "pdHuId": pdHu.pdHuId,
            })
            expect(decreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdStorageId": pdHu.pdStorageId,
                "preloaded": undefined,
                "bubble": true,
                "qty": diffQty,
                "sharedClient": undefined,
            })
            decreaseQty.mockReset();
        })
        it('#1.1 Tranfer Qty', async () => {
            const pdHu = await pdHuTestService.update({ bid, brid, data: { pdHuId: _pdHus[0].pdHuId, ohQty: 100, allocatedQty: 0}})
            const srcPdHu = await pdHuTestService.getById(bid, { id: _pdHus[0].pdHuId })
            const dstPdHu = await pdHuTestService.getById(bid, { id: _pdHus[1].pdHuId })
            const qtyToTransfer = 10;
            const res = await pdHuTestService.transferQty({ bid, brid, srcPdHuId: srcPdHu.pdHuId, dstPdHuId: dstPdHu.pdHuId, qty: qtyToTransfer, bubble: false })
            expect(res).toEqual({
                src: {
                    "lastQty": srcPdHu.ohQty,
                    "newQty": srcPdHu.ohQty - qtyToTransfer,
                    "pdHuId": srcPdHu.pdHuId,
                },
                dst: {
                    "lastQty": dstPdHu.ohQty,
                    "newQty": dstPdHu.ohQty + qtyToTransfer,
                    "pdHuId": dstPdHu.pdHuId,
                }
            })
        })
    })

});