import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PERIOD_PROVIDER } from './period.provider';
import { PeriodTestService } from './period-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_ARC_PROVIDER } from '../doc-arc';
import { DOC_ARC_ITEM_PROVIDER } from '../doc-arc-item';
import { RTP_PROVIDER } from '../rtp';
import { DOC_ARR_ITEM_PROVIDER } from '../doc-arr-item';

jest.setTimeout(5000000);

describe('PERIOD', () => {
    let poolService: PostgresPoolService;
    let periodTestService: PeriodTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_ARC_PROVIDER,
				...DOC_ARC_ITEM_PROVIDER,
				...RTP_PROVIDER,
				...DOC_ARR_ITEM_PROVIDER,
                ...PERIOD_PROVIDER,
                PeriodTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        periodTestService = app.get<PeriodTestService>(PeriodTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PERIOD <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});