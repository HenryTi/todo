import * as React from 'react';
import { VPage, Page } from 'tonva';
import { FA } from 'tonva';
import { CRole } from './CRole';

export class VRole extends VPage<CRole> {
    private backLevel = 0;

    async open(param: any) {
        let roles = await this.controller.getRoles();
        this.openPage(this.page, { items: roles });
    }

    private page = (roles: any) => {
        this.backLevel++;
        return <Page header="选择岗位">
            <div className="row no-gutters">
                {roles.items.map((v: any) => this.renderRoleT(v, this.onRoleClick))}
            </div>
        </Page>
    }

    private renderRoleT = (role: any, onClick: any) => {
        let { id, no, name } = role;
        return <div key={id} className="col-6 col-md-4 col-lg-3 cursor-pointer" >
            <div className="pt-1 pb-1 px-2" onClick={() => onClick(role)}
                style={{ border: '1px solid #eeeeee', marginRight: '-1px', marginBottom: '-1px' }}
            >
                <span className="ml-1 align-middle">
                    <FA name="chevron-right" className="text-info small" />
                    &nbsp;{name}({no})
                </span>
            </div>
        </div>;
    }

    private onRoleClick = async (item: any) => {
        this.controller.getRoleBox(item.id);
        this.closePage(this.backLevel);
    }
}