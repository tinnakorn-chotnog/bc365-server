import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BizAllowedBase } from './biz-allowed.base.type';

@ObjectType()
export class BizAllowed extends BizAllowedBase {
}
