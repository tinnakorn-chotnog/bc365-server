import { Resolver } from "@nestjs/graphql";
import { DocIvaResolver } from "./doc-iva.resolver";
import { DocIva } from "./doc-iva.type";

@Resolver(() => DocIva)
export class DocIvaExtResolver extends DocIvaResolver {    
}
