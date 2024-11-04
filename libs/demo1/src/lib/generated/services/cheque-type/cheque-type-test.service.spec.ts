import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CHEQUE_TYPE_PROVIDER } from './cheque-type.provider';
import { ChequeTypeTestService } from './cheque-type-test.service'
import { BIZ_PROVIDER } from '../biz';
import { CHEQUE_DISBURSED_PROVIDER } from '../cheque-disbursed';
import { CHEQUE_RECEIVED_PROVIDER } from '../cheque-received';

jest.setTimeout(5000000);

describe('CHEQUE_TYPE', () => {
    let poolService: PostgresPoolService;
    let chequeTypeTestService: ChequeTypeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...CHEQUE_DISBURSED_PROVIDER,
				...CHEQUE_RECEIVED_PROVIDER,
                ...CHEQUE_TYPE_PROVIDER,
                ChequeTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        chequeTypeTestService = app.get<ChequeTypeTestService>(ChequeTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CHEQUE_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});