import * as React from 'react';
import { VPage, Muted, EasyTime, UserView, User, useUser, Image, FA } from "tonva";
import { CTask } from "./CTask";
import { Task } from 'models';
import { VTodoList } from './VTodoList';

export class VTaskCheck extends VPage<CTask> {
	private task: Task;
	private vTodoList: VTodoList;

	init() {
		this.task = this.controller.task;
		this.vTodoList = new VTodoList(this.controller);
		this.vTodoList.init(this.task.todos, false);
		useUser(this.task.assign.owner);
	}

	header() {
		return '查验';
	}

	private onPass = async () => {
		await this.controller.passTask();
		this.closePage(2);
	}

	private onFail = async () => {
		await this.controller.failTask();
		this.closePage(3);
	}

	private renderUser = (user: User) => {
		let {icon, name, nick} = user;
		return <><Image className="w-1-5c h-1-5c" src={icon} /> &nbsp; {nick || name}</>;
	}

	content() {
		let {caption, discription, $create, $update, owner} = this.task;
		let spanUpdate:any;
		if ($update.getTime() - $create.getTime() > 6*3600*1000) {
			spanUpdate = <><Muted>更新:</Muted> <EasyTime date={$update} /></>;
		}
		let renderTop = (user:User):JSX.Element => {
			let {icon, name, nick} = user;
			return <div className="d-flex px-3 py-2 bg-light">
				<Image className="w-2c h-2c" src={icon} /> 
				<div className="ml-3">
					<div>{nick || name}</div>
					<div><Muted><EasyTime date={$create} /> {spanUpdate}</Muted></div>
				</div>
			</div>;
		}
		return <div className="bg-white">
			<UserView user={owner} render={renderTop} />
			<div className="px-3">
				<div className="py-2"><b>{caption}</b></div>
				{discription && <div className="">{discription}</div>}
			</div>

			<div className="pt-3">
				{this.vTodoList.render()}
			</div>
			<div className="d-flex align-items-center px-3 py-2">
				<button className="btn btn-success" onClick={this.onPass}>
					<FA className="mr-2" name="check-circle" /> 通过
				</button>
				<div className="flex-fill"></div>
				<button className="btn btn-outline-danger" onClick={this.onFail}>
					<FA className="mr-2" name="times-circle" /> 不过
				</button>
			</div>
		</div>;
	}
	

}
