import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { REVENUE_PROVIDER } from './revenue.provider';
import { RevenueTestService } from './revenue-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('REVENUE', () => {
    let poolService: PostgresPoolService;
    let revenueTestService: RevenueTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...REVENUE_PROVIDER,
                RevenueTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        revenueTestService = app.get<RevenueTestService>(RevenueTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('REVENUE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});