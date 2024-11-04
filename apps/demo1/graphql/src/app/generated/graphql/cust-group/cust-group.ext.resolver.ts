import { Resolver } from "@nestjs/graphql";
import { CustGroupResolver } from "./cust-group.resolver";
import { CustGroup } from "./cust-group.type";

@Resolver(() => CustGroup)
export class CustGroupExtResolver extends CustGroupResolver {    
}
