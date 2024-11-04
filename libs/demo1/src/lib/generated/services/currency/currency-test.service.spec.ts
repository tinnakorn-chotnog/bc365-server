import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CURRENCY_PROVIDER } from './currency.provider';
import { CurrencyTestService } from './currency-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('CURRENCY', () => {
    let poolService: PostgresPoolService;
    let currencyTestService: CurrencyTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...CURRENCY_PROVIDER,
                CurrencyTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        currencyTestService = app.get<CurrencyTestService>(CurrencyTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CURRENCY <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});