import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { RESTA_TABLE_TYPE_PROVIDER } from './resta-table-type.provider';
import { RestaTableTypeTestService } from './resta-table-type-test.service'
import { BIZ_PROVIDER } from '../biz';
import { RESTA_TABLE_PROVIDER } from '../resta-table';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('RESTA_TABLE_TYPE', () => {
    let poolService: PostgresPoolService;
    let restaTableTypeTestService: RestaTableTypeTestService

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
				...RESTA_TABLE_PROVIDER,
                ...RESTA_TABLE_TYPE_PROVIDER,
                RestaTableTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        restaTableTypeTestService = app.get<RestaTableTypeTestService>(RestaTableTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('RESTA_TABLE_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});