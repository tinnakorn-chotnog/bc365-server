import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BizLanguageBase } from './biz-language.base.type';

@ObjectType()
export class BizLanguage extends BizLanguageBase {
}
