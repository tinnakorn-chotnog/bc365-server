import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocIvaBase } from './doc-iva.base.type';

@ObjectType()
export class DocIva extends DocIvaBase {
}
