import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_STORAGE_BAL_PROVIDER } from './pd-storage-bal.provider';
import { PdStorageBalTestService } from './pd-storage-bal-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('PD_STORAGE_BAL', () => {
    let poolService: PostgresPoolService;
    let pdStorageBalTestService: PdStorageBalTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...PD_STORAGE_BAL_PROVIDER,
                PdStorageBalTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdStorageBalTestService = app.get<PdStorageBalTestService>(PdStorageBalTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_STORAGE_BAL <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});