import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_PROVIDER } from './pd.provider';
import { PdTestService } from './pd-test.service'
import { BIZ_PROVIDER, BizExtService } from '../biz';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { PD_UOM_PROVIDER } from '../pd-uom';
import { PD_BAL_PROVIDER } from '../pd-bal';
import { PD_STORAGE_BAL_PROVIDER } from '../pd-storage-bal';
import { PRICE_BOOK_ITEM_PROVIDER } from '../price-book-item';
import { PD_BRANCH_PROVIDER, PdBranchExtService } from '../pd-branch';
import { PD_WH_PROVIDER } from '../pd-wh';
import { PD_LOT_PROVIDER } from '../pd-lot';
import { PD_LOT_STORAGE_PROVIDER } from '../pd-lot-storage';
import { PD_SN_PROVIDER } from '../pd-sn';
import { INV_TRN_PROVIDER } from '../inv-trn';
import { ASSET_PROVIDER } from '../asset';
import { PD_COST_STACK_PROVIDER } from '../pd-cost-stack';
import { PD_HU_PROVIDER } from '../pd-hu';
import { PD_SU_PROVIDER } from '../pd-su';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { WH_PROVIDER } from '../wh';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { BRANCH_PROVIDER, BranchExtService } from '../branch';
import { UOM_PROVIDER } from '../uom';
import { PD_CATE_PROVIDER } from '../pd-cate';
import { PD_SUBCATE_PROVIDER } from '../pd-subcate';
import { Biz } from '../../interfaces/biz.model';
import { Branch } from '../../interfaces/branch.model';
import { PdBranch } from '../../interfaces/pd-branch.model';
import { Pd } from '../../interfaces/pd.model';
import { PdExtService } from './pd-ext.service';
import { PdAllocationInfo } from '../../interfaces/pd-allocation-info.model';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PD', () => {
    let poolService: PostgresPoolService;
    let pdTestService: PdTestService

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
				...PD_STORAGE_PROVIDER,
				...PD_UOM_PROVIDER,
				...PD_BAL_PROVIDER,
				...PD_STORAGE_BAL_PROVIDER,
				...PRICE_BOOK_ITEM_PROVIDER,
				...PD_BRANCH_PROVIDER,
				...PD_WH_PROVIDER,
				...PD_LOT_PROVIDER,
				...PD_LOT_STORAGE_PROVIDER,
				...PD_SN_PROVIDER,
                ...PD_CATE_PROVIDER,
                ...PD_SUBCATE_PROVIDER,
				...INV_TRN_PROVIDER,
				...ASSET_PROVIDER,
				...PD_COST_STACK_PROVIDER,
				...PD_HU_PROVIDER,
				...PD_SU_PROVIDER,
                ...PD_PROVIDER,
                ...UOM_PROVIDER,
                ...WH_PROVIDER,
                ...WH_STORAGE_PROVIDER,
                PdTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdTestService = app.get<PdTestService>(PdTestService);

        _biz = {
            bizId: pdTestService.service.generateId(),
            bizNo: 'BIZ-01',
            bizName: 'BIZ-NAME-01'
        }

        _branch = {
            branchId: pdTestService.service.generateId(),
        }

        _pd = {
            pdId: pdTestService.service.generateId(),
            pdNo: 'PD-0001',
            pdName: 'PD-NAME-0001',
            ohQty: 0,
            allocatedQty: 0,
            useLot: false,
            bizId: _biz.bizId,
        }

        _pdBranch = {
            pdBranchId: pdTestService.service.generateId(),
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


    describe('PD <test case group description>', () => {
        it('#1.1 Before insert', async () => {
            const pdWh = await pdTestService.beforeInsert({ bid, brid, data: _pd })
            expect(pdWh).toEqual(_pd)
        })
        it('#1.1 Allocate without quantity', async () => {
            const before = await pdTestService.getById(bid, { id: _pd.pdId })
            await pdTestService.update({ bid, brid, data: { pdId: before.pdId, ohQty: 0, allocatedQty: 0 } })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdTestService.allocateQty({ bid, brid, pdId: before.pdId, qty: qtyToAllocate })
            }).rejects.toThrow('No quantity for allocation.')
        })
        it('#1.1 Allocate with not enough quantity', async () => {
            const before = await pdTestService.getById(bid, { id: _pd.pdId })
            await pdTestService.update({ bid, brid, data: { pdId: before.pdId, ohQty: 4, allocatedQty: 0 } })
            const qtyToAllocate = 5;
            expect(async () => {
                await pdTestService.allocateQty({ bid, brid, pdId: before.pdId, qty: qtyToAllocate })
            }).rejects.toThrow('Quantity can allocate 4 of 5. current on-hand: 4, current allocated: 0')
        })
        it('#1.1 Allocate Qty', async () => {
            let before = await pdTestService.getById(bid, { id: _pd.pdId })
            before = await pdTestService.update({ bid, brid, data: { pdId: before.pdId, ohQty: 10, allocatedQty: 0 } })
            const oldAllocatedQty = before.allocatedQty || 0;
            const qtyToAllocate = 5;
            let res = await pdTestService.allocateQty({ bid, brid, pdId: before.pdId, qty: qtyToAllocate })
            expect(res).toEqual({
                "lastAllocatedQty": before.allocatedQty,
                "allocatedQty": oldAllocatedQty + qtyToAllocate,
                "pdId": before.pdId,
            })
            const after = await pdTestService.getById(bid, { id: _pd.pdId })
            expect(after.allocatedQty).toEqual(before.allocatedQty + qtyToAllocate)
        })
        it('#1.1 Deallocate Qty', async () => {
            let before = await pdTestService.getById(bid, { id: _pd.pdId })
            before = await pdTestService.update({ bid, brid, data: { pdId: before.pdId, ohQty: 10, allocatedQty: 5 } })
            const oldAllocatedQty = before.allocatedQty;
            const qtyToDeallocate = 5;
            let res = await pdTestService.deallocateQty({ bid, brid, pdId: before.pdId, qty: qtyToDeallocate })
            expect(res).toEqual({
                "lastAllocatedQty": before.allocatedQty,
                "allocatedQty": oldAllocatedQty - qtyToDeallocate,
                "pdId": before.pdId,
            })
            const after = await pdTestService.getById(bid, { id: _pd.pdId })
            expect(after.allocatedQty).toEqual(0)
        })
        it('#1.1 Increase Qty', async () => {
            const before = await pdTestService.getById(bid, { id: _pd.pdId })
            const qtyToIncrease = 5;
            const res = await pdTestService.increaseQty({ bid, brid, pdId: before.pdId, qty: qtyToIncrease })
            expect(res).toEqual({
                "lastQty": before.ohQty,
                "newQty": before.ohQty + qtyToIncrease,
                "pdId": before.pdId,
            })
            const after = await pdTestService.getById(bid, { id: _pd.pdId })
            expect(after.ohQty).toEqual(before.ohQty + qtyToIncrease)
        })
        it('#1.1 Decrease Qty', async () => {
            let before = await pdTestService.getById(bid, { id: _pd.pdId })
            before = await pdTestService.update({ bid, brid, data: { pdId: before.pdId, ohQty: 10, allocatedQty: 0 } })
            const qtyToIncrease = 5;
            const res = await pdTestService.decreaseQty({ bid, brid, pdId: before.pdId, qty: qtyToIncrease })
            expect(res).toEqual({
                "lastQty": before.ohQty,
                "newQty": before.ohQty - qtyToIncrease,
                "pdId": before.pdId,
            })
            const after = await pdTestService.getById(bid, { id: _pd.pdId })
            expect(after.ohQty).toEqual(before.ohQty - qtyToIncrease)
        })
    })

});