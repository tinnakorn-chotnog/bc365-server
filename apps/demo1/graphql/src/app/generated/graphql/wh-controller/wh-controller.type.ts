import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhControllerBase } from './wh-controller.base.type';

@ObjectType()
export class WhController extends WhControllerBase {
}
