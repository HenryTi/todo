import * as React from 'react';
import { Prop, Page, VPage, IconText, PropGrid } from 'tonva';
import { observer } from 'mobx-react';
import { CSetting } from './CSetting';

export class VSetting extends VPage<CSetting> {

    async open(param?: any) {

    }

    private openRoleScoreItemList = async () => {
        this.controller.openRoleScoreItemList();
    }

    private openScoreItemList = async () => {
        this.controller.openScoreItemList();
    }

    private openParameterList = async () => {
        this.controller.openParameterList();
    }

    render() {
        return <this.content />;
    }

    private content = observer(() => {

        let rows: Prop[];

        rows = [
            '',
            {
                type: 'component',
                component: <IconText iconClass="text-info mr-2" icon="list" text="岗位积分项" />,
                onClick: this.openRoleScoreItemList
            },
            '',
            {
                type: 'component',
                component: <IconText iconClass="text-info mr-2" icon="navicon" text="积分项" />,
                onClick: this.openScoreItemList
            },
            '',
            {
                type: 'component',
                component: <IconText iconClass="text-info mr-2" icon="wrench" text="参数" />,
                onClick: this.openParameterList
            },
        ];
        return <PropGrid rows={rows} values={{}} />;
    })
}