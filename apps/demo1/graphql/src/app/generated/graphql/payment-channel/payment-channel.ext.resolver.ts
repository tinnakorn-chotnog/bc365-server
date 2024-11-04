import { Resolver } from "@nestjs/graphql";
import { PaymentChannelResolver } from "./payment-channel.resolver";
import { PaymentChannel } from "./payment-channel.type";

@Resolver(() => PaymentChannel)
export class PaymentChannelExtResolver extends PaymentChannelResolver {    
}
