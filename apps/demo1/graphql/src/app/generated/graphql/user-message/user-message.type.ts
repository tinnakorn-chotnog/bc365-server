import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { UserMessageBase } from './user-message.base.type';

@ObjectType()
export class UserMessage extends UserMessageBase {
}
