import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PROVINCE_PROVIDER } from './province.provider';
import { ProvinceTestService } from './province-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DISTRICTS_PROVIDER } from '../districts';

jest.setTimeout(5000000);

describe('PROVINCE', () => {
    let poolService: PostgresPoolService;
    let provinceTestService: ProvinceTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DISTRICTS_PROVIDER,
                ...PROVINCE_PROVIDER,
                ProvinceTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        provinceTestService = app.get<ProvinceTestService>(ProvinceTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PROVINCE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});