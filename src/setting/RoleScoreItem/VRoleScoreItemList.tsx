import * as React from 'react';
import { VPage, Page } from 'tonva';
import { CRoleScoreItemList } from './CRoleScoreItemList';
import { List, LMR, FA, tv } from 'tonva';

export class VRoleScoreItemList extends VPage<CRoleScoreItemList> {

    async open() {
        this.openPage(this.page);
    }

    private onContactRender = (roleScoreItem: any) => {
        let { onEditRoleScoreItem } = this.controller;
        let right = <div className="p-2 cursor-pointer text-info" onClick={() => onEditRoleScoreItem(roleScoreItem)}>
            <FA name="edit" />
        </div>
        return <LMR right={right} className="px-3 py-2">
            <div>
                {tv(roleScoreItem, v => <>{v.CalculationFormula}</>)}
            </div>
        </LMR>
    }

    private page = () => {

        let { roleScoreItems, onNewRoleScoreItem } = this.controller;
        let right =
            <div onClick={() => onNewRoleScoreItem()} >
                <span className="fa-stack">
                    <i className="fa fa-square fa-stack-2x text-primary"></i>
                    <i className="fa fa-plus fa-stack-1x"></i>
                </span>
            </div>;
        let roleScoreItemList = <List items={roleScoreItems} item={{ render: this.onContactRender }} none="无记录" />;
        return <Page right={right} header="岗位积分项">
            {roleScoreItemList}
        </Page>
    }
}