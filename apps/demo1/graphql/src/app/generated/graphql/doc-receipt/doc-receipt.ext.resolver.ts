import { Resolver } from "@nestjs/graphql";
import { DocReceiptResolver } from "./doc-receipt.resolver";
import { DocReceipt } from "./doc-receipt.type";

@Resolver(() => DocReceipt)
export class DocReceiptExtResolver extends DocReceiptResolver {    
}
