import { Resolver } from "@nestjs/graphql";
import { DocGrnResolver } from "./doc-grn.resolver";
import { DocGrn } from "./doc-grn.type";

@Resolver(() => DocGrn)
export class DocGrnExtResolver extends DocGrnResolver {    
}
