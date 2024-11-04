import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DSP_PROVIDER } from './dsp.provider';
import { DspTestService } from './dsp-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_SO_PROVIDER } from '../doc-so';

jest.setTimeout(5000000);

describe('DSP', () => {
    let poolService: PostgresPoolService;
    let dspTestService: DspTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_SO_PROVIDER,
                ...DSP_PROVIDER,
                DspTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        dspTestService = app.get<DspTestService>(DspTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DSP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});