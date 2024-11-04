import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { TranslationOptionBase } from './translation-option.base.type';

@ObjectType()
export class TranslationOption extends TranslationOptionBase {
}
