import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_EQM_PROVIDER } from './wh-eqm.provider';
import { WhEqmTestService } from './wh-eqm-test.service'
import { BIZ_PROVIDER } from '../biz';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { DOC_PL_WO_PROVIDER } from '../doc-pl-wo';

jest.setTimeout(5000000);

describe('WH_EQM', () => {
    let poolService: PostgresPoolService;
    let whEqmTestService: WhEqmTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...WH_STORAGE_PROVIDER,
				...DOC_PL_WO_PROVIDER,
                ...WH_EQM_PROVIDER,
                WhEqmTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whEqmTestService = app.get<WhEqmTestService>(WhEqmTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WH_EQM <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});