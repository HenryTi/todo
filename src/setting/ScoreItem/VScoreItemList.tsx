import * as React from 'react';
import { VPage, Page } from 'tonva';
import { CScoreItemList } from './CScoreItemList';
import { List, LMR, FA } from 'tonva';
import { tv } from 'tonva';

export class VScoreItemList extends VPage<CScoreItemList> {

    async open() {
        this.openPage(this.page);
    }

    private onContactRender = (scoreItem: any) => {
        let { onEditScoreItem } = this.controller;
        let right = <div className="p-2 cursor-pointer text-info" onClick={() => onEditScoreItem(scoreItem)}>
            {tv(scoreItem, v => <>{v.CalculationFormula}</>)}&nbsp;&nbsp;<FA name="edit" />
        </div>
        let left = <div>{tv(scoreItem, v => <>{v.name}</>)}</div>;
        return <LMR left={left} right={right} className="px-3 py-2">
        </LMR>
    }

    private page = () => {

        let { scoreItems, onNewScoreItem } = this.controller;
        let right =
            <div onClick={() => onNewScoreItem()} >
                <span className="fa-stack">
                    <i className="fa fa-square fa-stack-2x text-primary"></i>
                    <i className="fa fa-plus fa-stack-1x"></i>
                </span>
            </div>;
        let scoreItemList = <List items={scoreItems} item={{ render: this.onContactRender }} none="无记录" />;
        return <Page right={right} header="积分项配置">
            {scoreItemList}
        </Page>
    }
}