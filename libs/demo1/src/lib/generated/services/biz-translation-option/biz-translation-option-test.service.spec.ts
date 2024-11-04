import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { BIZ_TRANSLATION_OPTION_PROVIDER } from './biz-translation-option.provider';
import { BizTranslationOptionTestService } from './biz-translation-option-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('BIZ_TRANSLATION_OPTION', () => {
    let poolService: PostgresPoolService;
    let bizTranslationOptionTestService: BizTranslationOptionTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...BIZ_TRANSLATION_OPTION_PROVIDER,
                BizTranslationOptionTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        bizTranslationOptionTestService = app.get<BizTranslationOptionTestService>(BizTranslationOptionTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('BIZ_TRANSLATION_OPTION <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});