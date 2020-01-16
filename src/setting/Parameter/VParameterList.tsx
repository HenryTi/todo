import * as React from 'react';
import { VPage, Page } from 'tonva';
import { CParameterList } from './CParameterList';
import { List, LMR, FA } from 'tonva';
import { tv } from 'tonva';

export class VParameterList extends VPage<CParameterList> {

    async open() {
        this.openPage(this.page);
    }

    private onContactRender = (parameter: any) => {
        let { onEditParameter } = this.controller;
        let right = <div className="p-2 cursor-pointer text-info" onClick={() => onEditParameter(parameter)}>
            {tv(parameter, v => <>{v.Value}</>)}&nbsp;&nbsp;<FA name="edit" />
        </div>
        let left = <div>{tv(parameter, v => <>{v.name}</>)}</div>;
        return <LMR left={left} right={right} className="px-3 py-2">
        </LMR>
    }

    private page = () => {

        let { parameters, onNewParameter } = this.controller;
        let right =
            <div onClick={() => onNewParameter()} >
                <span className="fa-stack">
                    <i className="fa fa-square fa-stack-2x text-primary"></i>
                    <i className="fa fa-plus fa-stack-1x"></i>
                </span>
            </div>;
        let parameterList = <List items={parameters} item={{ render: this.onContactRender }} none="无记录" />;
        return <Page right={right} header="参数配置">
            {parameterList}
        </Page>
    }
}