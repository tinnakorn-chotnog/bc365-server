import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { COUNTRY_PROVIDER } from './country.provider';
import { CountryTestService } from './country-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PROVINCE_PROVIDER } from '../province';
import { DISTRICTS_PROVIDER } from '../districts';
import { COUNTRY_TRANSLATION_OPTION_PROVIDER } from '../country-translation-option';

jest.setTimeout(5000000);

describe('COUNTRY', () => {
    let poolService: PostgresPoolService;
    let countryTestService: CountryTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...PROVINCE_PROVIDER,
				...DISTRICTS_PROVIDER,
				...COUNTRY_TRANSLATION_OPTION_PROVIDER,
                ...COUNTRY_PROVIDER,
                CountryTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        countryTestService = app.get<CountryTestService>(CountryTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('COUNTRY <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});