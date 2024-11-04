import { Resolver } from "@nestjs/graphql";
import { AppMenuResolver } from "./app-menu.resolver";
import { AppMenu } from "./app-menu.type";

@Resolver(() => AppMenu)
export class AppMenuExtResolver extends AppMenuResolver {    
}
