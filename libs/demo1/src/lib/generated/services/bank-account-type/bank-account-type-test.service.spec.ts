import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { BANK_ACCOUNT_TYPE_PROVIDER } from './bank-account-type.provider';
import { BankAccountTypeTestService } from './bank-account-type-test.service'
import { BIZ_PROVIDER } from '../biz';
import { BANK_ACCOUNT_PROVIDER } from '../bank-account';

jest.setTimeout(5000000);

describe('BANK_ACCOUNT_TYPE', () => {
    let poolService: PostgresPoolService;
    let bankAccountTypeTestService: BankAccountTypeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...BANK_ACCOUNT_PROVIDER,
                ...BANK_ACCOUNT_TYPE_PROVIDER,
                BankAccountTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        bankAccountTypeTestService = app.get<BankAccountTypeTestService>(BankAccountTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('BANK_ACCOUNT_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});