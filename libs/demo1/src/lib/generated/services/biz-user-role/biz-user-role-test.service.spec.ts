import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { BIZ_USER_ROLE_PROVIDER } from './biz-user-role.provider';
import { BizUserRoleTestService } from './biz-user-role-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('BIZ_USER_ROLE', () => {
    let poolService: PostgresPoolService;
    let bizUserRoleTestService: BizUserRoleTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...BIZ_USER_ROLE_PROVIDER,
                BizUserRoleTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        bizUserRoleTestService = app.get<BizUserRoleTestService>(BizUserRoleTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('BIZ_USER_ROLE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});