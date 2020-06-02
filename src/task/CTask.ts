import _ from 'lodash';
import { observable } from 'mobx';
import { CUqBase, EnumTaskState } from "../tapp";
import { VMyTasks } from "./VMyTasks";
import { QueryPager } from "tonva";
import { VTask } from "./VTask";
import { Task, Assign, AssignTask, Todo } from "../models";
import { Performance, EnumTaskStep } from '../tapp'
import { VTakeAssign } from './VTakeAssign';
import { VDone } from './VDone';
import { VCheck } from './VCheck';
import { VRate } from './VRate';
import { VTodoEdit } from './VTodoEdit';

export class CTask extends CUqBase {
	private performance: Performance;

	publishAssignCallback:(assign:Assign)=>Promise<void>;
	myTasksPager: QueryPager<AssignTask>;
	@observable task: Task;

	protected async internalStart() {
	}

	init() {
		this.performance = this.uqs.performance;
		this.myTasksPager = new QueryPager(this.performance.GetMyTaskArchive, 10, 30, true);
	}

	async loadTaskArchive(step: EnumTaskStep) {
		this.myTasksPager.reset();
		await this.myTasksPager.first({step});
	}

	async showMyTasks() {
		await this.myTasksPager.first({});
		this.openVPage(VMyTasks);
	}

	async showTask(taskId:number) {
		let retTask = await this.performance.GetTask.query({taskId});
		let task:Task = {} as any;
		_.mergeWith(task, retTask.task[0]);
		task.todos = retTask.todos;
		task.flow = retTask.flow;
		task.meTask = retTask.meTask;
		this.task = task;
		this.startAction();
		this.openVPage(VTask);
	}

	async showNew(assign: Assign) {
		let {caption, discription, items} = assign;
		let todos = items.map(v => {
			let {id, discription} = v;
			let ret:Todo = {
				id: undefined,
				task: undefined,
				assignItem: id,
				discription: discription,
				x: 0,
				$update: new Date()
			};
			return ret;
		});
		this.task = {
			id: undefined,
			assign,
			caption,
			discription,
			$create: new Date(),
			$update: new Date(),
			owner: this.user.id,
			state: EnumTaskState.todo,
			todos: todos,
			meTask: undefined,
			flow: undefined,
		};
		this.startAction();
		this.openVPage(VTakeAssign);
	}

	takeAssign = async ():Promise<boolean> => {
		let ret = await this.performance.TakeAssign.submit({
			assignId: this.task.assign.id, 
			todos:this.task.todos
		});
		if (ret.length === 0) return false;
		this.cApp.refreshJob();
		this.cApp.pushTaskNote(ret);
		return true;
	}

	async showDone() {
		this.openVPage(VDone);
	}
	
	async doneTask() {
		let ret = await this.performance.TaskDone.submit({taskId: this.task.id});
		this.cApp.refreshJob();
		this.cApp.pushTaskNote(ret);
	}

	async showTaskCheck() {
		this.openVPage(VCheck);
	}

	async passTask() {
		let ret = await this.performance.TaskPass.submit({taskId: this.task.id});
		this.cApp.refreshJob();
		this.cApp.pushTaskNote(ret);
	}

	async failTask() {
		let ret = await this.performance.TaskFail.submit({taskId: this.task.id});
		this.cApp.refreshJob();
		this.cApp.pushTaskNote(ret);
	}

	async showTaskRate() {
		this.openVPage(VRate);
	}

	async rateTask() {
		let ret = await this.performance.TaskRate.submit({taskId: this.task.id});
		this.cApp.refreshJob();
		this.cApp.pushTaskNote(ret);
	}

	showTodoEdit = async () => {
		this.openVPage(VTodoEdit, undefined, ret => {
			
		});
	}

	async addTodo(content:string): Promise<Todo> {
		let id:number = undefined;
		let assignItem: number;
		let todo = {
			id: id, 
			task: this.task.id,
			assignItem,
			discription: content,
			x: 0,
			$update: new Date()
		};
		let ret = await this.uqs.performance.Todo.save(undefined, todo);
		todo.id = ret.id;
		this.task.todos.push(todo);
		return todo;
	}

	async xTodo(id:number, x:0|1) {
		let {todos} = this.task;
		let index = todos.findIndex(v => v.id === id);
		if (index < 0) return;
		await this.uqs.performance.Todo.saveProp(id, 'x', x);
		let todo = todos[index];
		todo.x = 1;
	}

	async saveTodoDone(todo:Todo, done:0|1) {
		await this.performance.Todo.saveProp(todo.id, 'done', done);
		todo.done = done;
	}

	async saveTodoDoneMemo(todo:Todo, memo:string) {
		await this.performance.Todo.saveProp(todo.id, 'doneMemo', memo);
		todo.doneMemo = memo;
	}

	async saveTodoCheck(todo:Todo, check:0|1) {
		await this.performance.Todo.saveProp(todo.id, 'check', check);
		todo.check = check;
	}

	async saveTodoCheckMemo(todo:Todo, checkMemo:string) {
		await this.performance.Todo.saveProp(todo.id, 'checkMemo', checkMemo);
		todo.checkMemo = checkMemo;
	}
}
