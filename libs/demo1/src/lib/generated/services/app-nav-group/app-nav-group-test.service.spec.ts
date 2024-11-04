import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { APP_NAV_GROUP_PROVIDER } from './app-nav-group.provider';
import { AppNavGroupTestService } from './app-nav-group-test.service'
import { BIZ_PROVIDER } from '../biz';
import { APP_NAV_PROVIDER } from '../app-nav';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('APP_NAV_GROUP', () => {
    let poolService: PostgresPoolService;
    let appNavGroupTestService: AppNavGroupTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
				ConfigModule.forRoot({
					envFilePath: ['.test.env'],
					isGlobal: true,
					validationSchema: Joi.object(configSchema)
				}),
			],
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...APP_NAV_PROVIDER,
                ...APP_NAV_GROUP_PROVIDER,
                AppNavGroupTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        appNavGroupTestService = app.get<AppNavGroupTestService>(AppNavGroupTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('APP_NAV_GROUP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});