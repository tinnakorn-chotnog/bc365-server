import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BrandBase } from './brand.base.type';

@ObjectType()
export class Brand extends BrandBase {
}
