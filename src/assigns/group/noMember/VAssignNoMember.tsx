import React from "react";
import { VAssignDraft, VAssignEnd } from "../../VAssign";
import { CAssignsNoMember } from "./CAssignsNoMember";
import { AssignItem } from "models";
import { FooterInputProps, VFooterInput } from "../../VFooterInput";

export class VAssignDraftNoMember extends VAssignDraft<CAssignsNoMember> {
	protected get selfDoneCaption():string {return '完成'}

	protected renderAssignItem(item:AssignItem) {
		let {id, discription} = item;
		let onCheckChanged = (isChecked:boolean):Promise<void> => {
			//alert(isChecked);
			return;
		}
		return <div className="pl-4 bg-white">
			{this.renderTodoWithCheck(id, discription, onCheckChanged, false)}
		</div>;
	}

	footer() {
		let props:FooterInputProps = {
			onAdd: async (inputContent:string):Promise<void> => {
				await this.controller.saveTodoItem(inputContent);
				this.scrollToTop();
			},
			caption: '添加我的任务事项'
		};
		return this.renderVm(VFooterInput, props);
	}

	protected renderContent() {
		return super.renderContent();
	}
}

export class VAssignEndNoMember extends VAssignEnd<CAssignsNoMember> {
	protected get selfDoneCaption():string {return '完成'}

}
