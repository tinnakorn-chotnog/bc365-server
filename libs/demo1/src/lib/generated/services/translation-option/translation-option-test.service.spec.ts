import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { TRANSLATION_OPTION_PROVIDER } from './translation-option.provider';
import { TranslationOptionTestService } from './translation-option-test.service'
import { BIZ_PROVIDER } from '../biz';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('TRANSLATION_OPTION', () => {
    let poolService: PostgresPoolService;
    let translationOptionTestService: TranslationOptionTestService

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
                ...TRANSLATION_OPTION_PROVIDER,
                TranslationOptionTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        translationOptionTestService = app.get<TranslationOptionTestService>(TranslationOptionTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('TRANSLATION_OPTION <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            const res = await translationOptionTestService.get({ bid: null, brid: null, filter: { languageId: 'g9wHXNaFjW3s2xKzUWZeYg'}})
            console.log(res);
            expect(true).toBe(true)
        })
    })

});