import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CHAT_BOX_PROVIDER } from './chat-box.provider';
import { ChatBoxTestService } from './chat-box-test.service'
import { BIZ_PROVIDER } from '../biz';
import { CHAT_MESSAGE_PROVIDER } from '../chat-message';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('CHAT_BOX', () => {
    let poolService: PostgresPoolService;
    let chatBoxTestService: ChatBoxTestService

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
				...CHAT_MESSAGE_PROVIDER,
                ...CHAT_BOX_PROVIDER,
                ChatBoxTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        chatBoxTestService = app.get<ChatBoxTestService>(ChatBoxTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CHAT_BOX <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});