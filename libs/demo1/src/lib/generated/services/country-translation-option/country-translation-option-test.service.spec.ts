import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { COUNTRY_TRANSLATION_OPTION_PROVIDER } from './country-translation-option.provider';
import { CountryTranslationOptionTestService } from './country-translation-option-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('COUNTRY_TRANSLATION_OPTION', () => {
    let poolService: PostgresPoolService;
    let countryTranslationOptionTestService: CountryTranslationOptionTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...COUNTRY_TRANSLATION_OPTION_PROVIDER,
                CountryTranslationOptionTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        countryTranslationOptionTestService = app.get<CountryTranslationOptionTestService>(CountryTranslationOptionTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('COUNTRY_TRANSLATION_OPTION <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});