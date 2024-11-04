import { Resolver } from "@nestjs/graphql";
import { AppRouteResolver } from "./app-route.resolver";
import { AppRoute } from "./app-route.type";

@Resolver(() => AppRoute)
export class AppRouteExtResolver extends AppRouteResolver {    
}
