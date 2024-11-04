import { Resolver } from "@nestjs/graphql";
import { CpdStorageResolver } from "./cpd-storage.resolver";
import { CpdStorage } from "./cpd-storage.type";

@Resolver(() => CpdStorage)
export class CpdStorageExtResolver extends CpdStorageResolver {    
}
