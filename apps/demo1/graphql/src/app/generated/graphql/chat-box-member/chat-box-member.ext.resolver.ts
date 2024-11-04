import { Resolver } from "@nestjs/graphql";
import { ChatBoxMemberResolver } from "./chat-box-member.resolver";
import { ChatBoxMember } from "./chat-box-member.type";

@Resolver(() => ChatBoxMember)
export class ChatBoxMemberExtResolver extends ChatBoxMemberResolver {    
}
