import { Resolver } from "@nestjs/graphql";
import { UserResolver } from "./user.resolver";
import { User } from "./user.type";

@Resolver(() => User)
export class UserExtResolver extends UserResolver {    
}
