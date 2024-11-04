import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { StatusTypeBase } from './status-type.base.type';

@ObjectType()
export class StatusType extends StatusTypeBase {
}
