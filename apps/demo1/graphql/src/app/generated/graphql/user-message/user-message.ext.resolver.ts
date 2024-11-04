import { Resolver } from "@nestjs/graphql";
import { UserMessageResolver } from "./user-message.resolver";
import { UserMessage } from "./user-message.type";

@Resolver(() => UserMessage)
export class UserMessageExtResolver extends UserMessageResolver {    
}
