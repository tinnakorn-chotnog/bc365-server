import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocTaskBase } from './doc-task.base.type';

@ObjectType()
export class DocTask extends DocTaskBase {
}
