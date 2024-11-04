import { Resolver } from "@nestjs/graphql";
import { DspResolver } from "./dsp.resolver";
import { Dsp } from "./dsp.type";

@Resolver(() => Dsp)
export class DspExtResolver extends DspResolver {    
}
