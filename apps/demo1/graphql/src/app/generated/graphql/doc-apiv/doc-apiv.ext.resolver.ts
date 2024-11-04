import { Resolver } from "@nestjs/graphql";
import { DocApivResolver } from "./doc-apiv.resolver";
import { DocApiv } from "./doc-apiv.type";

@Resolver(() => DocApiv)
export class DocApivExtResolver extends DocApivResolver {    
}
