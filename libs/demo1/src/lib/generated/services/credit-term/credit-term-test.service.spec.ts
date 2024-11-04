import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CREDIT_TERM_PROVIDER } from './credit-term.provider';
import { CreditTermTestService } from './credit-term-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('CREDIT_TERM', () => {
    let poolService: PostgresPoolService;
    let creditTermTestService: CreditTermTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...CREDIT_TERM_PROVIDER,
                CreditTermTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        creditTermTestService = app.get<CreditTermTestService>(CreditTermTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CREDIT_TERM <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});