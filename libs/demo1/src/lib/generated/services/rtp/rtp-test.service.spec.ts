import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { RTP_PROVIDER } from './rtp.provider';
import { RtpTestService } from './rtp-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('RTP', () => {
    let poolService: PostgresPoolService;
    let rtpTestService: RtpTestService

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
                RtpTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        rtpTestService = app.get<RtpTestService>(RtpTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('RTP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});