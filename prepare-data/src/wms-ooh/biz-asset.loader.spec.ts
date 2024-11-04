import { Test } from '@nestjs/testing';
import { RedisLockService, RedisSequenceService } from '../../../../../../../libs/shared/src';
import { TenantModule, testDS } from '../../tenant/tenant.module'
import { entities } from '../../generated/orm/entities';
import { betterSqliteConfig } from '../../tenant/orm-config.better-sqlite';

import { BizExtService, BIZ_PROVIDER } from 'apps/demo1/common/src/app/generated/services/biz'

// Business Partner
import { AssetExtService, ASSET_PROVIDER } from 'apps/demo1/common/src/app/generated/services/asset'
import { RtpExtService, RTP_PROVIDER } from 'apps/demo1/common/src/app/generated/services/rtp'


const short = require('short-uuid');

describe('Test Dataloader', () => {

    const bid = 'mnuz6SU4ncbMmBrutWioae';
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
                await assetExtService.add(bid, items) 
            } catch(e) {
                console.log(e);
            }
            expect(true).toBe(true);
        })
        it('Rtp Partner', async () => {
            try {
                const items = require('./test-data/rtp.json')
                await rtpExtService.add(bid, items) 
            } catch(e) {
                console.log(e);
            }
            expect(true).toBe(true);
        })
    })
})