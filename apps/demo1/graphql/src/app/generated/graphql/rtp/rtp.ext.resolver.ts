import { Resolver } from "@nestjs/graphql";
import { RtpResolver } from "./rtp.resolver";
import { Rtp } from "./rtp.type";

@Resolver(() => Rtp)
export class RtpExtResolver extends RtpResolver {    
}
