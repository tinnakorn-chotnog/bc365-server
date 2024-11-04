import { Resolver } from "@nestjs/graphql";
import { StatusResolver } from "./status.resolver";
import { Status } from "./status.type";

@Resolver(() => Status)
export class StatusExtResolver extends StatusResolver {    
}
