import { Resolver } from "@nestjs/graphql";
import { AppNavResolver } from "./app-nav.resolver";
import { AppNav } from "./app-nav.type";

@Resolver(() => AppNav)
export class AppNavExtResolver extends AppNavResolver {    
}
