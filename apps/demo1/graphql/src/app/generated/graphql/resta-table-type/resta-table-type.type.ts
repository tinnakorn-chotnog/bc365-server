import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RestaTableTypeBase } from './resta-table-type.base.type';

@ObjectType()
export class RestaTableType extends RestaTableTypeBase {
}
