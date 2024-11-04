import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdCateBase } from './pd-cate.base.type';

@ObjectType()
export class PdCate extends PdCateBase {
}
