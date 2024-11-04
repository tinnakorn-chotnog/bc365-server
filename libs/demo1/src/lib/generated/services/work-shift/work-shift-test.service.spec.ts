import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WORK_SHIFT_PROVIDER } from './work-shift.provider';
import { WorkShiftTestService } from './work-shift-test.service'
import { BIZ_PROVIDER } from '../biz';
import { WH_STAFF_PROVIDER } from '../wh-staff';
import { DOC_PL_PROVIDER } from '../doc-pl';

jest.setTimeout(5000000);

describe('WORK_SHIFT', () => {
    let poolService: PostgresPoolService;
    let workShiftTestService: WorkShiftTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...WH_STAFF_PROVIDER,
				...DOC_PL_PROVIDER,
                ...WORK_SHIFT_PROVIDER,
                WorkShiftTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        workShiftTestService = app.get<WorkShiftTestService>(WorkShiftTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WORK_SHIFT <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});