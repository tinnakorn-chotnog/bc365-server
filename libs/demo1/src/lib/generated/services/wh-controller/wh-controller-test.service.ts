import { ModuleRef } from "@nestjs/core";
import { WhControllerExtService } from "./wh-controller-ext.service";
import { WhController } from "../../interfaces/wh-controller.model";

export class WhControllerTestService extends WhControllerExtService {

    createTestData(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const whControllers: WhController[] = [
                    { whControllerId: this.service.generateId(), whControllerNo: 'P01', whControllerName: 'Picking Controller 1'},
                    { whControllerId: this.service.generateId(), whControllerNo: 'P02', whControllerName: 'Picking Controller 2'},
                    { whControllerId: this.service.generateId(), whControllerNo: 'P03', whControllerName: 'Picking Controller 3'},
                    { whControllerId: this.service.generateId(), whControllerNo: 'P04', whControllerName: 'Picking Controller 4'},
                    { whControllerId: this.service.generateId(), whControllerNo: 'R01', whControllerName: 'Replenishment Controller 1'},
                    { whControllerId: this.service.generateId(), whControllerNo: 'R02', whControllerName: 'Replenishment Controller 2'},
                    { whControllerId: this.service.generateId(), whControllerNo: 'R03', whControllerName: 'Replenishment Controller 3'},
                    { whControllerId: this.service.generateId(), whControllerNo: 'R04', whControllerName: 'Replenishment Controller 4'},
                ];

                await this.addList({ bid, brid, data: whControllers, batch: true });
                await this.flush();

                resolve(whControllers)
            } catch(e) {
                reject(e)
            }
        })
    }


}
