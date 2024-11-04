import { Resolver } from "@nestjs/graphql";
import { AppNavGroupResolver } from "./app-nav-group.resolver";
import { AppNavGroup } from "./app-nav-group.type";

@Resolver(() => AppNavGroup)
export class AppNavGroupExtResolver extends AppNavGroupResolver {    
}
