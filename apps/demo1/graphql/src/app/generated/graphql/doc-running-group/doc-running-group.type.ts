import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocRunningGroupBase } from './doc-running-group.base.type';

@ObjectType()
export class DocRunningGroup extends DocRunningGroupBase {
}
