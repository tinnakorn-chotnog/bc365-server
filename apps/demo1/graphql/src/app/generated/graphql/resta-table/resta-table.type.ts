import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RestaTableBase } from './resta-table.base.type';

@ObjectType()
export class RestaTable extends RestaTableBase {
}
