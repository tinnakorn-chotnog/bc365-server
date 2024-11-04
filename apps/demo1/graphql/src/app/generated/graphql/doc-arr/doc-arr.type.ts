import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocArrBase } from './doc-arr.base.type';

@ObjectType()
export class DocArr extends DocArrBase {
}
