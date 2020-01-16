import { CUqBase } from "tonvaApp";
import { VRole } from './VRole';

export class CRole extends CUqBase {

    protected async internalStart() {
        this.openVPage(VRole);
    }

    getRoles = async (): Promise<any[]> => {
        return await this.uqs.hr.Role.search("", 0, 100);
    }
    getRoleBox = async (roleTuid: number): Promise<any> => {
        this.returnCall(this.uqs.hr.Role.boxId(roleTuid));
    }
}