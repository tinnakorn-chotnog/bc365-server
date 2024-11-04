import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DELIVERY_METHOD_PROVIDER } from './delivery-method.provider';
import { DeliveryMethodTestService } from './delivery-method-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_ARC_PROVIDER } from '../doc-arc';

jest.setTimeout(5000000);

describe('DELIVERY_METHOD', () => {
    let poolService: PostgresPoolService;
    let deliveryMethodTestService: DeliveryMethodTestService

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
                ...DELIVERY_METHOD_PROVIDER,
                DeliveryMethodTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        deliveryMethodTestService = app.get<DeliveryMethodTestService>(DeliveryMethodTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DELIVERY_METHOD <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});