import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocGinBase } from './doc-gin.base.type';

@ObjectType()
export class DocGin extends DocGinBase {
}
