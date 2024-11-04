import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CARD_TYPE_PROVIDER } from './card-type.provider';
import { CardTypeTestService } from './card-type-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('CARD_TYPE', () => {
    let poolService: PostgresPoolService;
    let cardTypeTestService: CardTypeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...CARD_TYPE_PROVIDER,
                CardTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        cardTypeTestService = app.get<CardTypeTestService>(CardTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CARD_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});