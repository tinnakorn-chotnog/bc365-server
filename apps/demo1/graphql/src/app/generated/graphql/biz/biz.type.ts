import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BizBase } from './biz.base.type';

@ObjectType()
export class Biz extends BizBase {
}
