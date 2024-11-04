import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_CATE_PROVIDER } from '../pd-cate';
import { PD_SUBCATE_PROVIDER } from './pd-subcate.provider';
import { PdSubcateTestService } from './pd-subcate-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_PROVIDER } from '../pd';
import { ASSET_PROVIDER } from '../asset';
import { PD_VARIANT_GROUP_PROVIDER } from '../pd-variant-group';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PD_SUBCATE', () => {
    let poolService: PostgresPoolService;
    let pdSubcateTestService: PdSubcateTestService

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
				...PD_PROVIDER,
				...ASSET_PROVIDER,
				...PD_VARIANT_GROUP_PROVIDER,
                ...PD_SUBCATE_PROVIDER,
                ...PD_CATE_PROVIDER,
                PdSubcateTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdSubcateTestService = app.get<PdSubcateTestService>(PdSubcateTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_SUBCATE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            const res = await pdSubcateTestService.createTestData(bid, brid)
            expect(true).toBe(true)
        })
    })

});