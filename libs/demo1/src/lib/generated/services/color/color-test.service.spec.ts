import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { COLOR_PROVIDER } from './color.provider';
import { ColorTestService } from './color-test.service'
import { BIZ_PROVIDER } from '../biz';
import { ASSET_PROVIDER } from '../asset';

jest.setTimeout(5000000);

describe('COLOR', () => {
    let poolService: PostgresPoolService;
    let colorTestService: ColorTestService

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
                ...COLOR_PROVIDER,
                ColorTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        colorTestService = app.get<ColorTestService>(ColorTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('COLOR <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});