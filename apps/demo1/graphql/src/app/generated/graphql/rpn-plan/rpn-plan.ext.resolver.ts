import { Resolver } from "@nestjs/graphql";
import { RpnPlanResolver } from "./rpn-plan.resolver";
import { RpnPlan } from "./rpn-plan.type";

@Resolver(() => RpnPlan)
export class RpnPlanExtResolver extends RpnPlanResolver {    
}
