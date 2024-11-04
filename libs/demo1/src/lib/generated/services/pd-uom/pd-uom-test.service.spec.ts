import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_UOM_PROVIDER } from './pd-uom.provider';
import { PdUomTestService } from './pd-uom-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_HU_PROFILE_PROVIDER } from '../pd-hu-profile';
import { PD_HU_PROVIDER } from '../pd-hu';
import { PD_SU_PROFILE_PROVIDER } from '../pd-su-profile';
import { PD_SU_PROVIDER } from '../pd-su';
import { INV_TRN_PROVIDER } from '../inv-trn';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { UOM_PROVIDER, UomExtService } from '../uom';
import { keyBy } from 'lodash';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PD_UOM', () => {
    let poolService: PostgresPoolService;
    let pdUomTestService: PdUomTestService
    let uomService: UomExtService;

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
				...PD_HU_PROFILE_PROVIDER,
				...PD_HU_PROVIDER,
				...PD_SU_PROFILE_PROVIDER,
				...PD_SU_PROVIDER,
				...INV_TRN_PROVIDER,
                ...PD_UOM_PROVIDER,
                ...UOM_PROVIDER,
                PdUomTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdUomTestService = app.get<PdUomTestService>(PdUomTestService);
        uomService = app.get<UomExtService>(UomExtService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_UOM <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            const uoms = await uomService.get({ bid, brid })
            const pdUoms = await pdUomTestService.get({ bid, brid })
            pdUoms.forEach( pdUom => {
                if (pdUom.cnvFactor === 1) {
                    pdUom.uomId = uoms[0].uomId;
                    pdUom.printUnit = uoms[0].uomNo;
                } else
                if (pdUom.cnvFactor === 12) {
                    pdUom.uomId = uoms[1].uomId;
                    pdUom.printUnit = uoms[1].uomNo;
                } else {
                    pdUom.uomId = uoms[2].uomId;
                    pdUom.printUnit = uoms[2].uomNo;
                }
            })

            await pdUomTestService.updateList({ bid, brid, data: pdUoms, batch: true });
            await pdUomTestService.flush();

            expect(true).toBe(true)
        })
    })

});