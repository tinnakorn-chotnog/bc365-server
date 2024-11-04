import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { UserNotiBase } from './user-noti.base.type';

@ObjectType()
export class UserNoti extends UserNotiBase {
}
