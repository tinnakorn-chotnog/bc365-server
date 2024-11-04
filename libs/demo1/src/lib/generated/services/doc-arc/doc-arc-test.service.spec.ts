import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_ARC_PROVIDER } from './doc-arc.provider';
import { DocArcTestService } from './doc-arc-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_ARC_ITEM_PROVIDER } from '../doc-arc-item';
import { DOC_ARR_PROVIDER } from '../doc-arr';

jest.setTimeout(5000000);

describe('DOC_ARC', () => {
    let poolService: PostgresPoolService;
    let docArcTestService: DocArcTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_ARC_ITEM_PROVIDER,
				...DOC_ARR_PROVIDER,
                ...DOC_ARC_PROVIDER,
                DocArcTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docArcTestService = app.get<DocArcTestService>(DocArcTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_ARC <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});