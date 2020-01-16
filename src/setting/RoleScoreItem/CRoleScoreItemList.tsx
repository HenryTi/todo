import { Context } from 'tonva';
import { CUqBase } from "tonvaApp";
import { VRoleScoreItemList } from './VRoleScoreItemList'
import { VRoleScoreItem } from './VRoleScoreItem'
import { CRole } from './CRole';
import { CScoreItem } from './CScoreItem';

export abstract class CRoleScoreItemList extends CUqBase {

    fromOrderCreation: boolean;
    roleScoreItems: any[] = [];

    async internalStart(fromOrderCreation: boolean) {

        this.fromOrderCreation = fromOrderCreation;
        this.roleScoreItems = await this.uqs.performance.getRoleScoreItem.table(undefined);
        this.openVPage(VRoleScoreItemList);
    }

    /**
    * 打开新建界面
    */
    onNewRoleScoreItem = async () => {
        this.openVPage(VRoleScoreItem, { description: undefined });
    }

    /**
    * 打开编辑界面
    */
    onEditRoleScoreItem = async (roleScoreItem: any) => {
        this.openVPage(VRoleScoreItem, roleScoreItem);
    }

    pickRole = async (context: Context, name: string, value: number): Promise<number> => {
        let cRole = this.newC(CRole);
        return await cRole.call<number>();
    }

    pickScoreItem = async (context: Context, name: string, value: number): Promise<number> => {
        let cScoreItem = this.newC(CScoreItem);
        return await cScoreItem.call<number>();
    }

    async saveRoleScoreItem(roleScoreItem: any) {
        let isvalid = roleScoreItem.IsValid == true ? 1 : 0;
        await this.uqs.performance.RoleScoreItem.add({ scoreItem: roleScoreItem.scoreItem.id, arr1: [{ role: roleScoreItem.role.id, CalculationFormula: roleScoreItem.CalculationFormula, IsValid: isvalid, user: this.user.id, CreateTime: Date.now() }] });
        let cRoleScoreItemList = this.newC(CSelectRoleScoreItemList);
        await cRoleScoreItemList.start();
    }
}

export class CSelectRoleScoreItemList extends CRoleScoreItemList {
    protected async getIsDefault(userSetting: any, userContactId: number): Promise<boolean> {
        let { shippingRoleScoreItem } = userSetting;
        return shippingRoleScoreItem && shippingRoleScoreItem.id === userContactId;
    }

}