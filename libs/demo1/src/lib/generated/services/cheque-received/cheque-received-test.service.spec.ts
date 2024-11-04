import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CHEQUE_RECEIVED_PROVIDER } from './cheque-received.provider';
import { ChequeReceivedTestService } from './cheque-received-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('CHEQUE_RECEIVED', () => {
    let poolService: PostgresPoolService;
    let chequeReceivedTestService: ChequeReceivedTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...CHEQUE_RECEIVED_PROVIDER,
                ChequeReceivedTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        chequeReceivedTestService = app.get<ChequeReceivedTestService>(ChequeReceivedTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CHEQUE_RECEIVED <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});