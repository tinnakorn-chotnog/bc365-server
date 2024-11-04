import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { RESTA_BRANCH_MENU_PROVIDER } from './resta-branch-menu.provider';
import { RestaBranchMenuTestService } from './resta-branch-menu-test.service'
import { BIZ_PROVIDER } from '../biz';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('RESTA_BRANCH_MENU', () => {
    let poolService: PostgresPoolService;
    let restaBranchMenuTestService: RestaBranchMenuTestService

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
                ...RESTA_BRANCH_MENU_PROVIDER,
                RestaBranchMenuTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        restaBranchMenuTestService = app.get<RestaBranchMenuTestService>(RestaBranchMenuTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('RESTA_BRANCH_MENU <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});