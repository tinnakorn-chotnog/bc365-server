import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AppNotiBase } from './app-noti.base.type';

@ObjectType()
export class AppNoti extends AppNotiBase {
}
