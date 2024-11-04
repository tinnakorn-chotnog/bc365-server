import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { SKILL_PROVIDER } from './skill.provider';
import { SkillTestService } from './skill-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('SKILL', () => {
    let poolService: PostgresPoolService;
    let skillTestService: SkillTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...SKILL_PROVIDER,
                SkillTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        skillTestService = app.get<SkillTestService>(SkillTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('SKILL <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});