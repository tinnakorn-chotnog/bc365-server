import { Resolver } from "@nestjs/graphql";
import { WhStorageRestrictionResolver } from "./wh-storage-restriction.resolver";
import { WhStorageRestriction } from "./wh-storage-restriction.type";

@Resolver(() => WhStorageRestriction)
export class WhStorageRestrictionExtResolver extends WhStorageRestrictionResolver {    
}
