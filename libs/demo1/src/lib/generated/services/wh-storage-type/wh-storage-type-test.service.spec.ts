import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_STORAGE_TYPE_PROVIDER } from './wh-storage-type.provider';
import { WhStorageTypeTestService } from './wh-storage-type-test.service'
import { BIZ_PROVIDER } from '../biz';
import { WH_STORAGE_PROVIDER } from '../wh-storage';

jest.setTimeout(5000000);

describe('WH_STORAGE_TYPE', () => {
    let poolService: PostgresPoolService;
    let whStorageTypeTestService: WhStorageTypeTestService

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
                ...WH_STORAGE_TYPE_PROVIDER,
                WhStorageTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whStorageTypeTestService = app.get<WhStorageTypeTestService>(WhStorageTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WH_STORAGE_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});