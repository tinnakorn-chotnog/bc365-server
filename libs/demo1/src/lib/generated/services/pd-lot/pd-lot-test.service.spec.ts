import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_LOT_PROVIDER } from './pd-lot.provider';
import { PdLotTestService } from './pd-lot-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_LOT_STORAGE_PROVIDER } from '../pd-lot-storage';
import { PD_HU_PROVIDER } from '../pd-hu';
import { PdAllocationInfo } from '../../interfaces/pd-allocation-info.model';

jest.setTimeout(5000000);

describe('PD_LOT', () => {
    let poolService: PostgresPoolService;
    let pdLotTestService: PdLotTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...PD_LOT_STORAGE_PROVIDER,
				...PD_HU_PROVIDER,
                ...PD_LOT_PROVIDER,
                PdLotTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdLotTestService = app.get<PdLotTestService>(PdLotTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_LOT <test case group description>', () => {
        it('#1.1 Allocate Qty', async () => {
            const pdLot = await pdLotTestService.getById(bid, { id: 'f5ueFrpqaCX6qsS87fgJpa' })
            const oldAllocatedQty = pdLot.allocatedQty;
            const qtyToAllocate = 5;
            let res = await pdLotTestService.allocateQty({ bid, brid, pdLotId: pdLot.pdLotId, qty: qtyToAllocate })
            expect(res).toEqual({
                "lastAllocatedQty": pdLot.allocatedQty,
                "allocatedQty": oldAllocatedQty + qtyToAllocate,
                "pdLotId": pdLot.pdLotId,
            })
        })
        it('#1.1 Deallocate Qty', async () => {
            const pdLot = await pdLotTestService.getById(bid, { id: 'f5ueFrpqaCX6qsS87fgJpa' })
            const oldAllocatedQty = pdLot.allocatedQty;
            const qtyToDeallocate = 5;
            let res = await pdLotTestService.deallocateQty({ bid, brid, pdLotId: pdLot.pdLotId, qty: qtyToDeallocate })
            expect(res).toEqual({
                "lastAllocatedQty": pdLot.allocatedQty,
                "allocatedQty": oldAllocatedQty - qtyToDeallocate,
                "pdLotId": pdLot.pdLotId,
            })
        })
        it('#1.1 Increase Qty', async () => {
            const pdLot = await pdLotTestService.getById(bid, { id: 'f5ueFrpqaCX6qsS87fgJpa' })
            const qtyToIncrease = 5;
            let res = await pdLotTestService.increaseQty({ bid, brid, pdLotId: pdLot.pdLotId, qty: qtyToIncrease })
            expect(res).toEqual({
                "lastQty": pdLot.ohQty,
                "newQty": pdLot.ohQty + qtyToIncrease,
                "pdLotId": pdLot.pdLotId,
            })
        })
        it('#1.1 Decrease Qty', async () => {
            const pdLot = await pdLotTestService.getById(bid, { id: 'f5ueFrpqaCX6qsS87fgJpa' })
            const qtyToDecrease = 5;
            let res = await pdLotTestService.decreaseQty({ bid, brid, pdLotId: pdLot.pdLotId, qty: qtyToDecrease })
            expect(res).toEqual({
                "lastQty": pdLot.ohQty,
                "newQty": pdLot.ohQty - qtyToDecrease,
                "pdLotId": pdLot.pdLotId,
            })
        })
        it('#1.1 Suspended', async () => {
            const pdLot = await pdLotTestService.getById(bid, { id: 'f5ueFrpqaCX6qsS87fgJpa' })
            const qtyToDecrease = 5;
            let res = await pdLotTestService.decreaseQty({ bid, brid, pdLotId: pdLot.pdLotId, qty: qtyToDecrease })
            expect(res).toEqual({
                "lastQty": pdLot.ohQty,
                "newQty": pdLot.ohQty - qtyToDecrease,
                "pdLotId": pdLot.pdLotId,
            })
        })
    })

});