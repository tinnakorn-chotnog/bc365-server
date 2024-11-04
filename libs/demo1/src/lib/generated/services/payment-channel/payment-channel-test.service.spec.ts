import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PAYMENT_CHANNEL_PROVIDER } from './payment-channel.provider';
import { PaymentChannelTestService } from './payment-channel-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_RECEIPT_PROVIDER } from '../doc-receipt';

jest.setTimeout(5000000);

describe('PAYMENT_CHANNEL', () => {
    let poolService: PostgresPoolService;
    let paymentChannelTestService: PaymentChannelTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_RECEIPT_PROVIDER,
                ...PAYMENT_CHANNEL_PROVIDER,
                PaymentChannelTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        paymentChannelTestService = app.get<PaymentChannelTestService>(PaymentChannelTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PAYMENT_CHANNEL <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});