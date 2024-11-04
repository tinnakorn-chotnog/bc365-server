import { Resolver } from "@nestjs/graphql";
import { WhStaffResolver } from "./wh-staff.resolver";
import { WhStaff } from "./wh-staff.type";

@Resolver(() => WhStaff)
export class WhStaffExtResolver extends WhStaffResolver {    
}
