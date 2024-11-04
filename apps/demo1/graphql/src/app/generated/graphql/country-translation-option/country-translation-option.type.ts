import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { CountryTranslationOptionBase } from './country-translation-option.base.type';

@ObjectType()
export class CountryTranslationOption extends CountryTranslationOptionBase {
}
