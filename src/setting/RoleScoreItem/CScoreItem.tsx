import { CUqBase } from "tonvaApp";
import { VScoreItem } from './VScoreItem';

export class CScoreItem extends CUqBase {

    protected async internalStart() {
        this.openVPage(VScoreItem);
    }

    getScoreItems = async (): Promise<any[]> => {
        return await this.uqs.performance.ScoreItem.search("", 0, 100);
    }
    getScoreItemBox = async (roleTuid: number): Promise<any> => {
        this.returnCall(this.uqs.performance.ScoreItem.boxId(roleTuid));
    }
}