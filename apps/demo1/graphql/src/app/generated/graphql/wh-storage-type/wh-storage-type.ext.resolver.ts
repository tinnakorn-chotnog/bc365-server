import { Resolver } from "@nestjs/graphql";
import { WhStorageTypeResolver } from "./wh-storage-type.resolver";
import { WhStorageType } from "./wh-storage-type.type";

@Resolver(() => WhStorageType)
export class WhStorageTypeExtResolver extends WhStorageTypeResolver {    
}
