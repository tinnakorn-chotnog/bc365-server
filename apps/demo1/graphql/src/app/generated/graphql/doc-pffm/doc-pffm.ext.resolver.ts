import { Resolver } from "@nestjs/graphql";
import { DocPffmResolver } from "./doc-pffm.resolver";
import { DocPffm } from "./doc-pffm.type";

@Resolver(() => DocPffm)
export class DocPffmExtResolver extends DocPffmResolver {    
}
