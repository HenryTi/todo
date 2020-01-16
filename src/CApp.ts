import { CAppBase, IConstructor } from "tonva";
import 'bootstrap/dist/css/bootstrap.css';
import { CUqBase } from "./tonvaApp/CBase";
import { UQs } from "./tonvaApp/uqs";
import { VMain } from './tonvaApp/main';
import { CMe } from "me/CMe";
import { CHome } from "home/CHome";
import { CSetting } from "setting/CSetting";
/*
import { CMe } from "./me/CMe";
import { CPosts } from "./posts/CPosts";
import { CMedia } from "./media/CMedia";
import { CTemplets } from "./templets/CTemplets";
*/

export class CApp extends CAppBase {
    get uqs(): UQs { return this._uqs };

    cHome: CHome;
    cMe: CMe;
    cSetting: CSetting;
    /*
    cPosts: CPosts;
    cMedia: CMedia;
    cTemplets: CTemplets;
    */

    protected newC<T extends CUqBase>(type: IConstructor<T>): T {
        return new type(this);
    }

    protected async internalStart() {
        this.cHome = this.newC(CHome);
        this.cMe = this.newC(CMe);
        this.cSetting = this.newC(CSetting);
        /*
        this.cPosts = this.newC(CPosts);
        this.cMedia = this.newC(CMedia);
        this.cTemplets = this.newC(CTemplets);
        */
        this.showMain();
    }

    showMain(initTabName?: string) {
        this.openVPage(VMain, initTabName);
    }
}
