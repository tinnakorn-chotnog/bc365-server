import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ChatBoxBase } from './chat-box.base.type';

@ObjectType()
export class ChatBox extends ChatBoxBase {
}
