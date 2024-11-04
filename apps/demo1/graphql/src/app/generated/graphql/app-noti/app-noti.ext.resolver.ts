import { Resolver } from "@nestjs/graphql";
import { AppNotiResolver } from "./app-noti.resolver";
import { AppNoti } from "./app-noti.type";

@Resolver(() => AppNoti)
export class AppNotiExtResolver extends AppNotiResolver {    
}
