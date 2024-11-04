import { ModuleRef } from "@nestjs/core";
import { DocTfoService } from "./doc-tfo.service";
import { DocTfo } from "../../interfaces/doc-tfo.model";
import { PdExtService } from "../pd";
import { PdStorageExtService } from "../pd-storage";
import { PdWhExtService } from "../pd-wh";
import { WhAisleExtService } from "../wh-aisle";
import { WhRackExtService } from "../wh-rack";
import { WhShelfExtService } from "../wh-shelf";
import { WhStorageExtService } from "../wh-storage";
import { WhSuExtService } from "../wh-su";
import { WhZoneExtService } from "../wh-zone";
import { DocPickExtService } from "../doc-pick";
import { isNull, keyBy } from "lodash";

export class DocTfoExtService extends DocTfoService {

    // get whSuService() {
    //     return this.modRef.get<WhSuExtService>(WhSuExtService)
    // }

    // get whZoneService() {
    //     return this.modRef.get<WhZoneExtService>(WhZoneExtService)
    // }

    // get whAisleService() {
    //     return this.modRef.get<WhAisleExtService>(WhAisleExtService)
    // }

    // get whRackService() {
    //     return this.modRef.get<WhRackExtService>(WhRackExtService)
    // }

    // get whShelfService() {
    //     return this.modRef.get<WhShelfExtService>(WhShelfExtService)
    // }

    // get whStorageService() {
    //     return this.modRef.get<WhStorageExtService>(WhStorageExtService)
    // }

    get pdService() {
        return this.modRef.get<PdExtService>(PdExtService)
    }


    get pdWhService() {
        return this.modRef.get<PdWhExtService>(PdWhExtService)
    }

    get pdStorageService() {
        return this.modRef.get<PdStorageExtService>(PdStorageExtService)
    }

    get docPickService() {
        return this.modRef.get<DocPickExtService>(DocPickExtService)
    }

}
