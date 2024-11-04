import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { ASSET_BRANCH_PROVIDER } from './asset-branch.provider';
import { AssetBranchTestService } from './asset-branch-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('ASSET_BRANCH', () => {
    let poolService: PostgresPoolService;
    let assetBranchTestService: AssetBranchTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...ASSET_BRANCH_PROVIDER,
                AssetBranchTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        assetBranchTestService = app.get<AssetBranchTestService>(AssetBranchTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('ASSET_BRANCH <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});