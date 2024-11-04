import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { BIZ_USER_GRP_PROVIDER } from './biz-user-grp.provider';
import { BizUserGrpTestService } from './biz-user-grp-test.service'
import { BIZ_PROVIDER } from '../biz';
import { BIZ_USER_PROVIDER } from '../biz-user';

jest.setTimeout(5000000);

describe('BIZ_USER_GRP', () => {
    let poolService: PostgresPoolService;
    let bizUserGrpTestService: BizUserGrpTestService

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
                ...BIZ_USER_GRP_PROVIDER,
                BizUserGrpTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        bizUserGrpTestService = app.get<BizUserGrpTestService>(BizUserGrpTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('BIZ_USER_GRP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});