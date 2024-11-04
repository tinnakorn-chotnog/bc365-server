import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocApivBase } from './doc-apiv.base.type';

@ObjectType()
export class DocApiv extends DocApivBase {
}
