import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { BIZ_ALLOWED_PROVIDER } from './biz-allowed.provider';
import { BizAllowedTestService } from './biz-allowed-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('BIZ_ALLOWED', () => {
    let poolService: PostgresPoolService;
    let bizAllowedTestService: BizAllowedTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...BIZ_ALLOWED_PROVIDER,
                BizAllowedTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        bizAllowedTestService = app.get<BizAllowedTestService>(BizAllowedTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('BIZ_ALLOWED <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});