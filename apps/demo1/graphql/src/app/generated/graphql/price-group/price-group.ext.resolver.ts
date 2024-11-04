import { Resolver } from "@nestjs/graphql";
import { PriceGroupResolver } from "./price-group.resolver";
import { PriceGroup } from "./price-group.type";

@Resolver(() => PriceGroup)
export class PriceGroupExtResolver extends PriceGroupResolver {    
}
