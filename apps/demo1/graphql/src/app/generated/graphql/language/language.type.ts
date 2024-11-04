import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { LanguageBase } from './language.base.type';

@ObjectType()
export class Language extends LanguageBase {
}
