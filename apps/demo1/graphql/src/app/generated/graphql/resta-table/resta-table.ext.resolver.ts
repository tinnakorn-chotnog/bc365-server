import { Resolver } from "@nestjs/graphql";
import { RestaTableResolver } from "./resta-table.resolver";
import { RestaTable } from "./resta-table.type";

@Resolver(() => RestaTable)
export class RestaTableExtResolver extends RestaTableResolver {    
}
