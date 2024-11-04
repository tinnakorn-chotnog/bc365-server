import { Resolver } from "@nestjs/graphql";
import { PdResolver } from "./pd.resolver";
import { Pd } from "./pd.type";

@Resolver(() => Pd)
export class PdExtResolver extends PdResolver {    
}
