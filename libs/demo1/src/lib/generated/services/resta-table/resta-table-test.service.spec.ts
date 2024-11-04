import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { RESTA_TABLE_PROVIDER } from './resta-table.provider';
import { RestaTableTestService } from './resta-table-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_RESTA_ORD_PROVIDER } from '../doc-resta-ord';
import { KITCHEN_ORD_PROVIDER } from '../kitchen-ord';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('RESTA_TABLE', () => {
    let poolService: PostgresPoolService;
    let restaTableTestService: RestaTableTestService

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
				...DOC_RESTA_ORD_PROVIDER,
				...KITCHEN_ORD_PROVIDER,
                ...RESTA_TABLE_PROVIDER,
                RestaTableTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        restaTableTestService = app.get<RestaTableTestService>(RestaTableTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('RESTA_TABLE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});