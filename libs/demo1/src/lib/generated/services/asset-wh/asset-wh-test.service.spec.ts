import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { ASSET_WH_PROVIDER } from './asset-wh.provider';
import { AssetWhTestService } from './asset-wh-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('ASSET_WH', () => {
    let poolService: PostgresPoolService;
    let assetWhTestService: AssetWhTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...ASSET_WH_PROVIDER,
                AssetWhTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        assetWhTestService = app.get<AssetWhTestService>(AssetWhTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('ASSET_WH <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});