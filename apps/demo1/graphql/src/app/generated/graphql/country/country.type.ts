import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { CountryBase } from './country.base.type';

@ObjectType()
export class Country extends CountryBase {
}
