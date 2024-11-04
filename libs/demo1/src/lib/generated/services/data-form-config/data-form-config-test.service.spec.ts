import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DATA_FORM_CONFIG_PROVIDER } from './data-form-config.provider';
import { DataFormConfigTestService } from './data-form-config-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('DATA_FORM_CONFIG', () => {
    let poolService: PostgresPoolService;
    let dataFormConfigTestService: DataFormConfigTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...DATA_FORM_CONFIG_PROVIDER,
                DataFormConfigTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        dataFormConfigTestService = app.get<DataFormConfigTestService>(DataFormConfigTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DATA_FORM_CONFIG <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});