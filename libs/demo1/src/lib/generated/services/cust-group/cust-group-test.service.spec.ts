import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CUST_GROUP_PROVIDER } from './cust-group.provider';
import { CustGroupTestService } from './cust-group-test.service'
import { BIZ_PROVIDER } from '../biz';
import { CUST_PROVIDER } from '../cust';
import { PRICE_BOOK_PROVIDER } from '../price-book';

jest.setTimeout(5000000);

describe('CUST_GROUP', () => {
    let poolService: PostgresPoolService;
    let custGroupTestService: CustGroupTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...CUST_PROVIDER,
				...PRICE_BOOK_PROVIDER,
                ...CUST_GROUP_PROVIDER,
                CustGroupTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        custGroupTestService = app.get<CustGroupTestService>(CustGroupTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CUST_GROUP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});