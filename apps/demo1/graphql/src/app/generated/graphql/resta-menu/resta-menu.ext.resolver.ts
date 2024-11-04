import { Resolver } from "@nestjs/graphql";
import { RestaMenuResolver } from "./resta-menu.resolver";
import { RestaMenu } from "./resta-menu.type";

@Resolver(() => RestaMenu)
export class RestaMenuExtResolver extends RestaMenuResolver {    
}
