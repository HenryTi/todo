import * as React from 'react';
import { Tuid } from 'tonva';
import { PageItems } from 'tonva';
import { CUqBase } from "tonvaApp";
import { VSetting } from './VSetting'
import { CSelectRoleScoreItemList } from './RoleScoreItem/CRoleScoreItemList';
import { CSelectParameterList } from './Parameter/CParameterList';
import { CSelectScoreItemList } from './ScoreItem/CScoreItemList';

export class CSetting extends CUqBase {

    protected async internalStart() {

    }

    //岗位积分项
    openRoleScoreItemList = async () => {
        let cRoleScoreItemList = this.newC(CSelectRoleScoreItemList);
        await cRoleScoreItemList.start();
    }

    //积分项
    openScoreItemList = async () => {
        let cScoreItemList = this.newC(CSelectScoreItemList);
        await cScoreItemList.start();
    }

    //参数
    openParameterList = async () => {
        let cParameterList = this.newC(CSelectParameterList);
        await cParameterList.start();
    }

    tab = () => this.renderView(VSetting);

}