import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PAYMENT_CONDITION_PROVIDER } from './payment-condition.provider';
import { PaymentConditionTestService } from './payment-condition-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_ARC_PROVIDER } from '../doc-arc';

jest.setTimeout(5000000);

describe('PAYMENT_CONDITION', () => {
    let poolService: PostgresPoolService;
    let paymentConditionTestService: PaymentConditionTestService

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
                ...PAYMENT_CONDITION_PROVIDER,
                PaymentConditionTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        paymentConditionTestService = app.get<PaymentConditionTestService>(PaymentConditionTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PAYMENT_CONDITION <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});