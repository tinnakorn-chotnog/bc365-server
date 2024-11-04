import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { SALES_CHANNEL_PROVIDER } from './sales-channel.provider';
import { SalesChannelTestService } from './sales-channel-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_SO_PROVIDER } from '../doc-so';

jest.setTimeout(5000000);

describe('SALES_CHANNEL', () => {
    let poolService: PostgresPoolService;
    let salesChannelTestService: SalesChannelTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_SO_PROVIDER,
                ...SALES_CHANNEL_PROVIDER,
                SalesChannelTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        salesChannelTestService = app.get<SalesChannelTestService>(SalesChannelTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('SALES_CHANNEL <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});