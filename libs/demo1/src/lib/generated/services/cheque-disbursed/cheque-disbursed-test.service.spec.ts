import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CHEQUE_DISBURSED_PROVIDER } from './cheque-disbursed.provider';
import { ChequeDisbursedTestService } from './cheque-disbursed-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('CHEQUE_DISBURSED', () => {
    let poolService: PostgresPoolService;
    let chequeDisbursedTestService: ChequeDisbursedTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...CHEQUE_DISBURSED_PROVIDER,
                ChequeDisbursedTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        chequeDisbursedTestService = app.get<ChequeDisbursedTestService>(ChequeDisbursedTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CHEQUE_DISBURSED <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});