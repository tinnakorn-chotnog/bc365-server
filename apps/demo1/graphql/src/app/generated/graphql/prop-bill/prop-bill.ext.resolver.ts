import { Resolver } from "@nestjs/graphql";
import { PropBillResolver } from "./prop-bill.resolver";
import { PropBill } from "./prop-bill.type";

@Resolver(() => PropBill)
export class PropBillExtResolver extends PropBillResolver {    
}
