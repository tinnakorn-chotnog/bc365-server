import { Resolver } from "@nestjs/graphql";
import { RefDocResolver } from "./ref-doc.resolver";
import { RefDoc } from "./ref-doc.type";

@Resolver(() => RefDoc)
export class RefDocExtResolver extends RefDocResolver {    
}
