import { Resolver } from "@nestjs/graphql";
import { BizResolver } from "./biz.resolver";
import { Biz } from "./biz.type";

@Resolver(() => Biz)
export class BizExtResolver extends BizResolver {    
}
