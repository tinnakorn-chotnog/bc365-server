import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { BANK_PROVIDER } from './bank.provider';
import { BankTestService } from './bank-test.service'
import { BIZ_PROVIDER } from '../biz';
import { CHEQUE_DISBURSED_PROVIDER } from '../cheque-disbursed';
import { CHEQUE_RECEIVED_PROVIDER } from '../cheque-received';
import { BANK_ACCOUNT_PROVIDER } from '../bank-account';

jest.setTimeout(5000000);

describe('BANK', () => {
    let poolService: PostgresPoolService;
    let bankTestService: BankTestService

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
				...CHEQUE_RECEIVED_PROVIDER,
				...BANK_ACCOUNT_PROVIDER,
                ...BANK_PROVIDER,
                BankTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        bankTestService = app.get<BankTestService>(BankTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('BANK <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});