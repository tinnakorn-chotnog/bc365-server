import { Resolver } from "@nestjs/graphql";
import { AppMessageResolver } from "./app-message.resolver";
import { AppMessage } from "./app-message.type";

@Resolver(() => AppMessage)
export class AppMessageExtResolver extends AppMessageResolver {    
}
