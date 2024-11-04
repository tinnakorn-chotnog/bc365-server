import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { RESV_TYPE_PROVIDER } from './resv-type.provider';
import { ResvTypeTestService } from './resv-type-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_ORESV_PROVIDER } from '../doc-oresv';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('RESV_TYPE', () => {
    let poolService: PostgresPoolService;
    let resvTypeTestService: ResvTypeTestService

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
				...DOC_ORESV_PROVIDER,
                ...RESV_TYPE_PROVIDER,
                ResvTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        resvTypeTestService = app.get<ResvTypeTestService>(ResvTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('RESV_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});