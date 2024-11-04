import { Resolver } from "@nestjs/graphql";
import { PeriodResolver } from "./period.resolver";
import { Period } from "./period.type";

@Resolver(() => Period)
export class PeriodExtResolver extends PeriodResolver {    
}
