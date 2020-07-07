import { EnumNoteType, EnumTaskState, EnumTaskAct } from '../tapp';
import { BoxId } from 'tonva';

export interface GroupItem {
	id: number;
	//name: string;
	group: BoxId;
	time: Date;
	owner: number;
	unread: number;
	count: number;
	isDefault: number;
	memberCount: number;
}

/*
export interface Doing {
	task: number; // ID ASC,
	assign: any; // ID Assign,
	worker: number; // ID,
	$create: Date; // TIMESTAMP, 
	state: EnumTaskState; 
	date: Date;		// task act time
}
*/

export interface Group {
	id: number;
	count: number;
	name: string;
	discription: string;
	owner: number;
}

export interface Note {
	id: number;
	group: number;
	content: string;
	type?: EnumNoteType;
	obj?: number; // | NoteObj;
	owner: number;
	x: number;
	$create: Date;
}

export interface Assign {
	id: number;
	caption: string;
	owner: number;
	checker: number;
	rater: number;
	point: number;
	groupId: number;
	end: number;				// 1: 表示结束
	groupMemberCount: number;
	$create: Date;
	$update: Date;
	items: AssignItem[];
	tasks?: AssignTask[];
	//todos?: Todo[];
	toList: AssignToItem[];

	open: number; 		// 0:开放 1: 一个人执行 2:指定人
	discription: string;
}

export interface AssignItem {
	id: number;
	discription: string;
	x: number;
}

export interface AssignTask {
	id: number; // Task ID ASC,
	assign: number|any; // ID Assign,
	worker: number; // ID,
	$create: Date; // TIMESTAMP,
	actionTime: Date;
	state: EnumTaskState;
	end: number;			// 1表示结束
	date: Date;
	stepDate: Date;
	stepComment: string;
	flows?: TaskFlow[];
	todos?: Todo[];
}

export interface AssignToItem {
	to: number;
}

export interface Task {
	id: number;
	assign: Assign;
	caption: string;
	discription: string;
	owner: number;
	$create: Date;
	$update: Date;
	state: EnumTaskState;
	todos: Todo[];
	meTask: MeTask[];
	flows: TaskFlow[];
}

export interface Todo {
	id: number;
	task: number;
	assignItem: number;
	discription: string;
	x: number;
	$update: Date;
	done?: 0|1;
	doneMemo?: string;
	check?: 0|1;
	checkMemo?: string;
}

export interface MeTask {
	me: number,
	act: number,			// EnumTaskStep
}

export interface TaskFlow {
	user: number;
	act: EnumTaskAct;
	state: EnumTaskState;			// 0:初建，10:领办，20:已办，30:拒办，40:取消
	date: Date;
	comment: string;
}
