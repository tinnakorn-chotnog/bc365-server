import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { RESTA_MENU_PROVIDER } from './resta-menu.provider';
import { RestaMenuTestService } from './resta-menu-test.service'
import { BIZ_PROVIDER } from '../biz';
import { KITCHEN_ORD_PROVIDER } from '../kitchen-ord';
import { RESTA_BRANCH_MENU_PROVIDER } from '../resta-branch-menu';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('RESTA_MENU', () => {
    let poolService: PostgresPoolService;
    let restaMenuTestService: RestaMenuTestService

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
				...KITCHEN_ORD_PROVIDER,
				...RESTA_BRANCH_MENU_PROVIDER,
                ...RESTA_MENU_PROVIDER,
                RestaMenuTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        restaMenuTestService = app.get<RestaMenuTestService>(RestaMenuTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('RESTA_MENU <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});