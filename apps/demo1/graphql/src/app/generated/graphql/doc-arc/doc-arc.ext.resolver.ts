import { Resolver } from "@nestjs/graphql";
import { DocArcResolver } from "./doc-arc.resolver";
import { DocArc } from "./doc-arc.type";

@Resolver(() => DocArc)
export class DocArcExtResolver extends DocArcResolver {    
}
