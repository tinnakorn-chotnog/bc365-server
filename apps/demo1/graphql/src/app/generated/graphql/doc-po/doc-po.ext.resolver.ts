import { Resolver } from "@nestjs/graphql";
import { DocPoResolver } from "./doc-po.resolver";
import { DocPo } from "./doc-po.type";

@Resolver(() => DocPo)
export class DocPoExtResolver extends DocPoResolver {    
}
