import { Resolver } from "@nestjs/graphql";
import { PdCostStackResolver } from "./pd-cost-stack.resolver";
import { PdCostStack } from "./pd-cost-stack.type";

@Resolver(() => PdCostStack)
export class PdCostStackExtResolver extends PdCostStackResolver {    
}
