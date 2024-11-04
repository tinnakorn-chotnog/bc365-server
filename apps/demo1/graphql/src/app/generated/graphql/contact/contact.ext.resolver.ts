import { Resolver } from "@nestjs/graphql";
import { ContactResolver } from "./contact.resolver";
import { Contact } from "./contact.type";

@Resolver(() => Contact)
export class ContactExtResolver extends ContactResolver {    
}
