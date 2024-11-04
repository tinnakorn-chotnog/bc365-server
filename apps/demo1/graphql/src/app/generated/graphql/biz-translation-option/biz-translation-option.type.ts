import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BizTranslationOptionBase } from './biz-translation-option.base.type';

@ObjectType()
export class BizTranslationOption extends BizTranslationOptionBase {
}
