import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_BAL_PROVIDER } from './pd-bal.provider';
import { PdBalTestService } from './pd-bal-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('PD_BAL', () => {
    let poolService: PostgresPoolService;
    let pdBalTestService: PdBalTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...PD_BAL_PROVIDER,
                PdBalTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdBalTestService = app.get<PdBalTestService>(PdBalTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_BAL <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});