import { Resolver } from "@nestjs/graphql";
import { DocRestaOrdResolver } from "./doc-resta-ord.resolver";
import { DocRestaOrd } from "./doc-resta-ord.type";

@Resolver(() => DocRestaOrd)
export class DocRestaOrdExtResolver extends DocRestaOrdResolver {    
}
