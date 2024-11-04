import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DISC_GROUP_PROVIDER } from './disc-group.provider';
import { DiscGroupTestService } from './disc-group-test.service'
import { BIZ_PROVIDER } from '../biz';
import { CUST_PROVIDER } from '../cust';
import { CUST_GROUP_PROVIDER } from '../cust-group';

jest.setTimeout(5000000);

describe('DISC_GROUP', () => {
    let poolService: PostgresPoolService;
    let discGroupTestService: DiscGroupTestService

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
				...CUST_GROUP_PROVIDER,
                ...DISC_GROUP_PROVIDER,
                DiscGroupTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        discGroupTestService = app.get<DiscGroupTestService>(DiscGroupTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DISC_GROUP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});