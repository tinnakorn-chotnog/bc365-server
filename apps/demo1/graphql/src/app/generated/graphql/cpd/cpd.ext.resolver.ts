import { Resolver } from "@nestjs/graphql";
import { CpdResolver } from "./cpd.resolver";
import { Cpd } from "./cpd.type";

@Resolver(() => Cpd)
export class CpdExtResolver extends CpdResolver {    
}
