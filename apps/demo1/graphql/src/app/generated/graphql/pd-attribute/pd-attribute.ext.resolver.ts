import { Resolver } from "@nestjs/graphql";
import { PdAttributeResolver } from "./pd-attribute.resolver";
import { PdAttribute } from "./pd-attribute.type";

@Resolver(() => PdAttribute)
export class PdAttributeExtResolver extends PdAttributeResolver {    
}
