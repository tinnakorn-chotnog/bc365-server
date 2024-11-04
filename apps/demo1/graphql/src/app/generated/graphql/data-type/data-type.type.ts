import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DataTypeBase } from './data-type.base.type';

@ObjectType()
export class DataType extends DataTypeBase {
}
