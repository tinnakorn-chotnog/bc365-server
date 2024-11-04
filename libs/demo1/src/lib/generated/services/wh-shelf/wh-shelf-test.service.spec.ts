import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_SHELF_PROVIDER } from './wh-shelf.provider';
import { WhShelfTestService } from './wh-shelf-test.service'
import { BIZ_PROVIDER } from '../biz';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { PD_LOT_STORAGE_PROVIDER } from '../pd-lot-storage';

jest.setTimeout(5000000);

describe('WH_SHELF', () => {
    let poolService: PostgresPoolService;
    let whShelfTestService: WhShelfTestService

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
				...PD_STORAGE_PROVIDER,
				...PD_LOT_STORAGE_PROVIDER,
                ...WH_SHELF_PROVIDER,
                WhShelfTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whShelfTestService = app.get<WhShelfTestService>(WhShelfTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WH_SHELF <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});