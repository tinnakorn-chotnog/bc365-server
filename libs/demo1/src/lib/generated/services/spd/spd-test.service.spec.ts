import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { SPD_PROVIDER } from './spd.provider';
import { SpdTestService } from './spd-test.service'
import { BIZ_PROVIDER } from '../biz';
import { SPD_STORAGE_PROVIDER } from '../spd-storage';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { UOM_PROVIDER, UomExtService } from '../uom';
import { PD_UOM_PROVIDER, PdUomExtService } from '../pd-uom';
import { groupBy } from 'lodash';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('SPD', () => {
    let poolService: PostgresPoolService;
    let spdTestService: SpdTestService
    let uomService: UomExtService;
    let pdUomService: PdUomExtService;

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
				...SPD_STORAGE_PROVIDER,
                ...SPD_PROVIDER,
                ...UOM_PROVIDER,
                ...PD_UOM_PROVIDER,
                SpdTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        spdTestService = app.get<SpdTestService>(SpdTestService);
        uomService = app.get<UomExtService>(UomExtService);
        pdUomService = app.get<PdUomExtService>(PdUomExtService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('SPD <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            // const uoms = await uomService.get({ bid, brid });
            const pdUoms = await pdUomService.get({ bid, brid });
            const pdUomMap = groupBy(pdUoms, 'pdId')
            const spds = await spdTestService.get({ bid, brid});
            spds.forEach( spd => {
                const pdUom = pdUomMap[spd.pdId]
                spd.pdUomId = pdUom[1].pdUomId;
                spd.cnvFactor = pdUom[1].cnvFactor;
                spd.ohQty = 0;
            })
            // console.log(spds)
            await spdTestService.updateList({ bid, brid, data: spds, batch: true });
            await spdTestService.flush();
            expect(true).toBe(true)
        })
    })

});