import { Resolver } from "@nestjs/graphql";
import { KitchenResolver } from "./kitchen.resolver";
import { Kitchen } from "./kitchen.type";

@Resolver(() => Kitchen)
export class KitchenExtResolver extends KitchenResolver {    
}
