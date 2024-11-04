import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_PO_PROVIDER } from './doc-po.provider';
import { DocPoTestService } from './doc-po-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_GRN_PROVIDER } from '../doc-grn';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { SUPP_PROVIDER } from '../supp';
import { PD_UOM_PROVIDER } from '../pd-uom';
import { WH_PROVIDER } from '../wh';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { PD_WH_PROVIDER } from '../pd-wh';
import { WH_SU_PROVIDER } from '../wh-su';
import { PD_SU_PROVIDER } from '../pd-su';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('DOC_PO', () => {
    let poolService: PostgresPoolService;
    let docPoTestService: DocPoTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

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
				...DOC_GRN_PROVIDER,
                ...DOC_PO_PROVIDER,
                ...SUPP_PROVIDER,
                ...PD_UOM_PROVIDER,
                ...PD_STORAGE_PROVIDER,
                ...PD_WH_PROVIDER,
                ...PD_SU_PROVIDER,
                ...WH_SU_PROVIDER,
                ...WH_PROVIDER,
                ...WH_STORAGE_PROVIDER,
                DocPoTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docPoTestService = app.get<DocPoTestService>(DocPoTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_PO <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            // const res1 = await docPoTestService.createTestPo(bid, brid)
            // const res2 = await docPoTestService.createTestPoWithSu(bid, brid)
            // const docPo = await docPoTestService.getById(bid, { id: '1AhTbSJ5n3yz7Kqjxh19dx'});
            // console.log(docPo)
            // const res = await docPoTestService.updateWhId(bid, brid);
            // const res1 = await docPoTestService.createGrn({ bid, brid, docPoId: 'dAq7tkKh9f3D69Mnhqem2N' });
            // console.log(res1)
            const res2 = await docPoTestService.createGrn({ bid, brid, docPoId: 'fNppAduhTHZRMfL5EAEQ8U' });
            console.log(JSON.stringify(res2, null, 2))
            // await docPoTestService.flush();
            expect(true).toBe(true)
        })
    })

});