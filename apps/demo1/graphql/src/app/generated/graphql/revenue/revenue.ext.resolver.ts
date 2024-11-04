import { Resolver } from "@nestjs/graphql";
import { RevenueResolver } from "./revenue.resolver";
import { Revenue } from "./revenue.type";

@Resolver(() => Revenue)
export class RevenueExtResolver extends RevenueResolver {    
}
