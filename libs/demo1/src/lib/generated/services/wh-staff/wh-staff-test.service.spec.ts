import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_STAFF_PROVIDER } from './wh-staff.provider';
import { WhStaffTestService } from './wh-staff-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_PL_PROVIDER } from '../doc-pl';
import { DOC_PL_PD_PROVIDER } from '../doc-pl-pd';

jest.setTimeout(5000000);

describe('WH_STAFF', () => {
    let poolService: PostgresPoolService;
    let whStaffTestService: WhStaffTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_PL_PROVIDER,
				...DOC_PL_PD_PROVIDER,
                ...WH_STAFF_PROVIDER,
                WhStaffTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whStaffTestService = app.get<WhStaffTestService>(WhStaffTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WH_STAFF <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});