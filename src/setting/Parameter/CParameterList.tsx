import { CUqBase } from "tonvaApp";
import { VParameterList } from './VParameterList'
import { VParameter } from './VParameter'

export abstract class CParameterList extends CUqBase {

    fromOrderCreation: boolean;
    parameters: any[] = [];

    async internalStart(fromOrderCreation: boolean) {

        this.fromOrderCreation = fromOrderCreation;
        this.parameters = await this.uqs.performance.ParameterConfiguration.search("", 0, 100);
        this.openVPage(VParameterList);
    }

    saveParameter = async (parameter: any) => {

        if (parameter.id === undefined) {
            parameter.CreateTime = Date.now();
            parameter.user = this.user.id;
            await this.uqs.performance.ParameterConfiguration.save(undefined, parameter);
        } else {
            await this.uqs.performance.ParameterConfiguration.save(parameter.id, parameter);
        }

        let cParameterList = this.newC(CSelectParameterList);
        await cParameterList.start();
    }

    /**
    * 打开新建界面
    */
    onNewParameter = async () => {
        this.openVPage(VParameter);
    }
    /**
    * 打开编辑界面
    */
    onEditParameter = async (parameter: any) => {
        this.openVPage(VParameter, parameter);
    }
}

export class CSelectParameterList extends CParameterList {
    protected async getIsDefault(userSetting: any, userContactId: number): Promise<boolean> {
        let { shippingParameter } = userSetting;
        return shippingParameter && shippingParameter.id === userContactId;
    }

}