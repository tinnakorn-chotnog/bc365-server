import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { RESTA_OPTION_GROUP_PROVIDER } from './resta-option-group.provider';
import { RestaOptionGroupTestService } from './resta-option-group-test.service'
import { BIZ_PROVIDER } from '../biz';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('RESTA_OPTION_GROUP', () => {
    let poolService: PostgresPoolService;
    let restaOptionGroupTestService: RestaOptionGroupTestService

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
                ...RESTA_OPTION_GROUP_PROVIDER,
                RestaOptionGroupTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        restaOptionGroupTestService = app.get<RestaOptionGroupTestService>(RestaOptionGroupTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('RESTA_OPTION_GROUP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});