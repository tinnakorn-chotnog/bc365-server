import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RpnPlanBase } from './rpn-plan.base.type';

@ObjectType()
export class RpnPlan extends RpnPlanBase {
}
