import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { SU_TYPE_PROVIDER } from './su-type.provider';
import { SuTypeTestService } from './su-type-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('SU_TYPE', () => {
    let poolService: PostgresPoolService;
    let suTypeTestService: SuTypeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...SU_TYPE_PROVIDER,
                SuTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        suTypeTestService = app.get<SuTypeTestService>(SuTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('SU_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});