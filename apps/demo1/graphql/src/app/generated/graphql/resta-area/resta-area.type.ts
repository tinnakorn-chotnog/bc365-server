import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RestaAreaBase } from './resta-area.base.type';

@ObjectType()
export class RestaArea extends RestaAreaBase {
}
