import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PAYMENT_GATEWAY_PROVIDER } from './payment-gateway.provider';
import { PaymentGatewayTestService } from './payment-gateway-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('PAYMENT_GATEWAY', () => {
    let poolService: PostgresPoolService;
    let paymentGatewayTestService: PaymentGatewayTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...PAYMENT_GATEWAY_PROVIDER,
                PaymentGatewayTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        paymentGatewayTestService = app.get<PaymentGatewayTestService>(PaymentGatewayTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PAYMENT_GATEWAY <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});