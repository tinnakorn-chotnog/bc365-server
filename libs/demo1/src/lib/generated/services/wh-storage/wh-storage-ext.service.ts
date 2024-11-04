import { ModuleRef } from "@nestjs/core";
import { WhStorageService } from "./wh-storage.service";
import { PdStorageExtService } from "../pd-storage";
import { PdExtService } from "../pd";
import { PdSuExtService } from "../pd-su";
import { PdHuExtService } from "../pd-hu";

export class WhStorageExtService extends WhStorageService {
}
