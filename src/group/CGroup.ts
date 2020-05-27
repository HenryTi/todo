import { CUqBase } from "../tapp";
import { VMain } from "./VMain";
import { QueryPager, useUser, Tuid } from "tonva";
import { VGroup } from "./VGroup";
import { observable } from "mobx";
import { stateDefs } from "tools";
import { Task, Assign } from "../models";
import { VGroupDetail } from "./VGroupDetail";
import { Performance } from '../tapp'
import { NoteItem, NoteAssign, dataToNoteItem, createNoteAssign, createNoteText } from "./NoteItem";

export class CGroup extends CUqBase {
	private performance: Performance;

	@observable commandsShown: boolean = false;
	@observable currentGroup: any;
	@observable currentTask: Task;

	groupsPager: GroupsPager;
	groupNotesPager: QueryPager<NoteItem>;

    protected async internalStart() {
	}

	init() {
		this.performance = this.uqs.performance;
		this.groupsPager = new GroupsPager(this.performance.GetMyGroups, 10, 500, true);
		this.groupNotesPager = new QueryPager<NoteItem>(this.performance.GetGroupNotes, 10, 30, true);
		this.groupNotesPager.setItemConverter(this.noteItemConverter);
		this.groupNotesPager.setReverse();
	}
	
	tab = () => this.renderView(VMain);
	
	async load() {
		await this.groupsPager.first(undefined);
	}

	async saveGroup(parent:number, name:string, discription:string) {
		let data = {parent, name, discription};
		let ret = await this.performance.SaveGroup.submit(data);
		let retGroupId = ret?.group;
		let groupBoxId = this.performance.Group.boxId(retGroupId);
		this.groupsPager.items.unshift({group: groupBoxId, time: new Date()});
	}

	async saveGroupProp(props: {id:number, name:string, discription:string}) {
		await this.performance.SaveGroupProp.submit(props);
		this.performance.Group.resetCache(props.id);
	}

	async setGroup(groupId?:number) {
		if (!groupId) groupId = this.currentGroup?.id;
		if (!groupId) return;
		let {Group} = this.performance;
		this.currentGroup = await Group.assureBox(groupId);
	}

	private noteItemConverter = (item:any, queryResults:{[name:string]:any[]}):NoteItem => {
		return dataToNoteItem(this, item, queryResults);
	}
	showGroup = async (item: any) => {
		await this.groupNotesPager.first({group: item.group});
		item.unread = 0;
		this.openVPage(VGroup, undefined, ret => {
			this.currentGroup = undefined;
		});
		this.setGroup(item.group.id);
		this.cApp.resetTick();
	}

	async refresh() {
		let arr:Promise<any>[] = [this.groupsPager.refresh()];
		if (this.currentGroup) {
			arr.push(this.groupNotesPager.attach());
		}
		await Promise.all(arr);
		if (this.currentGroup) {
			let groupId = this.currentGroup.id;
			let item = this.groupsPager.items.find(v => Tuid.equ(v.group, groupId));
			if (item) {
				item.time = new Date();
				item.unread = 0;
			}
		}
	}

	private afterAddNote() {
		this.groupNotesPager.scrollToBottom();
		this.commandsShown = false;
	}

	addTextNote = async (content: string) => {
		let data = {
			group: this.currentGroup, 
			content, 
		};
		let ret = await this.performance.PushNote.submit(data);
		let retNoteId = ret?.note;
		let nts:NoteItem = createNoteText(this, this.user.id, content);
		nts.id = retNoteId;
		this.groupNotesPager.items.push(nts);
		this.afterAddNote();
	}
	saveTaskProp = async (prop:string, value:any) => {
		await this.performance.Assign.saveProp(this.currentTask.id, prop, value);
	}

	publishAssign = async (assign: Assign):Promise<void> => {
		let ret:{note:number} = await this.performance.PublishAssign.submit({
			assignId: assign.id,
			groupId: this.currentGroup.id
		});
		if (!ret) alert('publish assign error');
		let nts = createNoteAssign(this, this.user.id, ret.note);
		nts.id = ret.note;

		// eslint-disable-next-line
		let {id, caption, discription} = assign;
		nts.assignId = id;
		nts.caption = caption;
		nts.discription = discription;
		this.groupNotesPager.items.push(nts);
		this.afterAddNote();
	}

	showNewTask = async ():Promise<boolean> => {
		let ret = await this.cApp.showNewAssign();
		return ret;
	}
	showAssign = async (noteItem:NoteAssign) => {
		this.cApp.showAssign(noteItem.assignId); 
	}

	saveTodo = async (todoContent: string):Promise<any> => {
		let todo = {
			id: undefined as any,
			task: this.currentTask.id,
			state: 0,
			discription: todoContent,
		};
		let ret = await this.performance.Todo.save(undefined, todo);
		todo.id = ret.id;
		return todo;
	}

	// state 10: 待办，state 20: 正办
	taskAct = async (noteItem:NoteItem, toState:stateDefs.todo|stateDefs.doing) => {
		// eslint-disable-next-line
		let ret = await this.performance.TaskAct.submit({task: undefined, toState});
	}

	revokeTask = async (noteItem:NoteItem) => {
		await this.performance.RemoveTask.submit({noteItem, undefined});
	};

	async showGroupDetail() {
		let groupMembersPager = new QueryPager(this.performance.GetGroupMembers, 10, 30);
		groupMembersPager.setEachPageItem(item => {
			useUser(item.member);
		});
		groupMembersPager.first({group: this.currentGroup});
		this.openVPage(VGroupDetail, groupMembersPager);
	}

	async groupAddMember(member:any) {
		await this.performance.AddGroupMember.submit({group: this.currentGroup, member: member});
	}

	async groupRemoveMembers(members:any[]) {
		await this.performance.RemoveGroupMember.submit({
			group: this.currentGroup, 
			members: members
		});
	}
}

class GroupsPager extends QueryPager<any> {
	protected getRefreshPageId(item:any) {
		if (item === undefined) return;
		let pageId = item['group'];
		if (typeof pageId === 'object') {
			return pageId.id;
		}
		return pageId;
	}
}