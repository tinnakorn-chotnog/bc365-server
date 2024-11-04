import { Resolver } from "@nestjs/graphql";
import { CustResolver } from "./cust.resolver";
import { Cust } from "./cust.type";

@Resolver(() => Cust)
export class CustExtResolver extends CustResolver {    
}
