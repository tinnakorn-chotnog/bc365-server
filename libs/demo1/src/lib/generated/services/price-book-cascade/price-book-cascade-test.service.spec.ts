import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PRICE_BOOK_CASCADE_PROVIDER } from './price-book-cascade.provider';
import { PriceBookCascadeTestService } from './price-book-cascade-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('PRICE_BOOK_CASCADE', () => {
    let poolService: PostgresPoolService;
    let priceBookCascadeTestService: PriceBookCascadeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...PRICE_BOOK_CASCADE_PROVIDER,
                PriceBookCascadeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        priceBookCascadeTestService = app.get<PriceBookCascadeTestService>(PriceBookCascadeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PRICE_BOOK_CASCADE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});