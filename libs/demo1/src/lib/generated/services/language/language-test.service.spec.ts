import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { LANGUAGE_PROVIDER } from './language.provider';
import { LanguageTestService } from './language-test.service'
import { BIZ_PROVIDER } from '../biz';
import { TRANSLATION_OPTION_PROVIDER } from '../translation-option';
import { BIZ_LANGUAGE_PROVIDER } from '../biz-language';
import { COUNTRY_TRANSLATION_OPTION_PROVIDER } from '../country-translation-option';
import { BIZ_TRANSLATION_OPTION_PROVIDER } from '../biz-translation-option';

jest.setTimeout(5000000);

describe('LANGUAGE', () => {
    let poolService: PostgresPoolService;
    let languageTestService: LanguageTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...TRANSLATION_OPTION_PROVIDER,
				...BIZ_LANGUAGE_PROVIDER,
				...COUNTRY_TRANSLATION_OPTION_PROVIDER,
				...BIZ_TRANSLATION_OPTION_PROVIDER,
                ...LANGUAGE_PROVIDER,
                LanguageTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        languageTestService = app.get<LanguageTestService>(LanguageTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('LANGUAGE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});