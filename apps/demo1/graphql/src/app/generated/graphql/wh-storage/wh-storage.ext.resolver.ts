import { Resolver } from "@nestjs/graphql";
import { WhStorageResolver } from "./wh-storage.resolver";
import { WhStorage } from "./wh-storage.type";

@Resolver(() => WhStorage)
export class WhStorageExtResolver extends WhStorageResolver {    
}
