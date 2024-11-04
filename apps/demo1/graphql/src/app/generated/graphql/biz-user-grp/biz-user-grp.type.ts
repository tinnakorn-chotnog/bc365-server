import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BizUserGrpBase } from './biz-user-grp.base.type';

@ObjectType()
export class BizUserGrp extends BizUserGrpBase {
}
