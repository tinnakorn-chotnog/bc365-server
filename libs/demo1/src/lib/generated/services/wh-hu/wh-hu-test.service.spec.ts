import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_HU_PROVIDER } from './wh-hu.provider';
import { WhHuTestService } from './wh-hu-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_HU_PROVIDER } from '../pd-hu';
import shortUUID from 'short-uuid';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { WH_PROVIDER } from '../wh/wh.provider';

jest.setTimeout(5000000);

describe('WH_HU', () => {
    let poolService: PostgresPoolService;
    let whHuTestService: WhHuTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...PD_HU_PROVIDER,
                ...WH_PROVIDER,
                ...WH_HU_PROVIDER,
                ...WH_STORAGE_PROVIDER,
                WhHuTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whHuTestService = app.get<WhHuTestService>(WhHuTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WH_HU <test case group description>', () => {
        it('#1.1 Before insert', async () => {
            const whHu = await whHuTestService.beforeInsert({ bid, brid, data:{ whHuId: shortUUID.generate(), whId: "6w8h5CaUUqiErDwBaAk2zZ"  } })
            expect(whHu).toEqual({
                whHuId: whHu.whHuId,
                whId: '6w8h5CaUUqiErDwBaAk2zZ'
            })
        })
        it('#1.1 Before insert with storage', async () => {
        const whHu = await whHuTestService.beforeInsert({ bid, brid, data:{ whHuId: shortUUID.generate(), whId: "6w8h5CaUUqiErDwBaAk2zZ", whStorageId: '6XK1sHJeumqwjXE8tZre9b'  } })
            expect(whHu).toEqual({
                whHuId: whHu.whHuId,
                whId: 'dRF8jGphpQxRiCuuSNVybc',
                whStorageId: '6XK1sHJeumqwjXE8tZre9b',
                whZoneId: '6sM9TSQ4HFse4Y8ow1f1g9',
                whAisleId: 'twfzZjthtVAr6KF4PLK4nh',
                whRackId: 'qbGkG29fErjeztmimsGF5A',
                whShelfId: 'duyYPSnFWpen8sKfGiGj1p'
            })
        })
        it('#1.1 Before update', async () => {
            const whHu = await whHuTestService.beforeUpdate({ bid, brid, data:{ whHuId: shortUUID.generate(), whId: "6w8h5CaUUqiErDwBaAk2zZ"  } })
            expect(whHu).toEqual({
                whHuId: whHu.whHuId,
                whId: '6w8h5CaUUqiErDwBaAk2zZ'
            })
        })
        it('#1.1 Before update with storage', async () => {
        const whHu = await whHuTestService.beforeUpdate({ bid, brid, data:{ whHuId: shortUUID.generate(), whId: "6w8h5CaUUqiErDwBaAk2zZ", whStorageId: '6XK1sHJeumqwjXE8tZre9b'  } })
            expect(whHu).toEqual({
                whHuId: whHu.whHuId,
                whId: 'dRF8jGphpQxRiCuuSNVybc',
                whStorageId: '6XK1sHJeumqwjXE8tZre9b',
                whZoneId: '6sM9TSQ4HFse4Y8ow1f1g9',
                whAisleId: 'twfzZjthtVAr6KF4PLK4nh',
                whRackId: 'qbGkG29fErjeztmimsGF5A',
                whShelfId: 'duyYPSnFWpen8sKfGiGj1p'
            })
        })
        it('#3.1 Should move to different warehouse.', async () => {
            const whHu = await whHuTestService.move({ bid, brid,  whHuId: "6w8h5CaUUqiErDwBaAk2zZ", whId: 'sK4So6cTCE5x3xPvZcoMn3' })
            expect(whHu).toEqual( {
                whHuId: whHu.whHuId,
                huNo: '001-000-P001',
                huDesc: 'Pallet 001',
                huTypeId: 'wVpQmsjubFVpzjfxvFLBJH',
                whId: 'sK4So6cTCE5x3xPvZcoMn3',
                bizId: 'mnuz6SU4ncbMmBrutWioae',
                branchId: 'q8e4GqhJJDKM7SthdkxxEA'
            })
        })
        it('#3.2 Should move to a storage location in the same warehouse.', async () => {
            const whHu = await whHuTestService.move({ bid, brid,  whHuId: "6w8h5CaUUqiErDwBaAk2zZ", whId: 'sK4So6cTCE5x3xPvZcoMn3' })
            expect(whHu).toEqual({
                whHuId: '6w8h5CaUUqiErDwBaAk2zZ',
                huNo: '001-000-P001',
                huDesc: 'Pallet 001',
                huTypeId: 'wVpQmsjubFVpzjfxvFLBJH',
                whId: 'sK4So6cTCE5x3xPvZcoMn3',
                bizId: 'mnuz6SU4ncbMmBrutWioae',
                branchId: 'q8e4GqhJJDKM7SthdkxxEA'
            })
        })
        it('#3.3 Should move to a storage location in the different warehouse.', async () => {
            const whHu = await whHuTestService.move({ bid, brid,  whHuId: "6w8h5CaUUqiErDwBaAk2zZ", whStorageId: 'jufa3a5WVB4M6Y7guENXqE' })
            expect(whHu).toEqual({
                whHuId: whHu.whHuId,
                huNo: '001-000-P001',
                huDesc: 'Pallet 001',
                huTypeId: 'wVpQmsjubFVpzjfxvFLBJH',
                whId: 'sK4So6cTCE5x3xPvZcoMn3',
                bizId: 'mnuz6SU4ncbMmBrutWioae',
                branchId: 'q8e4GqhJJDKM7SthdkxxEA',
                whStorageId: 'jufa3a5WVB4M6Y7guENXqE',
                whZoneId: 'xem6Yat9t9sVVnMMeMs4XH',
                whAisleId: 'd7gbkagdoKoXkVMYtm8aDp',
                whRackId: 'm7JohTGfsqdDBEZuA3bxHu',
                whShelfId: 'qkDCNq6jaNs4FeBn9DPXuz'
            })
        })
    })

});