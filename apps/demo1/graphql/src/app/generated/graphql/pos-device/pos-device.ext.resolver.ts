import { Resolver } from "@nestjs/graphql";
import { PosDeviceResolver } from "./pos-device.resolver";
import { PosDevice } from "./pos-device.type";

@Resolver(() => PosDevice)
export class PosDeviceExtResolver extends PosDeviceResolver {    
}
