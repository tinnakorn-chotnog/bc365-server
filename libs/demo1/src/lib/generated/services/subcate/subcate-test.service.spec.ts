import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { SUBCATE_PROVIDER } from './subcate.provider';
import { SubcateTestService } from './subcate-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_PROVIDER } from '../pd';

jest.setTimeout(5000000);

describe('SUBCATE', () => {
    let poolService: PostgresPoolService;
    let subcateTestService: SubcateTestService

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
                ...SUBCATE_PROVIDER,
                SubcateTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        subcateTestService = app.get<SubcateTestService>(SubcateTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('SUBCATE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});