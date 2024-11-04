import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BizUserRoleBase } from './biz-user-role.base.type';

@ObjectType()
export class BizUserRole extends BizUserRoleBase {
}
