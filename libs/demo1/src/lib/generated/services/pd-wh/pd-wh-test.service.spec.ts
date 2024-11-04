import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_WH_PROVIDER } from './pd-wh.provider';
import { PdWhTestService } from './pd-wh-test.service'
import { BIZ_PROVIDER, BizExtService } from '../biz';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { Logger } from '@nestjs/common';
import { PD_BRANCH_PROVIDER, PdBranchExtService } from '../pd-branch';
import { WH_PROVIDER, WhExtService } from '../wh';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { PD_PROVIDER, PdExtService } from '../pd';
import { PdAllocationInfo } from '../../interfaces/pd-allocation-info.model';
import { Biz } from '../../interfaces/biz.model';
import { Branch } from '../../interfaces/branch.model';
import { PdBranch } from '../../interfaces/pd-branch.model';
import { PdWh } from '../../interfaces/pd-wh.model';
import { Pd } from '../../interfaces/pd.model';
import { Wh } from '../../interfaces/wh.model';
import { BRANCH_PROVIDER, BranchExtService } from '../branch';
import { PdWhExtService } from './pd-wh-ext.service';
import { INV_TRN_PROVIDER } from '../inv-trn';
import { WhStorage } from '../../interfaces/wh-storage.model';
import { WH_STORAGE_PROVIDER, WhStorageExtService } from '../wh-storage';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PD_WH', () => {
    let poolService: PostgresPoolService;
    let pdWhTestService: PdWhTestService

    let bid: string;
    let brid: string;

    let bizService: BizExtService;
    let branchService: BranchExtService;
    let whService: WhExtService;
    let whStorageService: WhStorageExtService;
    let pdService: PdExtService;
    let pdBranchService: PdBranchExtService;
    let pdWhService: PdWhExtService;

    let _biz: Biz;
    let _branch: Branch;
    let _whs: Wh[];
    let _wh: Wh;
    let _whStorages: WhStorage[];
    let _whStorage: WhStorage;
    let _pds: Pd[];
    let _pd: Pd;
    let _pdBranches: PdBranch[];
    let _pdBranch: PdBranch;
    let _pdWhs: PdWh[];
    let _pdWh: PdWh;

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
                Logger,
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...BRANCH_PROVIDER,
                ...WH_PROVIDER,
                ...WH_STORAGE_PROVIDER,
                ...PD_PROVIDER,
				...PD_WH_PROVIDER,
				...INV_TRN_PROVIDER,
				...PD_STORAGE_PROVIDER,
                ...PD_BRANCH_PROVIDER,
                ...PD_WH_PROVIDER,
                PdWhTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdWhTestService = app.get<PdWhTestService>(PdWhTestService);

        _biz = {
            bizId: pdWhTestService.service.generateId(),
            bizNo: 'BIZ-01',
            bizName: 'BIZ-NAME-01'
        }

        bid = _biz.bizId;

        _branch = {
            branchId: pdWhTestService.service.generateId(),
            branchNo: 'B01',
            branchName: 'BRANCH 01',
            bizId: bid
        }

        brid = _branch.branchId;

        _whs = [
            {
                whId: pdWhTestService.service.generateId(),
                whNo: 'WH-01',
                whName: 'WH-NAME-01',
                bizId: bid,
                branchId: brid
            },
            {
                whId: pdWhTestService.service.generateId(),
                whNo: 'WH-02',
                whName: 'WH-NAME-02',
                bizId: bid,
                branchId: brid
            },
            {
                whId: pdWhTestService.service.generateId(),
                whNo: 'WH-03',
                whName: 'WH-NAME-03',
                bizId: bid,
                branchId: brid
            }
        ]

        _wh = _whs[0]

        _pd = {
            pdId: pdWhTestService.service.generateId(),
            pdNo: 'PD-0001',
            pdName: 'PD-NAME-0001',
            ohQty: 0,
            allocatedQty: 0,
            useLot: false,
            bizId: _biz.bizId,
        }

        _pdBranch = {
            pdBranchId: pdWhTestService.service.generateId(),
            pdId: _pd.pdId,
            branchId: brid,
            bizId: bid
        }

        _pdWh = {
            pdWhId: pdWhTestService.service.generateId(),
            pdId: _pd.pdId,
            whId: _wh.whId,
            ohQty: 0,
            allocatedQty: 0,
            pdBranchId: _pdBranch.pdBranchId,
            bizId: _biz.bizId,
            branchId: _branch.branchId,
            refPdNo: _pd.pdNo,
            refPdName: _pd.pdName,
            refWhNo: _wh.whNo,
            refWhName: _wh.whName
        }

        bid = _biz.bizId;
        brid = _branch.branchId;

        bizService = app.get<BizExtService>(BizExtService);
        branchService = app.get<BranchExtService>(BranchExtService);
        pdService = app.get<PdExtService>(PdExtService);
        pdBranchService = app.get<PdBranchExtService>(PdBranchExtService);
        whService = app.get<WhExtService>(WhExtService);
        whStorageService = app.get<WhStorageExtService>(WhStorageExtService);
        pdWhService = app.get<PdWhExtService>(PdWhExtService);

        _biz = await bizService.add({ bid, brid, data: _biz })
        _branch = await branchService.add({ bid, brid, data: _branch })
        _wh = await whService.add({ bid, brid, data: _wh })
        _whStorages = await whStorageService.addList({ bid, brid, data: _whStorages, batch: true })
        _pd = await pdService.add({ bid, brid, data: _pd })
        _pdBranch = await pdBranchService.add({ bid, brid, data: _pdBranch })
        _pdWh = await pdWhService.add({ bid, brid, data: _pdWh })

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_WH <test case group description>', () => {
        it('#1.1 Before insert', async () => {
            const pdWh = await pdWhTestService.beforeInsert({ bid, brid, data: _pdWh })
            console.log(pdWh)
            expect(pdWh).toEqual(_pdWh)
        })
        it('#1.1 Allocate without quantity', async () => {
            const before = await pdWhTestService.getById(bid, { id: _pdWh.pdWhId })
            await pdWhTestService.update({ bid, brid, data: { pdWhId: before.pdWhId, ohQty: 0, allocatedQty: 0 } })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdWhTestService.allocateQty({ bid, brid, pdWhId: before.pdWhId, qty: qtyToAllocate, bubble: true })
            }).rejects.toThrow('No quantity for allocation.')
        })
        it('#1.1 Allocate with not enough quantity', async () => {
            const before = await pdWhTestService.getById(bid, { id: _pdWh.pdWhId })
            await pdWhTestService.update({ bid, brid, data: { pdWhId: before.pdWhId, ohQty: 4, allocatedQty: 0 } })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdWhTestService.allocateQty({ bid, brid, pdWhId: before.pdWhId, qty: qtyToAllocate, bubble: true })
            }).rejects.toThrow('Quantity can allocate 4 of 5. current on-hand: 4, current allocated: 0')
        })
        it('#1.1 Allocate Qty', async () => {
            let before = await pdWhTestService.getById(bid, { id: _pdWh.pdWhId })
            before = await pdWhTestService.update({ bid, brid, data: { pdWhId: before.pdWhId, ohQty: 10, allocatedQty: 0 } })
            const oldAllocatedQty = before.allocatedQty || 0;
            const qtyToAllocate = 5;
            const allocateQty = jest.spyOn(pdWhTestService.pdBranchService, 'allocateQty').mockImplementation( () => null );
            let res = await pdWhTestService.allocateQty({ bid, brid, pdWhId: before.pdWhId, qty: qtyToAllocate , bubble: true })
            expect(res).toEqual({
                "lastAllocatedQty": before.allocatedQty,
                "allocatedQty": oldAllocatedQty + qtyToAllocate,
                "pdWhId": before.pdWhId,
            })
            expect(allocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdBranchId": before.pdBranchId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToAllocate,
                "sharedClient": undefined,
            })
            allocateQty.mockReset();
            const after = await pdWhTestService.getById(bid, { id: _pdWh.pdWhId })
            expect(after.allocatedQty).toEqual(before.allocatedQty + qtyToAllocate)
        })
        it('#1.1 Deallocate Qty', async () => {
            let before = await pdWhTestService.getById(bid, { id: _pdWh.pdWhId })
            before = await pdWhTestService.update({ bid, brid, data: { pdWhId: before.pdWhId, ohQty: 10, allocatedQty: 5} })
            const oldAllocatedQty = before.allocatedQty;
            const qtyToDeallocate = 5;
            const allocateQty = jest.spyOn(pdWhTestService.pdBranchService, 'deallocateQty').mockImplementation( () => null );
            let res = await pdWhTestService.deallocateQty({ bid, brid, pdWhId: before.pdWhId, qty: qtyToDeallocate, bubble: true })
            expect(res).toEqual({
                "lastAllocatedQty": before.allocatedQty,
                "allocatedQty": oldAllocatedQty - qtyToDeallocate,
                "pdWhId": before.pdWhId,
            })
            expect(allocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdBranchId": before.pdBranchId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToDeallocate,
                "sharedClient": undefined,
            })
            allocateQty.mockReset();
            const after = await pdWhTestService.getById(bid, { id: _pdWh.pdWhId })
            expect(after.allocation).toEqual([])
            expect(after.allocatedQty).toEqual(0)
        })
        it('#1.1 Increase Qty', async () => {
            const before = await pdWhTestService.getById(bid, { id: _pdWh.pdWhId })
            const qtyToIncrease = 5;
            const increaseQty = jest.spyOn(pdWhTestService.pdBranchService, 'increaseQty').mockImplementation( () => null );
            const res = await pdWhTestService.increaseQty({ bid, brid, pdWhId: before.pdWhId, qty: qtyToIncrease, bubble: true })
            expect(res).toEqual({
                "lastQty": before.ohQty,
                "newQty": before.ohQty + qtyToIncrease,
                "pdWhId": before.pdWhId,
            })
            expect(increaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdBranchId": before.pdBranchId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToIncrease,
                "sharedClient": undefined,
            })
            increaseQty.mockReset();
            const after = await pdWhTestService.getById(bid, { id: _pdWh.pdWhId })
            expect(after.ohQty).toEqual(before.ohQty + qtyToIncrease)
        })
        it('#1.1 Decrease Qty', async () => {
            let before = await pdWhTestService.getById(bid, { id: _pdWh.pdWhId })
            before = await pdWhTestService.update({ bid, brid, data: { pdWhId: before.pdWhId, ohQty: 10, allocatedQty: 0 } })
            const qtyToIncrease = 5;
            const decreaseQty = jest.spyOn(pdWhTestService.pdBranchService, 'decreaseQty').mockImplementation( () => null );
            const res = await pdWhTestService.decreaseQty({ bid, brid, pdWhId: before.pdWhId, qty: qtyToIncrease, bubble: true })
            expect(res).toEqual({
                "lastQty": before.ohQty,
                "newQty": before.ohQty - qtyToIncrease,
                "pdWhId": before.pdWhId,
            })
            expect(decreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdBranchId": before.pdBranchId,
                "preloaded": undefined,
                "bubble": true,
                "qty": qtyToIncrease,
                "sharedClient": undefined,
            })
            decreaseQty.mockReset();
            const after = await pdWhTestService.getById(bid, { id: _pdWh.pdWhId })
            expect(after.ohQty).toEqual(before.ohQty - qtyToIncrease)
        })
    })
});