import { Resolver } from "@nestjs/graphql";
import { ChequeReceivedResolver } from "./cheque-received.resolver";
import { ChequeReceived } from "./cheque-received.type";

@Resolver(() => ChequeReceived)
export class ChequeReceivedExtResolver extends ChequeReceivedResolver {    
}
