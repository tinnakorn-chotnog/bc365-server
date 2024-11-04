import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ChatMessageBase } from './chat-message.base.type';

@ObjectType()
export class ChatMessage extends ChatMessageBase {
}
