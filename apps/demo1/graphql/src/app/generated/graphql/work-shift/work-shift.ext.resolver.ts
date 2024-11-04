import { Resolver } from "@nestjs/graphql";
import { WorkShiftResolver } from "./work-shift.resolver";
import { WorkShift } from "./work-shift.type";

@Resolver(() => WorkShift)
export class WorkShiftExtResolver extends WorkShiftResolver {    
}
