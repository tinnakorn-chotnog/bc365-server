import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_SO_PROVIDER } from './doc-so.provider';
import { DocSoTestService } from './doc-so-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_SHIP_PROVIDER } from '../doc-ship';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { PD_PROVIDER } from '../pd';
import { PD_WH_PROVIDER } from '../pd-wh';
import { PD_BRANCH_PROVIDER } from '../pd-branch';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { BRANCH_PROVIDER } from '../branch';
import { keyBy } from 'lodash';
import { PD_CATE_PROVIDER } from '../pd-cate';
import { DOC_PFFM_PROVIDER } from '../doc-pffm';
import { CUST_PROVIDER } from '../cust';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('DOC_SO', () => {
    let poolService: PostgresPoolService;
    let docSoTestService: DocSoTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';
    const whId = '9uHqwBGVKa8WHAZmrwWtEY';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
				ConfigModule.forRoot({
					envFilePath: ['.test.env'],
					isGlobal: true,
					validationSchema: Joi.object(configSchema)
				}),
			],
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...BRANCH_PROVIDER,
				...DOC_SHIP_PROVIDER,
                ...DOC_SO_PROVIDER,
                ...DOC_PFFM_PROVIDER,
                ...PD_PROVIDER,
                ...PD_CATE_PROVIDER,
                ...PD_WH_PROVIDER,
                ...PD_BRANCH_PROVIDER,
                ...PD_STORAGE_PROVIDER,
                ...CUST_PROVIDER,
                DocSoTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docSoTestService = app.get<DocSoTestService>(DocSoTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })

    describe('DOC_SO <test case group description>', () => {
        it('#1.1 Create Test Data', async () => {
            const res = await docSoTestService.createDocSo(bid, brid, whId)
            expect(true).toBe(true)
        })
        it('#1.2 Get branch backlog', async () => {
            const res = await docSoTestService.getAccumSoPd({ bid, brid });
            console.log(JSON.stringify(res, null, 2))
            expect(true).toBe(true)
        })
        it('#1.2 Check Availability', async () => {
            const res = await docSoTestService.checkAvailabity({ bid, brid });
            console.log(JSON.stringify(res, null, 2))
            expect(true).toBe(true)
        })
        it('#1.2 Test branch exception', async () => {
            const accumPds = await docSoTestService.getAccumSoPd({ bid, brid });
            const pdIds = accumPds.map( pd => pd.pdId );
            const pdBranchs = await docSoTestService.pdBranchService.get({ bid, brid, filter: { _in: { pdId: pdIds }}});
            const pdBranchMap = keyBy(pdBranchs, 'pdId');
            const pdb0 = pdBranchMap[accumPds[0].pdId]
            const pdb1 = pdBranchMap[accumPds[1].pdId]
            accumPds[0].orderedQty = pdb0.ohQty + 2;
            accumPds[1].orderedQty = pdb1.ohQty + 2;
            const res = await docSoTestService.checkAvailabity({ bid, brid, accumPds });
            console.log(JSON.stringify(res, null, 2))
            expect(true).toBe(true)
        })
        it('#1.10 Process Cate', async () => {
            try {
                const res = await docSoTestService.processCateCount({ bid, brid });
                console.log(res)
            } catch(e) {
                console.log(e)
            }
        })
        it('#1.10 Update partnername', async () => {
            try {
                const res = await docSoTestService.updatePartnerName({ bid, brid });
                console.log(res)
            } catch(e) {
                console.log(e)
            }
        })
        it('#1.10 Create Prefulfillment', async () => {
            try {
                const res = await docSoTestService.createDocPffm({ bid, brid });
                console.log(res)
            } catch(e) {
                console.log(e)
            }
        })
    })

});
