import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BizUserBase } from './biz-user.base.type';

@ObjectType()
export class BizUser extends BizUserBase {
}
