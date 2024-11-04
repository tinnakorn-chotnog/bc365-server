import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PAYMENT_METHOD_PROVIDER } from './payment-method.provider';
import { PaymentMethodTestService } from './payment-method-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('PAYMENT_METHOD', () => {
    let poolService: PostgresPoolService;
    let paymentMethodTestService: PaymentMethodTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...PAYMENT_METHOD_PROVIDER,
                PaymentMethodTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        paymentMethodTestService = app.get<PaymentMethodTestService>(PaymentMethodTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PAYMENT_METHOD <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});