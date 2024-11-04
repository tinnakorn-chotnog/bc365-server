import { Resolver } from "@nestjs/graphql";
import { SpdStorageResolver } from "./spd-storage.resolver";
import { SpdStorage } from "./spd-storage.type";

@Resolver(() => SpdStorage)
export class SpdStorageExtResolver extends SpdStorageResolver {    
}
