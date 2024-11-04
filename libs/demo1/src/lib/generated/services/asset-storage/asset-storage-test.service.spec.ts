import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { ASSET_STORAGE_PROVIDER } from './asset-storage.provider';
import { AssetStorageTestService } from './asset-storage-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_ARC_ITEM_PROVIDER } from '../doc-arc-item';
import { DOC_ARR_ITEM_PROVIDER } from '../doc-arr-item';

jest.setTimeout(5000000);

describe('ASSET_STORAGE', () => {
    let poolService: PostgresPoolService;
    let assetStorageTestService: AssetStorageTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_ARC_ITEM_PROVIDER,
				...DOC_ARR_ITEM_PROVIDER,
                ...ASSET_STORAGE_PROVIDER,
                AssetStorageTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        assetStorageTestService = app.get<AssetStorageTestService>(AssetStorageTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('ASSET_STORAGE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});