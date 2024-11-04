import { Resolver } from "@nestjs/graphql";
import { BizUserRoleResolver } from "./biz-user-role.resolver";
import { BizUserRole } from "./biz-user-role.type";

@Resolver(() => BizUserRole)
export class BizUserRoleExtResolver extends BizUserRoleResolver {    
}
