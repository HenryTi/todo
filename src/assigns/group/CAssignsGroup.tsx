import React from "react";
import { CAssigns } from "../CAssigns";
import { QueryPager, BoxId, tv, useUser } from "tonva";
import { Group, AssignTask } from "models";
import { VListForGroup } from "./VListForGroup";
import { VGroupDetail } from "./VGroupDetail";
import { observable } from "mobx";
import { VAssignForGroup, VAssignForG0 } from "./VAssignForGroup";
import { CSend } from "./send";
import { VCheck, VRate } from "assigns/task";

export class CAssignsGroup extends CAssigns {
	groupBoxId:BoxId;
	@observable group: Group;

	init(group:BoxId) {
		super.init(group);
		this.groupBoxId = group;
	}

	get caption():any {return tv(this.groupBoxId, (values)=><>{values.name}</>)}
	get groupId(): number {return this.groupBoxId.id;}
	protected openVList():void {this.openVPage(VListForGroup);}
	protected openVAssign(): void {
		this.openVPage(this.assign.groupMemberCount>1? VAssignForGroup : VAssignForG0);
	}

	showGroupDetail = async () => {
		await this.groupBoxId.assure();
		this.group = this.groupBoxId.obj;
		let groupMembersPager = new QueryPager(this.performance.GetGroupMembers, 10, 30);
		groupMembersPager.setEachPageItem((item:any) => {
			useUser(item.member);
		});
		groupMembersPager.first({group: this.group.id});
		this.openVPage(VGroupDetail, groupMembersPager);
	}

	async saveGroupProp(props:any) {
		await this.performance.SaveGroupProp.submit(props);
		this.performance.Group.resetCache(props.id);
	}

	async groupAddMember(member:any) {
		await this.performance.AddGroupMember.submit({group: this.groupId, member: member});
		if (this.group) this.group.count ++;
	}

	async groupRemoveMembers(members:any[]) {
		await this.performance.RemoveGroupMember.submit({
			group: this.groupId, 
			members: members
		});
		if (this.group) this.group.count--;
	}

	showAssignTo = async () => {
		let cSend = this.newSub(CSend);
		cSend.start();
	}

	showCheck = async (task: AssignTask) => {
		this.openVPage(VCheck, task);
	}

	showRate = async (task: AssignTask) => {
		this.openVPage(VRate, task);
	}

	/*
	showFlowDetail = async (task: AssignTask) => {
		this.showFlowDetail(task);
		//this.openVPage(VFlowDetail, task);
	}
	*/
}
