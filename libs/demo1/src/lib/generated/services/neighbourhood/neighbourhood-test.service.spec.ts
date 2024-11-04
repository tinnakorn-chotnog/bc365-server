import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { NEIGHBOURHOOD_PROVIDER } from './neighbourhood.provider';
import { NeighbourhoodTestService } from './neighbourhood-test.service'
import { BIZ_PROVIDER } from '../biz';
import { WH_STORAGE_PROVIDER } from '../wh-storage';

jest.setTimeout(5000000);

describe('NEIGHBOURHOOD', () => {
    let poolService: PostgresPoolService;
    let neighbourhoodTestService: NeighbourhoodTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...WH_STORAGE_PROVIDER,
                ...NEIGHBOURHOOD_PROVIDER,
                NeighbourhoodTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        neighbourhoodTestService = app.get<NeighbourhoodTestService>(NeighbourhoodTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('NEIGHBOURHOOD <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});