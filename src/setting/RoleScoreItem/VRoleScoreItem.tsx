import * as React from 'react';
import { VPage, Page, UiSchema, UiInputItem, UiImageItem, UiIdItem, Form, Context } from 'tonva';
import { Schema } from 'tonva';
import _ from 'lodash';
import { tv } from 'tonva';
import { CRoleScoreItemList } from './CRoleScoreItemList';

const schema: Schema = [
    { name: 'id', type: 'id', required: false },
    { name: 'role', type: 'id', required: true },
    { name: 'scoreItem', type: 'id', required: true },
    { name: 'CalculationFormula', type: 'string', required: true },
    { name: 'IsValid', type: 'boolean', required: true },
];

export class VRoleScoreItem extends VPage<CRoleScoreItemList> {

    private form: Form;
    private roleScoreItemData: any;
    private aa: string;

    private uiSchema: UiSchema = {
        items: {
            id: { visible: false },
            role: {
                widget: 'id', label: '岗位', placeholder: '岗位',
                pickId: async (context: Context, name: string, value: number) => await this.controller.pickRole(context, name, value),
                Templet: (item: any) => {
                    let { obj } = item;
                    if (!obj) return <small className="text-muted">请选择岗位</small>;
                    return <>
                        {tv(obj, v => <>{v.name}</>)}
                    </>;
                }
            } as UiIdItem,
            scoreItem: {
                widget: 'id', label: '积分项', placeholder: '积分项',
                pickId: async (context: Context, name: string, value: number) => await this.controller.pickScoreItem(context, name, value),
                Templet: (item: any) => {
                    let { obj } = item;
                    if (!obj) return <small className="text-muted">请选择积分项</small>;
                    return <>
                        {tv(obj, v => <>{v.name}</>)}
                    </>;
                }
            } as UiIdItem,
            CalculationFormula: { widget: 'text', label: '计算公式', placeholder: '必填' } as UiInputItem,
            IsValid: { widget: 'checkbox', label: '有效', defaultValue: true },
            submit: { widget: 'button', label: '提交' },
        }
    }

    async open(roleScoreItemData: any) {
        this.roleScoreItemData = roleScoreItemData;
        this.openPage(this.page);
    }

    private onFormButtonClick = async (name: string, context: Context) => {
        await this.controller.saveRoleScoreItem(context.form.data);
    }

    private onSaveRoleScoreItem = async () => {
        if (!this.form) return;
        await this.form.buttonClick("submit");
    }

    private page = () => {
        let descriptionData = _.clone(this.roleScoreItemData);
        let footer: any;
        footer = <button type="button"
            className="btn btn-primary w-100"
            onClick={this.onSaveRoleScoreItem}>保存</button>;

        return <Page header="岗位积分项" footer={footer}>
            <div className="p-3 bg-white">
                <Form ref={v => this.form = v} className="m-3"
                    schema={schema}
                    uiSchema={this.uiSchema}
                    formData={descriptionData}
                    onButtonClick={this.onFormButtonClick}
                    fieldLabelSize={3}
                />
            </div>
        </Page>
    }
}
