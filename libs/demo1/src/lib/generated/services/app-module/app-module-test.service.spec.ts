import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { APP_MODULE_PROVIDER } from './app-module.provider';
import { AppModuleTestService } from './app-module-test.service'
import { BIZ_PROVIDER } from '../biz';
import { APP_MENU_PROVIDER } from '../app-menu';

jest.setTimeout(5000000);

describe('APP_MODULE', () => {
    let poolService: PostgresPoolService;
    let appModuleTestService: AppModuleTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...APP_MENU_PROVIDER,
                ...APP_MODULE_PROVIDER,
                AppModuleTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        appModuleTestService = app.get<AppModuleTestService>(AppModuleTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('APP_MODULE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});