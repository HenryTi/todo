import { CUqBase } from "tonvaApp";
import { VScoreItemList } from './VScoreItemList'
import { VScoreItem } from './VScoreItem'

export abstract class CScoreItemList extends CUqBase {

    fromOrderCreation: boolean;
    scoreItems: any[] = [];

    async internalStart(fromOrderCreation: boolean) {

        this.fromOrderCreation = fromOrderCreation;
        this.scoreItems = await this.uqs.performance.ScoreItem.search("", 0, 100);
        this.openVPage(VScoreItemList);
    }

    saveScoreItem = async (scoreItem: any) => {

        if (scoreItem.id === undefined) {
            scoreItem.CreateTime = Date.now();
            scoreItem.user = this.user.id;
            await this.uqs.performance.ScoreItem.save(undefined, scoreItem);
        } else {
            await this.uqs.performance.ScoreItem.save(scoreItem.id, scoreItem);
        }

        let cScoreItemList = this.newC(CSelectScoreItemList);
        await cScoreItemList.start();
    }

    /**
    * 打开新建界面
    */
    onNewScoreItem = async () => {
        this.openVPage(VScoreItem);
    }
    /**
    * 打开编辑界面
    */
    onEditScoreItem = async (scoreItem: any) => {
        this.openVPage(VScoreItem, scoreItem);
    }
}

export class CSelectScoreItemList extends CScoreItemList {
    protected async getIsDefault(userSetting: any, userContactId: number): Promise<boolean> {
        let { shippingScoreItem } = userSetting;
        return shippingScoreItem && shippingScoreItem.id === userContactId;
    }

}