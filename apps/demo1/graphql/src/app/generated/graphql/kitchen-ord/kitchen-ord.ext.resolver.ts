import { Resolver } from "@nestjs/graphql";
import { KitchenOrdResolver } from "./kitchen-ord.resolver";
import { KitchenOrd } from "./kitchen-ord.type";

@Resolver(() => KitchenOrd)
export class KitchenOrdExtResolver extends KitchenOrdResolver {    
}
