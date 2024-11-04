import { Resolver } from "@nestjs/graphql";
import { DocPosResolver } from "./doc-pos.resolver";
import { DocPos } from "./doc-pos.type";

@Resolver(() => DocPos)
export class DocPosExtResolver extends DocPosResolver {    
}
