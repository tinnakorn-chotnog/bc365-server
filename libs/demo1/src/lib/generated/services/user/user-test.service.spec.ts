import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { USER_PROVIDER } from './user.provider';
import { UserTestService } from './user-test.service'
import { BIZ_PROVIDER } from '../biz';
import { USER_TOKEN_PROVIDER } from '../user-token';
import { BIZ_USER_PROVIDER } from '../biz-user';
import { BIZ_ALLOWED_PROVIDER } from '../biz-allowed';

jest.setTimeout(5000000);

describe('USER', () => {
    let poolService: PostgresPoolService;
    let userTestService: UserTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...USER_TOKEN_PROVIDER,
				...BIZ_USER_PROVIDER,
				...BIZ_ALLOWED_PROVIDER,
                ...USER_PROVIDER,
                UserTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        userTestService = app.get<UserTestService>(UserTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('USER <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});