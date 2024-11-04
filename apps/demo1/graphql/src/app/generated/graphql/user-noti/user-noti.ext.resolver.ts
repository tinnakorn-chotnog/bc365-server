import { Resolver } from "@nestjs/graphql";
import { UserNotiResolver } from "./user-noti.resolver";
import { UserNoti } from "./user-noti.type";

@Resolver(() => UserNoti)
export class UserNotiExtResolver extends UserNotiResolver {    
}
