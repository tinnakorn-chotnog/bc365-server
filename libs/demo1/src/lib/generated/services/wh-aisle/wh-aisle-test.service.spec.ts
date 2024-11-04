import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_AISLE_PROVIDER } from './wh-aisle.provider';
import { WhAisleTestService } from './wh-aisle-test.service'
import { BIZ_PROVIDER } from '../biz';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { WH_RACK_PROVIDER } from '../wh-rack';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { PD_LOT_STORAGE_PROVIDER } from '../pd-lot-storage';
import { NEIGHBOURHOOD_PROVIDER } from '../neighbourhood';
import { DOC_PL_ROUTE_PROVIDER } from '../doc-pl-route';
import { WH_HU_PROVIDER } from '../wh-hu';
import { WH_SU_PROVIDER } from '../wh-su';

jest.setTimeout(5000000);

describe('WH_AISLE', () => {
    let poolService: PostgresPoolService;
    let whAisleTestService: WhAisleTestService

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
				...WH_RACK_PROVIDER,
				...PD_STORAGE_PROVIDER,
				...PD_LOT_STORAGE_PROVIDER,
				...NEIGHBOURHOOD_PROVIDER,
				...DOC_PL_ROUTE_PROVIDER,
				...WH_HU_PROVIDER,
				...WH_SU_PROVIDER,
                ...WH_AISLE_PROVIDER,
                WhAisleTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whAisleTestService = app.get<WhAisleTestService>(WhAisleTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WH_AISLE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});