import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_CONTROLLER_PROVIDER } from './wh-controller.provider';
import { WhControllerTestService } from './wh-controller-test.service'
import { BIZ_PROVIDER } from '../biz';
import { RPN_PLAN_PROVIDER } from '../rpn-plan';
import { WH_PROVIDER } from '../wh';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('WH_CONTROLLER', () => {
    let poolService: PostgresPoolService;
    let whControllerTestService: WhControllerTestService

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
				...RPN_PLAN_PROVIDER,
				...WH_PROVIDER,
                ...WH_CONTROLLER_PROVIDER,
                WhControllerTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whControllerTestService = app.get<WhControllerTestService>(WhControllerTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WH_CONTROLLER <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            const res = await whControllerTestService.createTestData(bid, brid);
            console.log(res);
            expect(true).toBe(true)
        })
    })

});