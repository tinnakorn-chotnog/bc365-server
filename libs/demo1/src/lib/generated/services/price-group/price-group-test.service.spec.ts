import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PRICE_GROUP_PROVIDER } from './price-group.provider';
import { PriceGroupTestService } from './price-group-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_PROVIDER } from '../pd';
import { PRICE_BOOK_PROVIDER } from '../price-book';

jest.setTimeout(5000000);

describe('PRICE_GROUP', () => {
    let poolService: PostgresPoolService;
    let priceGroupTestService: PriceGroupTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...PD_PROVIDER,
				...PRICE_BOOK_PROVIDER,
                ...PRICE_GROUP_PROVIDER,
                PriceGroupTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        priceGroupTestService = app.get<PriceGroupTestService>(PriceGroupTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PRICE_GROUP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});