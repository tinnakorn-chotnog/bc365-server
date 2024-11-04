import { Resolver } from "@nestjs/graphql";
import { SalesChannelResolver } from "./sales-channel.resolver";
import { SalesChannel } from "./sales-channel.type";

@Resolver(() => SalesChannel)
export class SalesChannelExtResolver extends SalesChannelResolver {    
}
