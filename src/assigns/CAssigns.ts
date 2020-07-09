import _ from 'lodash';
import { CUqBase, EnumTaskState, TaskAct } from "tapp";
import { Performance } from '../tapp'
import { Assign, AssignTask, Todo, AssignItem } from "models";
import { BoxId, Tuid } from "tonva";
import { observable, computed } from "mobx";
import { VDone, VCheck, VRate } from './task';
import { VFlowDetail } from './task';

export interface AssignListItem {
	assign: BoxId;
}

export abstract class CAssigns extends CUqBase {
	protected performance: Performance;
	@observable assign: Assign;
	@observable assignListItems: AssignListItem[];
	@observable endListItems: AssignListItem[];
	@computed get isMyAssign():boolean { return this.isMe(this.assign?.owner)};

	protected async internalStart() {
	}

	abstract get caption(): any;
	abstract get groupId(): number;
	protected abstract openVList(): void;
	protected abstract openVAssign(): void

	init(param?:any) {
		this.performance = this.uqs.performance;
	}

	showList = async () => {
		let params = {group: this.groupId, end: 0};
		let result = await this.performance.GetAssigns.query(params, true);
		this.assignListItems = result.ret;
		this.openVList();
	}

	async loadEndItems() {
		let params = {group: this.groupId, end: 1};
		let result = await this.performance.GetAssigns.query(params, true);
		this.endListItems = result.ret;
	}

	showAssign = async (assignId?: BoxId) => {
		let id:any = assignId;
		if (!assignId) id = this.assign.id;
		await this.loadAssign(id);
		this.openVAssign();
	}

	private async loadAssign(assignId:BoxId | number) {
		let retAssign = await this.performance.GetAssign.query({assignId}, true);
		let {assign, items, tasks, todos, tolist} = retAssign;
		let assignObj:Assign = {items, tasks, toList:tolist} as any;
		_.mergeWith(assignObj, assign[0]);
		let discription:string = assignObj.discription;
		if (discription) assignObj.discription = discription.replace(/\\n/g, '\n');
		for (let task of tasks as AssignTask[]) {
			task.todos = (todos as Todo[]).filter(v => v.task === task.id);
			for (let todo of task.todos) {
				let {assignItem, discription} = todo;
				if (assignItem && !discription) {
					let item = (items as AssignItem[]).find(v => v.id===assignItem);
					if (item) todo.discription = item.discription;
				}
			}
		}
		this.assign = assignObj;
		this.onAssignLoaded();
	}

	protected onAssignLoaded() {}

	showFlowDetail = async (task:AssignTask) => {
		let ret = await this.uqs.performance.GetTaskFlow.query({taskId: task.id}, true);
		task.flows = ret.ret;
		this.openVPage(VFlowDetail, task);
	}

	newAssign = async (caption:string) => {
		let data = {group: this.groupId, caption};
		let {CreateAssign} = this.performance;
		let result = await CreateAssign.submit(data);
		let res = result;
		let {id} = res;
		let assign = this.performance.Assign.boxId(id);
		this.assignListItems.unshift({assign});
	}

	async saveAssignDiscription(discription: string) {
		await this.performance.Assign.saveProp(this.assign.id, 'discription', discription);
		this.assign.discription = discription;
	}

	saveAssignItem = async (todoContent: string):Promise<any> => {
		let assignItem = {
			id: undefined as any,
			assign: this.assign.id,
			discription: todoContent,
			x: 0
		};
		let ret = await this.performance.AssignItem.save(undefined, assignItem);
		assignItem.id = ret.id;
		this.assign.items.push({id:ret.id,discription:todoContent, x:0});
		return assignItem;
	}

	setAssignItemFlag = async (item:AssignItem, x:number):Promise<any> => {
		await this.performance.AssignItem.saveProp(item.id, 'x', x);
		item.x = x;
	}

	setAssignItemContent = async (item:AssignItem, v:string):Promise<any> => {
		await this.performance.AssignItem.saveProp(item.id, 'discription', v);
		item.discription = v;
	}

	selfDone = async () => {
		let {tasks} = this.assign;
		let task = tasks.find(v=>this.isMe(v.worker));
		if (task) {
			this.openVPage(VDone, task);
		}
		else {
			let toList:{to:number}[] = [];
			toList.push({to:this.user.id});
			let data = {
				assignId: this.assign.id,
				toList
			};
			await this.uqs.performance.SendAssign.submit(data);
			await this.loadAssign(this.assign.id);
			this.backPage();
			this.openVAssign();
		}
	}
	
	showDone = async () => {
		let {tasks} = this.assign;
		let task = tasks.find(v=>this.isMe(v.worker));
		this.openVPage(VDone, task);
	}

	setTodoFlag = async (todo: Todo, x:number):Promise<any> => {
		await this.performance.Todo.saveProp(todo.id, 'x', x);
		todo.x = x;
	}

	saveTodoContent = async (todo: Todo, v:string):Promise<any> => {
		await this.performance.Todo.saveProp(todo.id, 'discription', v);
		todo.discription = v;
	}

	saveTodoDone = async (todo: Todo, vDone:0|1) => {
		let { id } = todo;
		await this.performance.Todo.saveProp(id, 'done', vDone);
		todo.done = vDone;
	}

	saveTodoDoneMemo = async (todo: Todo, v:string) => {
		let { id } = todo;
		await this.performance.Todo.saveProp(id, 'donememo', v);
		todo.doneMemo = v;
	}

	saveTodoCheck = async (todo: Todo, vCheck:0|1) => {
		let { id } = todo;
		await this.performance.Todo.saveProp(id, 'check', vCheck);
		todo.check = vCheck;
	}

	saveTodoCheckMemo = async (todo: Todo, v:string) => {
		let { id } = todo;
		await this.performance.Todo.saveProp(id, 'checkmemo', v);
		todo.checkMemo = v;
	}

	getTaskAction(state:EnumTaskState):string {
		let {checker, rater} = this.assign;
		switch (state) {
			case EnumTaskState.start:
			case EnumTaskState.todo:
			case EnumTaskState.doing:
				return TaskAct.done;
			case EnumTaskState.done:
				if (checker) {
					if (this.isMe(checker) === true) return TaskAct.check;
					return;
				}
				if (rater) {
					if (this.isMe(rater)) return TaskAct.rate;
					return;
				}
				return;
			case EnumTaskState.pass:
				if (rater) {
					if (this.isMe(rater)) return TaskAct.rate;
					return;
				}
				return;
			case EnumTaskState.fail:
			case EnumTaskState.rated:
			case EnumTaskState.cancel:
				return;
		}
	}

	meAct = async () => {
		let task = this.assign.tasks.find(v => this.isMe(v.worker) === true);
		if (!task) {
			alert('task cannot be undefined');
			return;
		}
		let {state} = task;
		let {checker, rater} = this.assign;
		let v;
		switch (state) {
			default:
				alert('unkown state ' + state);
				return;
			case EnumTaskState.start:
			case EnumTaskState.todo:
			case EnumTaskState.doing:
				v = VDone;
				break;
			case EnumTaskState.done:
				if (checker > 0) v = VCheck;
				else if (rater > 0) v = VRate;
				break;
			case EnumTaskState.pass:
				if (rater > 0) v = VRate;
				break;
		}
		this.openVPage(v, task);
	}

	private afterAct(retAct: {end:number}) {
		if (retAct.end === 0) return;
		let assignId = this.assign.id;
		let index = this.assignListItems.findIndex(v => Tuid.equ(v.assign, assignId));
		if (index < 0) return;
		this.assignListItems.splice(index, 1);
		if (this.endListItems) {
			let assign = this.assignListItems[index];
			this.endListItems.unshift(assign);
		}
		this.cApp.addGroupAssignCount(this.groupId, -1);
	}

	doneAssign = async (point: number, comment: string) => {
		let ret = await this.performance.DoneAssign.submit({assign: this.assign.id, point, comment});
		this.afterAct(ret);
	}

	doneTask = async (task:number, point:number, comment:string) => {
		let ret = await this.performance.DoneTask.submit({task, point, comment});
		this.afterAct(ret);
	}

	passTask = async (task:number, point:number, comment: string) => {
		let ret = await this.performance.PassTask.submit({task, point, comment});
		this.afterAct(ret);
	}

	failTask = async (task:number, comment:string) => {
		let ret = await this.performance.FailTask.submit({task, comment});
		this.afterAct(ret);
	}

	rateTask = async (task:number, point:number, comment:string) => {
		let ret = await this.performance.RateTask.submit({task, point, comment});
		this.afterAct(ret);
	}
}
