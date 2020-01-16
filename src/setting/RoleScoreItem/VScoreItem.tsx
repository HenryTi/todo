import * as React from 'react';
import { VPage, Page } from 'tonva';
import { FA } from 'tonva';
import { CScoreItem } from './CScoreItem';

export class VScoreItem extends VPage<CScoreItem> {
    private backLevel = 0;

    async open(param: any) {
        let scoreItems = await this.controller.getScoreItems();
        this.openPage(this.page, { items: scoreItems });
    }

    private page = (scoreItems: any) => {
        this.backLevel++;
        return <Page header="选择积分项">
            <div className="row no-gutters">
                {scoreItems.items.map((v: any) => this.renderScoreItemT(v, this.onScoreItemClick))}
            </div>
        </Page>
    }

    private renderScoreItemT = (scoreitem: any, onClick: any) => {
        let { id, CalculationFormula, name } = scoreitem;
        return <div key={id} className="col-6 col-md-4 col-lg-3 cursor-pointer" >
            <div className="pt-1 pb-1 px-2" onClick={() => onClick(scoreitem)}
                style={{ border: '1px solid #eeeeee', marginRight: '-1px', marginBottom: '-1px' }}
            >
                <span className="ml-1 align-middle">
                    <FA name="chevron-right" className="text-info small" />
                    &nbsp; {name}({CalculationFormula})
                </span>
            </div>
        </div>;
    }

    private onScoreItemClick = async (item: any) => {
        this.controller.getScoreItemBox(item.id);
        this.closePage(this.backLevel);
    }
}