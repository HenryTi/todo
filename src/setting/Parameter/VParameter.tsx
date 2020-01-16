import * as React from 'react';
import { VPage, Page, UiSchema, UiInputItem, UiImageItem, UiIdItem, Form, Context } from 'tonva';
import { Schema } from 'tonva';
import _ from 'lodash';
import { tv } from 'tonva';
import { CParameterList } from './CParameterList';

const schema: Schema = [
    { name: 'id', type: 'id', required: false },
    { name: 'name', type: 'string', required: true },
    { name: 'Value', type: 'string', required: true },
];

export class VParameter extends VPage<CParameterList> {

    private form: Form;
    private parameterData: any;

    private uiSchema: UiSchema = {
        items: {
            id: { visible: false },
            name: { widget: 'text', label: '参数名', placeholder: '必填' } as UiInputItem,
            Value: { widget: 'text', label: '参数值', placeholder: '必填' } as UiInputItem,
            submit: { widget: 'button', label: '提交' },
        }
    }

    async open(parameterData: any) {
        this.parameterData = parameterData;
        this.openPage(this.page);
    }

    private onFormButtonClick = async (name: string, context: Context) => {
        await this.controller.saveParameter(context.form.data);
    }

    private onSaveParameter = async () => {
        if (!this.form) return;
        await this.form.buttonClick("submit");
    }

    private page = () => {
        let descriptionData = _.clone(this.parameterData);
        let footer: any;
        footer = <button type="button"
            className="btn btn-primary w-100"
            onClick={this.onSaveParameter}>保存</button>;

        return <Page header="参数配置" footer={footer}>
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
