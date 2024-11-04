import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocArivBase } from './doc-ariv.base.type';

@ObjectType()
export class DocAriv extends DocArivBase {
}
