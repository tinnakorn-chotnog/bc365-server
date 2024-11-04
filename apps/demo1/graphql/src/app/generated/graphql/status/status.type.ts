import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { StatusBase } from './status.base.type';

@ObjectType()
export class Status extends StatusBase {
}
