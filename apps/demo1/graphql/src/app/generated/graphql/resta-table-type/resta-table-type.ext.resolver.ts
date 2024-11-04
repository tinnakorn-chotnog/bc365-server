import { Resolver } from "@nestjs/graphql";
import { RestaTableTypeResolver } from "./resta-table-type.resolver";
import { RestaTableType } from "./resta-table-type.type";

@Resolver(() => RestaTableType)
export class RestaTableTypeExtResolver extends RestaTableTypeResolver {    
}
