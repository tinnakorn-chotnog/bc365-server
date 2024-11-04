import { Resolver } from "@nestjs/graphql";
import { DocOresvResolver } from "./doc-oresv.resolver";
import { DocOresv } from "./doc-oresv.type";

@Resolver(() => DocOresv)
export class DocOresvExtResolver extends DocOresvResolver {    
}
