import { VListNoMember } from "./VListNoMember";
import { VAssignDraftNoMember, VAssignEndNoMember } from "./VAssignNoMember";
import { CAssignsForGroup } from "../CAssignsForGroup";

export class CAssignsNoMember extends CAssignsForGroup {
	protected openVList():void {this.openVPage(VListNoMember);}
	protected openVAssign(): void {
		this.openVPage(this.assign.end === 1? VAssignEndNoMember : VAssignDraftNoMember);
	}

	newAssign = async (caption:string) => {
		let data = {group:this.groupId, caption};
		let {CreateAndSendAssign} = this.performance;
		let result = await CreateAndSendAssign.submit(data);
		let res = result;
		let {id} = res;
		let assign = this.performance.Assign.boxId(id);
		this.assignListItems.unshift({assign});
	}

	saveTodoItem = async (todoContent: string):Promise<any> => {
		let id:number = undefined;
		let assignItem: number = undefined;
		let {tasks} = this.assign;
		let my = tasks.find(v => this.isMe(v.worker));
		if (!my)
			return;

		let todo = {
			id: id, 
			task: my.id,
			assignItem,
			discription: todoContent,
			x: 0,
			$update: new Date()
		};
		let ret = await this.uqs.performance.Todo.save(undefined, todo);
		todo.id = ret.id;
		my.todos.push(todo);
		return todo;
	}

}
