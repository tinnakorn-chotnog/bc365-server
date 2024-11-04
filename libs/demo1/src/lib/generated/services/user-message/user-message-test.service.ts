import { ModuleRef } from "@nestjs/core";
import { UserMessageExtService } from "./user-message-ext.service";
import { ReplaySubject } from "rxjs";
import { UserMessage } from "../../interfaces/user-message.model";

export class UserMessageTestService extends UserMessageExtService {

}
