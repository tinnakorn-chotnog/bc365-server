import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PROP_SERVICE_ITEM_PROVIDER } from './prop-service-item.provider';
import { PropServiceItemTestService } from './prop-service-item-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PROP_SERVICE_UNIT_ITEM_PROVIDER } from '../prop-service-unit-item';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PROP_SERVICE_ITEM', () => {
    let poolService: PostgresPoolService;
    let propServiceItemTestService: PropServiceItemTestService

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
				...PROP_SERVICE_UNIT_ITEM_PROVIDER,
                ...PROP_SERVICE_ITEM_PROVIDER,
                PropServiceItemTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        propServiceItemTestService = app.get<PropServiceItemTestService>(PropServiceItemTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PROP_SERVICE_ITEM <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});