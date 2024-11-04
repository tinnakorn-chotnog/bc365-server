import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocShipBase } from './doc-ship.base.type';

@ObjectType()
export class DocShip extends DocShipBase {
}
