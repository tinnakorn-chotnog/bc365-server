import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { SHIPPING_CARRIER_PROVIDER } from './shipping-carrier.provider';
import { ShippingCarrierTestService } from './shipping-carrier-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_SO_PROVIDER } from '../doc-so';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('SHIPPING_CARRIER', () => {
    let poolService: PostgresPoolService;
    let shippingCarrierTestService: ShippingCarrierTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
				ConfigModule.forRoot({
					envFilePath: ['.test.env'],
					isGlobal: true,
					validationSchema: Joi.object(configSchema)
				}),
			],
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_SO_PROVIDER,
                ...SHIPPING_CARRIER_PROVIDER,
                ShippingCarrierTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        shippingCarrierTestService = app.get<ShippingCarrierTestService>(ShippingCarrierTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('SHIPPING_CARRIER <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});