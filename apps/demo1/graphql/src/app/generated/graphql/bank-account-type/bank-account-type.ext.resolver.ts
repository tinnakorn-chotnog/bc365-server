import { Resolver } from "@nestjs/graphql";
import { BankAccountTypeResolver } from "./bank-account-type.resolver";
import { BankAccountType } from "./bank-account-type.type";

@Resolver(() => BankAccountType)
export class BankAccountTypeExtResolver extends BankAccountTypeResolver {    
}
