import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { SUPP_PROVIDER } from './supp.provider';
import { SuppTestService } from './supp-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_SUPP_PROVIDER } from '../pd-supp';
import { DOC_GRN_PROVIDER } from '../doc-grn';
import { DOC_APIV_PROVIDER } from '../doc-apiv';
import { CHEQUE_RECEIVED_PROVIDER } from '../cheque-received';
import { CHEQUE_DISBURSED_PROVIDER } from '../cheque-disbursed';
import { DOC_PO_PROVIDER } from '../doc-po';
import { DOC_CDJ_PROVIDER } from '../doc-cdj';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { DOC_DSO_PROVIDER } from '../doc-dso';
import { PD_PROVIDER } from '../pd';

jest.setTimeout(5000000);

describe('SUPP', () => {
    let poolService: PostgresPoolService;
    let suppTestService: SuppTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...PD_SUPP_PROVIDER,
				...DOC_GRN_PROVIDER,
				...DOC_APIV_PROVIDER,
				...CHEQUE_RECEIVED_PROVIDER,
				...CHEQUE_DISBURSED_PROVIDER,
				...DOC_PO_PROVIDER,
				...DOC_CDJ_PROVIDER,
				...WH_STORAGE_PROVIDER,
				...DOC_DSO_PROVIDER,
				...PD_PROVIDER,
                ...SUPP_PROVIDER,
                SuppTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        suppTestService = app.get<SuppTestService>(SuppTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('SUPP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});