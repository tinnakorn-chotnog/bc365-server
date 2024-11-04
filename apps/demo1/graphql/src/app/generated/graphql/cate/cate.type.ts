import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { CateBase } from './cate.base.type';

@ObjectType()
export class Cate extends CateBase {
}
