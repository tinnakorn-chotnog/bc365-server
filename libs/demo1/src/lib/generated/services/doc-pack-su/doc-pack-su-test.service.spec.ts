import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_PACK_SU_PROVIDER } from './doc-pack-su.provider';
import { DocPackSuTestService } from './doc-pack-su-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_PICK_ORD_ITEM_PROVIDER } from '../doc-pick-ord-item';
import { DOC_PACK_PD_PROVIDER } from '../doc-pack-pd';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('DOC_PACK_SU', () => {
    let poolService: PostgresPoolService;
    let docPackSuTestService: DocPackSuTestService

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
				...DOC_PICK_ORD_ITEM_PROVIDER,
				...DOC_PACK_PD_PROVIDER,
                ...DOC_PACK_SU_PROVIDER,
                DocPackSuTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docPackSuTestService = app.get<DocPackSuTestService>(DocPackSuTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_PACK_SU <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});