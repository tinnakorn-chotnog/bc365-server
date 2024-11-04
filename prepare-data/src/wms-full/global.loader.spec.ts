import { Test } from '@nestjs/testing';
import { BizExtService, BIZ_PROVIDER } from 'libs/demo1/src/lib/generated/services/biz'
import { CountryExtService, COUNTRY_PROVIDER } from 'libs/demo1/src/lib/generated/services/country'
import { ProvinceExtService, PROVINCE_PROVIDER } from 'libs/demo1/src/lib/generated/services/province'
import { DistrictsExtService, DISTRICTS_PROVIDER } from 'libs/demo1/src/lib/generated/services/districts'
import { CateExtService, CATE_PROVIDER } from 'libs/demo1/src/lib/generated/services/cate'
import { SubcateExtService, SUBCATE_PROVIDER } from 'libs/demo1/src/lib/generated/services/subcate'
import { LanguageExtService, LANGUAGE_PROVIDER } from 'libs/demo1/src/lib/generated/services/language'
import { TranslationOptionExtService, TRANSLATION_OPTION_PROVIDER } from 'libs/demo1/src/lib/generated/services/translation-option'
import { TenantModule } from '@bc365-server/demo1';
import { RedisSequenceService, RedisLockService } from '@bc365-server/shared';
const short = require('short-uuid');

describe('Test Dataloader', () => {

    let bizService: BizExtService;
    let countryService: CountryExtService;
    let provinceService: ProvinceExtService;
    let districtsService: DistrictsExtService;
    let cateService: CateExtService;
    let subcateService: SubcateExtService;
    let languageService: LanguageExtService;
    let translationOptionService: TranslationOptionExtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TenantModule,
            ],
            
            providers: [
                RedisSequenceService,
                RedisLockService,
                ...BIZ_PROVIDER,
                ...CATE_PROVIDER,
                ...DISTRICTS_PROVIDER,
                ...COUNTRY_PROVIDER,
                ...LANGUAGE_PROVIDER,
                ...TRANSLATION_OPTION_PROVIDER,
                ...PROVINCE_PROVIDER,
                ...SUBCATE_PROVIDER
            ],

        }).compile();

        bizService = moduleRef.get<BizExtService>(BizExtService)
        countryService = moduleRef.get<CountryExtService>(CountryExtService)
        provinceService = moduleRef.get<ProvinceExtService>(ProvinceExtService)
        districtsService = moduleRef.get<DistrictsExtService>(DistrictsExtService)
        cateService = moduleRef.get<CateExtService>(CateExtService)
        subcateService = moduleRef.get<SubcateExtService>(SubcateExtService)
        languageService = moduleRef.get<LanguageExtService>(LanguageExtService)
        translationOptionService = moduleRef.get<TranslationOptionExtService>(TranslationOptionExtService)

    });

    describe('Load Country Province Districts', () => {
        it('Add Country', async () => {
            const countries = require('./test-data/country.json');
            try {
                await countryService.add('global', null, countries)
            } catch (e) {
                console.log(e)
            }
        })
        it('Add Province', async () => {
            const provinces = require('./test-data/province.json');
            try {
                await provinceService.add('global', null, provinces)
            } catch (e) {
                console.log(e)
            }
        })
        it('Add Districts', async () => {
            const cities = require('./test-data/districts.json');
            try {
                await districtsService.add('global', null, cities)
            } catch (e) {
                console.log(e)
            }
        })
        it('Add Biz', async () => {
            const bizes = require('./test-data/biz.json');
            try {
                await bizService.add('global', null, bizes)
            } catch (e) {
                console.log(e)
            }
        })
        it('Add Cate', async () => {
            const cates = require('./test-data/cate.json');
            try {
                await cateService.add('global', null, cates)
            } catch (e) {
                console.log(e)
            }
        })
        it('Add Subcate', async () => {
            const subcates = require('./test-data/subcate.json');
            try {
                await subcateService.add('global', null, subcates)
            } catch (e) {
                console.log(e)
            }
        })
        it('Add Language', async () => {
            const languages = require('./test-data/language.json');
            try {
                await languageService.add('global', null, languages)
            } catch (e) {
                console.log(e)
            }
        })
    })
});