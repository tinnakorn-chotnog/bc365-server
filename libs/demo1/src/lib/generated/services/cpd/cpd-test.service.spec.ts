import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CPD_PROVIDER } from './cpd.provider';
import { CpdTestService } from './cpd-test.service'
import { BIZ_PROVIDER } from '../biz';
import { CPD_STORAGE_PROVIDER } from '../cpd-storage';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('CPD', () => {
    let poolService: PostgresPoolService;
    let cpdTestService: CpdTestService

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
				...CPD_STORAGE_PROVIDER,
                ...CPD_PROVIDER,
                CpdTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        cpdTestService = app.get<CpdTestService>(CpdTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CPD <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});