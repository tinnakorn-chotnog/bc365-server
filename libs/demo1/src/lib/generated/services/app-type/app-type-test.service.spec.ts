import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { APP_TYPE_PROVIDER } from './app-type.provider';
import { AppTypeTestService } from './app-type-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('APP_TYPE', () => {
    let poolService: PostgresPoolService;
    let appTypeTestService: AppTypeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...APP_TYPE_PROVIDER,
                AppTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        appTypeTestService = app.get<AppTypeTestService>(AppTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('APP_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});