import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ProvinceBase } from './province.base.type';

@ObjectType()
export class Province extends ProvinceBase {
}
