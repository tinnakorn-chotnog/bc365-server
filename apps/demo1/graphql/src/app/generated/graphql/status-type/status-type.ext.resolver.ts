import { Resolver } from "@nestjs/graphql";
import { StatusTypeResolver } from "./status-type.resolver";
import { StatusType } from "./status-type.type";

@Resolver(() => StatusType)
export class StatusTypeExtResolver extends StatusTypeResolver {    
}
