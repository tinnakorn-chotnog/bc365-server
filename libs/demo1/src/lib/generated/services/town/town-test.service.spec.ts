import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { TOWN_PROVIDER } from './town.provider';
import { TownTestService } from './town-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('TOWN', () => {
    let poolService: PostgresPoolService;
    let townTestService: TownTestService

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
                TownTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        townTestService = app.get<TownTestService>(TownTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('TOWN <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});