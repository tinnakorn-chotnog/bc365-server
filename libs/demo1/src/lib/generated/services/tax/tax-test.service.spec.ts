import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { TAX_PROVIDER } from './tax.provider';
import { TaxTestService } from './tax-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('TAX', () => {
    let poolService: PostgresPoolService;
    let taxTestService: TaxTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...TAX_PROVIDER,
                TaxTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        taxTestService = app.get<TaxTestService>(TaxTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('TAX <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});