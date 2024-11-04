import { Resolver } from "@nestjs/graphql";
import { DocPackSuResolver } from "./doc-pack-su.resolver";
import { DocPackSu } from "./doc-pack-su.type";

@Resolver(() => DocPackSu)
export class DocPackSuExtResolver extends DocPackSuResolver {    
}
