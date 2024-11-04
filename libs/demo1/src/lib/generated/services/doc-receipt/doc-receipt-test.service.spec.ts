import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_RECEIPT_PROVIDER } from './doc-receipt.provider';
import { DocReceiptTestService } from './doc-receipt-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('DOC_RECEIPT', () => {
    let poolService: PostgresPoolService;
    let docReceiptTestService: DocReceiptTestService

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
                DocReceiptTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docReceiptTestService = app.get<DocReceiptTestService>(DocReceiptTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_RECEIPT <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});