import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { ASSET_PROVIDER } from './asset.provider';
import { AssetTestService } from './asset-test.service'
import { BIZ_PROVIDER } from '../biz';
import { RTP_PROVIDER } from '../rtp';
import { DOC_ARC_ITEM_PROVIDER } from '../doc-arc-item';
import { ASSET_STORAGE_PROVIDER } from '../asset-storage';
import { DOC_NAR_ITEM_PROVIDER } from '../doc-nar-item';
import { ASSET_BRANCH_PROVIDER } from '../asset-branch';
import { DOC_ARR_ITEM_PROVIDER } from '../doc-arr-item';
import { ASSET_WH_PROVIDER } from '../asset-wh';

jest.setTimeout(5000000);

describe('ASSET', () => {
    let poolService: PostgresPoolService;
    let assetTestService: AssetTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...RTP_PROVIDER,
				...DOC_ARC_ITEM_PROVIDER,
				...ASSET_STORAGE_PROVIDER,
				...DOC_NAR_ITEM_PROVIDER,
				...ASSET_BRANCH_PROVIDER,
				...DOC_ARR_ITEM_PROVIDER,
				...ASSET_WH_PROVIDER,
                ...ASSET_PROVIDER,
                AssetTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        assetTestService = app.get<AssetTestService>(AssetTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('ASSET <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});