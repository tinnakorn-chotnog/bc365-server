import { Resolver } from "@nestjs/graphql";
import { BizUserGrpResolver } from "./biz-user-grp.resolver";
import { BizUserGrp } from "./biz-user-grp.type";

@Resolver(() => BizUserGrp)
export class BizUserGrpExtResolver extends BizUserGrpResolver {    
}
