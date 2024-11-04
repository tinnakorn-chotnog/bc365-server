import { Resolver } from "@nestjs/graphql";
import { AppTypeResolver } from "./app-type.resolver";
import { AppType } from "./app-type.type";

@Resolver(() => AppType)
export class AppTypeExtResolver extends AppTypeResolver {    
}
