import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { APP_ROUTE_PROVIDER } from './app-route.provider';
import { AppRouteTestService } from './app-route-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('APP_ROUTE', () => {
    let poolService: PostgresPoolService;
    let appRouteTestService: AppRouteTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...APP_ROUTE_PROVIDER,
                AppRouteTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        appRouteTestService = app.get<AppRouteTestService>(AppRouteTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('APP_ROUTE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});