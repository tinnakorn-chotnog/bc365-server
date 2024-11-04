import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { TITLE_PROVIDER } from './title.provider';
import { TitleTestService } from './title-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('TITLE', () => {
    let poolService: PostgresPoolService;
    let titleTestService: TitleTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...TITLE_PROVIDER,
                TitleTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        titleTestService = app.get<TitleTestService>(TitleTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('TITLE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});