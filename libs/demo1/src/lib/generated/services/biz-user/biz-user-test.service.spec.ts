import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { BIZ_USER_PROVIDER } from './biz-user.provider';
import { BizUserTestService } from './biz-user-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('BIZ_USER', () => {
    let poolService: PostgresPoolService;
    let bizUserTestService: BizUserTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...BIZ_USER_PROVIDER,
                BizUserTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        bizUserTestService = app.get<BizUserTestService>(BizUserTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('BIZ_USER <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});