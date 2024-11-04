import { Resolver } from "@nestjs/graphql";
import { ChatBoxResolver } from "./chat-box.resolver";
import { ChatBox } from "./chat-box.type";

@Resolver(() => ChatBox)
export class ChatBoxExtResolver extends ChatBoxResolver {    
}
