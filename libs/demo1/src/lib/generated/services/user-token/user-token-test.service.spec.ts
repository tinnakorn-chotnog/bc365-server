import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { USER_TOKEN_PROVIDER } from './user-token.provider';
import { UserTokenTestService } from './user-token-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('USER_TOKEN', () => {
    let poolService: PostgresPoolService;
    let userTokenTestService: UserTokenTestService

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
                UserTokenTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        userTokenTestService = app.get<UserTokenTestService>(UserTokenTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('USER_TOKEN <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            const res = await userTokenTestService.get({ bid, brid })
            await userTokenTestService.flush(res)
            expect(true).toBe(true)
        })
    })

});