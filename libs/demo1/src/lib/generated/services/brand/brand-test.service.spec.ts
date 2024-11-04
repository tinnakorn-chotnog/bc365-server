import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { BRAND_PROVIDER } from './brand.provider';
import { BrandTestService } from './brand-test.service'
import { BIZ_PROVIDER } from '../biz';
import { ASSET_PROVIDER } from '../asset';

jest.setTimeout(5000000);

describe('BRAND', () => {
    let poolService: PostgresPoolService;
    let brandTestService: BrandTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...ASSET_PROVIDER,
                ...BRAND_PROVIDER,
                BrandTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        brandTestService = app.get<BrandTestService>(BrandTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('BRAND <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});