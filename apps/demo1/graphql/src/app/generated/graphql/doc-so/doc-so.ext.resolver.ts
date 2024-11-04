import { Resolver } from "@nestjs/graphql";
import { DocSoResolver } from "./doc-so.resolver";
import { DocSo } from "./doc-so.type";

@Resolver(() => DocSo)
export class DocSoExtResolver extends DocSoResolver {    
}
