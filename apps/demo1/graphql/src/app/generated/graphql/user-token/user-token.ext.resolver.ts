import { Resolver } from "@nestjs/graphql";
import { UserTokenResolver } from "./user-token.resolver";
import { UserToken } from "./user-token.type";

@Resolver(() => UserToken)
export class UserTokenExtResolver extends UserTokenResolver {    
}
