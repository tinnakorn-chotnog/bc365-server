import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PackagingTypeBase } from './packaging-type.base.type';

@ObjectType()
export class PackagingType extends PackagingTypeBase {
}
