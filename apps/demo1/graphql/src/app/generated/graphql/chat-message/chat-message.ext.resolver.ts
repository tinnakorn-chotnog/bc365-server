import { Resolver } from "@nestjs/graphql";
import { ChatMessageResolver } from "./chat-message.resolver";
import { ChatMessage } from "./chat-message.type";

@Resolver(() => ChatMessage)
export class ChatMessageExtResolver extends ChatMessageResolver {    
}
