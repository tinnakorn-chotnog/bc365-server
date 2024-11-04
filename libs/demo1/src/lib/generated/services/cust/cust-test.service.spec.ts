import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CUST_PROVIDER } from './cust.provider';
import { CustTestService } from './cust-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_CUST_PROVIDER } from '../pd-cust';
import { DOC_ARIV_PROVIDER } from '../doc-ariv';
import { CHEQUE_DISBURSED_PROVIDER } from '../cheque-disbursed';
import { CHEQUE_RECEIVED_PROVIDER } from '../cheque-received';
import { DOC_SHIP_PROVIDER } from '../doc-ship';
import { DOC_POS_PROVIDER } from '../doc-pos';
import { DOC_ARC_PROVIDER } from '../doc-arc';
import { DOC_SO_PROVIDER } from '../doc-so';
import { DOC_CRJ_PROVIDER } from '../doc-crj';
import { DOC_RECEIPT_PROVIDER } from '../doc-receipt';
import { DOC_PL_PROVIDER } from '../doc-pl';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { DOC_DSO_PROVIDER } from '../doc-dso';

jest.setTimeout(5000000);

describe('CUST', () => {
    let poolService: PostgresPoolService;
    let custTestService: CustTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...PD_CUST_PROVIDER,
				...DOC_ARIV_PROVIDER,
				...CHEQUE_DISBURSED_PROVIDER,
				...CHEQUE_RECEIVED_PROVIDER,
				...DOC_SHIP_PROVIDER,
				...DOC_POS_PROVIDER,
				...DOC_ARC_PROVIDER,
				...DOC_SO_PROVIDER,
				...DOC_CRJ_PROVIDER,
				...DOC_RECEIPT_PROVIDER,
				...DOC_PL_PROVIDER,
				...WH_STORAGE_PROVIDER,
				...DOC_DSO_PROVIDER,
                ...CUST_PROVIDER,
                CustTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        custTestService = app.get<CustTestService>(CustTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CUST <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});