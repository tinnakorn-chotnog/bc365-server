import { testDS } from '@bc365-server/common';
import { TenantModule } from '@bc365-server/demo1';
import { RedisSequenceService, RedisLockService } from '@bc365-server/shared';
import { Test } from '@nestjs/testing';


// Business Partner
import { entities } from 'libs/demo1/src/lib/generated/orm/entities';
import { BizExtService, BIZ_PROVIDER } from 'libs/demo1/src/lib/generated/services/biz';
import { ASSET_PROVIDER, AssetExtService } from 'libs/demo1/src/lib/generated/services/asset';
import { RTP_PROVIDER, RtpExtService } from 'libs/demo1/src/lib/generated/services/rtp';
import { betterSqliteConfig } from 'libs/demo1/src/lib/tenant/orm-config.better-sqlite';

const short = require('short-uuid');

describe('Test Dataloader', () => {

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'sss'
    // const bid = 't7W3ZqGJDGB46gD2Spy3ui';

    let bizService: BizExtService;
    // Business Partner
    let assetExtService: AssetExtService;
    let rtpExtService: RtpExtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TenantModule,
            ],
            
            providers: [
                RedisSequenceService,
                RedisLockService,
                ...BIZ_PROVIDER,
                ...ASSET_PROVIDER,
                ...RTP_PROVIDER
            ],

        }).compile();

        const ds =  await testDS(betterSqliteConfig(bid, entities))

        bizService = moduleRef.get<BizExtService>(BizExtService)

        // Business Partner
        assetExtService = moduleRef.get<AssetExtService>(AssetExtService)
        rtpExtService = moduleRef.get<RtpExtService>(RtpExtService)

    });

    
    describe('Load Country State City', () => {
        it('Asset Partner', async () => {
            try {
                const items = require('./test-data/asset.json')
                await assetExtService.add(bid, brid, items) 
            } catch(e) {
                console.log(e);
            }
            expect(true).toBe(true);
        })
        it('Rtp Partner', async () => {
            try {
                const items = require('./test-data/rtp.json')
                await rtpExtService.add(bid, brid, items) 
            } catch(e) {
                console.log(e);
            }
            expect(true).toBe(true);
        })
    })
})