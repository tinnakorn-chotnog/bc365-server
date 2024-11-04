import { Resolver } from "@nestjs/graphql";
import { DocShipResolver } from "./doc-ship.resolver";
import { DocShip } from "./doc-ship.type";

@Resolver(() => DocShip)
export class DocShipExtResolver extends DocShipResolver {    
}
