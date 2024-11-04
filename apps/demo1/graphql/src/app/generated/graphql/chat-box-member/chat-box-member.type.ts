import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ChatBoxMemberBase } from './chat-box-member.base.type';

@ObjectType()
export class ChatBoxMember extends ChatBoxMemberBase {
}
