import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PRICE_BOOK_PROVIDER } from './price-book.provider';
import { PriceBookTestService } from './price-book-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PRICE_BOOK_ITEM_PROVIDER } from '../price-book-item';

jest.setTimeout(5000000);

describe('PRICE_BOOK', () => {
    let poolService: PostgresPoolService;
    let priceBookTestService: PriceBookTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...PRICE_BOOK_ITEM_PROVIDER,
                ...PRICE_BOOK_PROVIDER,
                PriceBookTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        priceBookTestService = app.get<PriceBookTestService>(PriceBookTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PRICE_BOOK <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});