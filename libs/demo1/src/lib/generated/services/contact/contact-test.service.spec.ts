import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CONTACT_PROVIDER } from './contact.provider';
import { ContactTestService } from './contact-test.service'
import { BIZ_PROVIDER } from '../biz';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { USER_PROVIDER } from '../user';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('CONTACT', () => {
    let poolService: PostgresPoolService;
    let contactTestService: ContactTestService

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
                ...CONTACT_PROVIDER,
                ...USER_PROVIDER,
                ContactTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        contactTestService = app.get<ContactTestService>(ContactTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CONTACT <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            const res = await contactTestService.createTestUserData(bid, brid)
            expect(true).toBe(true)
        })
    })

});