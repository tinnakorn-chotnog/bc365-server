import { ModuleRef } from "@nestjs/core";
import { BizService } from "./biz.service";
import { Biz } from "../../interfaces/biz.model";
import { GetParamsType } from "@bc365-server/common/services/db.interface";

export class BizExtService extends BizService {

    getSkipBidCheck(params: GetParamsType): Promise<Biz[]> {
        return this.service.get({ ...params, skipBidCheck: true, skipBridCheck: true })
    }

}
