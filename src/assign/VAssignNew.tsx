import * as React from 'react';
import { VPage, Form, ItemSchema, StringSchema, ButtonSchema, UiSchema, UiButton, Context, UiTextItem } from "tonva";
import { CAssign } from "./CAssign";
import { VAssignEdit } from './VAssignEdit';

export class VAssignNew extends VPage<CAssign> {
	private onNewAssign = async (button:string, context:Context) => {
		let {caption} = context.data;
		await this.controller.newAssign(caption);
		this.closePage();
		this.openVPage(VAssignEdit);
	}

	private schema:ItemSchema[] = [
		{name: 'caption', type: 'string', required: true} as StringSchema,
		{name: 'submit', type: 'submit'} as ButtonSchema,
	];
	private uiSchema: UiSchema = {
		items: {
			caption: {
				widget: 'text',
				label: '主题',
			} as UiTextItem,
			submit: {
				widget: 'button',
				label: '下一步',
				className: 'btn btn-primary',
			} as UiButton,
		}
	}
	header() {
		return '新任务';
	}
	content() {
		return <Form className="p-3" 
			onButtonClick={this.onNewAssign}
			onEnter={this.onNewAssign}
			schema={this.schema}
			uiSchema={this.uiSchema}
			fieldLabelSize={2} />;
	}
	protected get back():'close' | 'back' | 'none' {
		return 'close';
	}
	protected afterBack = () => {
		this.returnCall(false);
	}
}