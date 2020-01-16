import * as React from 'react';
import { VPage, Page, UiSchema, UiInputItem, UiImageItem, UiIdItem, Form, Context } from 'tonva';
import { Schema } from 'tonva';
import _ from 'lodash';
import { tv } from 'tonva';
import { CScoreItemList } from './CScoreItemList';

const schema: Schema = [
    { name: 'id', type: 'id', required: false },
    { name: 'name', type: 'string', required: true },
    { name: 'CalculationFormula', type: 'string', required: true },
    { name: 'IsValid', type: 'boolean', required: true },
];

export class VScoreItem extends VPage<CScoreItemList> {

    private form: Form;
    private scoreItemData: any;

    private uiSchema: UiSchema = {
        items: {
            id: { visible: false },
            name: { widget: 'text', label: '积分项名', placeholder: '必填' } as UiInputItem,
            CalculationFormula: { widget: 'text', label: '计算公式', placeholder: '必填' } as UiInputItem,
            IsValid: { widget: 'checkbox', label: '有效', defaultValue: true },
            submit: { widget: 'button', label: '提交' },
        }
    }

    async open(scoreItemData: any) {
        this.scoreItemData = scoreItemData;
        this.openPage(this.page);
    }

    private onFormButtonClick = async (name: string, context: Context) => {
        await this.controller.saveScoreItem(context.form.data);
    }

    private onSaveParameter = async () => {
        if (!this.form) return;
        await this.form.buttonClick("submit");
    }

    private page = () => {
        let descriptionData = _.clone(this.scoreItemData);
        let footer: any;
        footer = <button type="button"
            className="btn btn-primary w-100"
            onClick={this.onSaveParameter}>保存</button>;

        return <Page header="积分项配置" footer={footer}>
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
