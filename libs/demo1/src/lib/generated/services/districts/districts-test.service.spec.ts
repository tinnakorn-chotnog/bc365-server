import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DISTRICTS_PROVIDER } from './districts.provider';
import { DistrictsTestService } from './districts-test.service'
import { BIZ_PROVIDER } from '../biz';
import { TOWN_PROVIDER } from '../town';

jest.setTimeout(5000000);

describe('DISTRICTS', () => {
    let poolService: PostgresPoolService;
    let districtsTestService: DistrictsTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...TOWN_PROVIDER,
                ...DISTRICTS_PROVIDER,
                DistrictsTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        districtsTestService = app.get<DistrictsTestService>(DistrictsTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DISTRICTS <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});