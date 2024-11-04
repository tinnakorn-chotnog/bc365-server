import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_BRANCH_PROVIDER } from './pd-branch.provider';
import { PdBranchTestService } from './pd-branch-test.service'
import { BIZ_PROVIDER, BizExtService } from '../biz';
import { PD_WH_PROVIDER } from '../pd-wh';
import { INV_TRN_PROVIDER } from '../inv-trn';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { Biz } from '../../interfaces/biz.model';
import { Branch } from '../../interfaces/branch.model';
import { PdBranch } from '../../interfaces/pd-branch.model';
import { Pd } from '../../interfaces/pd.model';
import { BRANCH_PROVIDER, BranchExtService } from '../branch';
import { PdExtService } from '../pd/pd-ext.service';
import { PdBranchExtService } from './pd-branch-ext.service';
import { PD_PROVIDER } from '../pd';
import { PdAllocationInfo } from '../../interfaces/pd-allocation-info.model';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PD_BRANCH', () => {
    let poolService: PostgresPoolService;
    let pdBranchTestService: PdBranchTestService
    let bid: string;
    let brid: string;

    let bizService: BizExtService;
    let branchService: BranchExtService;
    let pdService: PdExtService;
    let pdBranchService: PdBranchExtService;

    let _biz: Biz;
    let _branch: Branch;
    let _pd: Pd;
    let _pdBranch: PdBranch;

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
                ...PD_PROVIDER,
				...PD_WH_PROVIDER,
				...INV_TRN_PROVIDER,
				...PD_STORAGE_PROVIDER,
                ...PD_BRANCH_PROVIDER,
                PdBranchTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdBranchTestService = app.get<PdBranchTestService>(PdBranchTestService);

        _biz = {
            bizId: pdBranchTestService.service.generateId(),
            bizNo: 'BIZ-01',
            bizName: 'BIZ-NAME-01'
        }

        _branch = {
            branchId: pdBranchTestService.service.generateId(),
        }

        _pd = {
            pdId: pdBranchTestService.service.generateId(),
            pdNo: 'PD-0001',
            pdName: 'PD-NAME-0001',
            ohQty: 0,
            allocatedQty: 0,
            useLot: false,
            bizId: _biz.bizId,
        }

        _pdBranch = {
            pdBranchId: pdBranchTestService.service.generateId(),
            pdId: _pd.pdId,
            ohQty: 0,
            allocatedQty: 0,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        bid = _biz.bizId;
        brid = _branch.branchId;

        bizService = app.get<BizExtService>(BizExtService);
        branchService = app.get<BranchExtService>(BranchExtService);
        pdService = app.get<PdExtService>(PdExtService);
        pdBranchService = app.get<PdBranchExtService>(PdBranchExtService);

        _biz = await bizService.add({ bid, brid, data: _biz })
        _branch = await branchService.add({ bid, brid, data: _branch })
        _pd = await pdService.add({ bid, brid, data: _pd })
        _pdBranch = await pdBranchService.add({ bid, brid, data: _pdBranch })

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_BRANCH <test case group description>', () => {
        it('#1.1 Before insert', async () => {
            const pdWh = await pdBranchTestService.beforeInsert({ bid, brid, data: _pdBranch })
            expect(pdWh).toEqual(_pdBranch)
        })
        it('#1.1 Allocate without quantity', async () => {
            const before = await pdBranchTestService.getById(bid, { id: _pdBranch.pdBranchId })
            await pdBranchTestService.update({ bid, brid, data: { pdBranchId: before.pdBranchId, ohQty: 0, allocatedQty: 0 } })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdBranchTestService.allocateQty({ bid, brid, pdBranchId: before.pdBranchId, qty: qtyToAllocate, bubble: true })
            }).rejects.toThrow('No quantity for allocation.')
        })
        it('#1.1 Allocate with not enough quantity', async () => {
            const before = await pdBranchTestService.getById(bid, { id: _pdBranch.pdBranchId })
            await pdBranchTestService.update({ bid, brid, data: { pdBranchId: before.pdBranchId, ohQty: 4, allocatedQty: 0 } })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdBranchTestService.allocateQty({ bid, brid, pdBranchId: before.pdBranchId, qty: qtyToAllocate, bubble: true })
            }).rejects.toThrow('Quantity can allocate 4 of 5. current on-hand: 4, current allocated: 0')
        })
        it('#1.1 Allocate Qty', async () => {
            let before = await pdBranchTestService.getById(bid, { id: _pdBranch.pdBranchId })
            before = await pdBranchTestService.update({ bid, brid, data: { pdBranchId: before.pdBranchId, ohQty: 10, allocatedQty: 0 } })
            const oldAllocatedQty = before.allocatedQty || 0;
            const qtyToAllocate = 5;
            const allocateQty = jest.spyOn(pdBranchTestService.pdService, 'allocateQty').mockImplementation( () => null );
            let res = await pdBranchTestService.allocateQty({ bid, brid, pdBranchId: before.pdBranchId, qty: qtyToAllocate , bubble: true })
            expect(res).toEqual({
                "lastAllocatedQty": before.allocatedQty,
                "allocatedQty": oldAllocatedQty + qtyToAllocate,
                "pdBranchId": before.pdBranchId,
            })
            expect(allocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdId": before.pdId,
                "qty": qtyToAllocate,
                "preloaded": undefined,
                "sharedClient": undefined,
            })
            allocateQty.mockReset();
            const after = await pdBranchTestService.getById(bid, { id: _pdBranch.pdBranchId })
            expect(after.allocatedQty).toEqual(before.allocatedQty + qtyToAllocate)
        })
        it('#1.1 Deallocate Qty', async () => {
            let before = await pdBranchTestService.getById(bid, { id: _pdBranch.pdBranchId })
            before = await pdBranchTestService.update({ bid, brid, data: { pdBranchId: before.pdBranchId, ohQty: 10, allocatedQty: 5 } })
            const oldAllocatedQty = before.allocatedQty;
            const qtyToDeallocate = 5;
            const allocateQty = jest.spyOn(pdBranchTestService.pdService, 'deallocateQty').mockImplementation( () => null );
            let res = await pdBranchTestService.deallocateQty({ bid, brid, pdBranchId: before.pdBranchId, qty: qtyToDeallocate, bubble: true })
            expect(res).toEqual({
                "lastAllocatedQty": before.allocatedQty,
                "allocatedQty": oldAllocatedQty - qtyToDeallocate,
                "pdBranchId": before.pdBranchId,
            })
            expect(allocateQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdId": before.pdId,
                "qty": qtyToDeallocate,
                "preloaded": undefined,
                "sharedClient": undefined,
            })
            allocateQty.mockReset();
            const after = await pdBranchTestService.getById(bid, { id: _pdBranch.pdBranchId })
            expect(after.allocation).toEqual([])
            expect(after.allocatedQty).toEqual(0)
        })
        it('#1.1 Increase Qty', async () => {
            const before = await pdBranchTestService.getById(bid, { id: _pdBranch.pdBranchId })
            const qtyToIncrease = 5;
            const increaseQty = jest.spyOn(pdBranchTestService.pdService, 'increaseQty').mockImplementation( () => null );
            const res = await pdBranchTestService.increaseQty({ bid, brid, pdBranchId: before.pdBranchId, qty: qtyToIncrease, bubble: true })
            expect(res).toEqual({
                "lastQty": before.ohQty,
                "newQty": before.ohQty + qtyToIncrease,
                "pdBranchId": before.pdBranchId,
            })
            expect(increaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdId": before.pdId,
                "preloaded": undefined,
                "qty": qtyToIncrease,
                "sharedClient": undefined,
            })
            increaseQty.mockReset();
            const after = await pdBranchTestService.getById(bid, { id: _pdBranch.pdBranchId })
            expect(after.ohQty).toEqual(before.ohQty + qtyToIncrease)
        })
        it('#1.1 Decrease Qty', async () => {
            let before = await pdBranchTestService.getById(bid, { id: _pdBranch.pdBranchId })
            before = await pdBranchTestService.update({ bid, brid, data: { pdBranchId: before.pdBranchId, ohQty: 10, allocatedQty: 0 } })
            const qtyToIncrease = 5;
            const decreaseQty = jest.spyOn(pdBranchTestService.pdService, 'decreaseQty').mockImplementation( () => null );
            const res = await pdBranchTestService.decreaseQty({ bid, brid, pdBranchId: before.pdBranchId, qty: qtyToIncrease, bubble: true })
            expect(res).toEqual({
                "lastQty": before.ohQty,
                "newQty": before.ohQty - qtyToIncrease,
                "pdBranchId": before.pdBranchId,
            })
            expect(decreaseQty).toBeCalledWith({
                "bid": bid,
                "brid": brid,
                "pdId": before.pdId,
                "preloaded": undefined,
                "qty": qtyToIncrease,
                "sharedClient": undefined,
            })
            decreaseQty.mockReset();
            const after = await pdBranchTestService.getById(bid, { id: _pdBranch.pdBranchId })
            expect(after.ohQty).toEqual(before.ohQty - qtyToIncrease)
        })
    })

});