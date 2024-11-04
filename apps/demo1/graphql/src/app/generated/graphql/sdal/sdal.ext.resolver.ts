import { Resolver } from "@nestjs/graphql";
import { SdalResolver } from "./sdal.resolver";
import { Sdal } from "./sdal.type";

@Resolver(() => Sdal)
export class SdalExtResolver extends SdalResolver {    
}
