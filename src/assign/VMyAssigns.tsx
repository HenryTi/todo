import * as React from 'react';
import { CAssign } from './CAssign';
import { VPage, List, EasyTime, Muted, UserView, User, FA, QueryPager } from 'tonva';
import { Assign, AssignTask } from 'models';
import { stateText } from 'tapp';

export class VMyAssigns extends VPage<CAssign> {
	private archived: 0|1;
	private myAssignsPager: QueryPager<Assign>;

	init({myAssignsPager, archived}:{myAssignsPager: QueryPager<Assign>; archived:0|1;}) {
		this.archived = archived;
		this.myAssignsPager = myAssignsPager;
	}

	header() {
		return this.archived===1? '已归档作业':'作业';
	}

	right() {
		if (this.archived === 1) return;
		return <button className="btn btn-sm btn-primary mr-2 align-self-center" onClick={()=>this.controller.showMyAssignsArchived()}>已归档</button>;
	}

	private renderItem = (assign:Assign, index:number) => {
		let {caption, discription, $update, tasks} = assign;
		return <div className="py-3 px-3">
			<div>
				<div>
					<b>{caption}</b> 
					&nbsp; {discription}
				</div>
				{this.renderAssignTasks(tasks)}
			</div>
			<div className="flex-fill"></div>
			<div>
				<Muted><EasyTime date={$update} /></Muted>
			</div>
		</div>;
	}

	private renderUser = (user: User) => {
		let {name, nick} = user;
		return <span className="text-info">{nick || name}</span>;
	}

	private renderAssignTasks(tasks: AssignTask[]) {
		if (tasks === undefined || tasks.length === 0) return;
		return <div>
			{tasks.map((v, index) => {
				// eslint-disable-next-line
				let {assign, worker, state, date} = v;
				let {text, act} = stateText(state);
				return <div key={index} className="small">
					<FA className="text-danger mr-1" name="chevron-circle-right" />
					<span className="text-primary">{text}</span> &nbsp;
					<UserView user={worker} render={this.renderUser} /> &nbsp;
					{act} &nbsp; <EasyTime date={date} />
				</div>
			})}
		</div>;
	}

	private onAssignClick = (assign:Assign) => {
		this.controller.showAssign(assign.id);
	}

	/*
	private cnTabSelected = (selected:boolean) => classNames({
		"bg-white border border-success":selected,
		"border":!selected,
	},  'cursor-pointer px-4 py-2 rounded');
	private tabs:TabProp[] = [
		{
			name: 'cur',
			caption: (selected) => <div className={this.cnTabSelected(selected)}>未完</div>,
			content: () => <div>
				<List items={this.controller.myAssignsPager} 
					item={{render: this.renderItem, onClick: this.onAssignClick}} />
			</div>,
			onShown: () => this.controller.loadAssigns(0),
		},
		{
			name: 'archive',
			caption: (selected) => <div className={this.cnTabSelected(selected)}>归档</div>,
			content: () => <div>
				<List items={this.controller.myAssignsPager} 
					item={{render: this.renderItem, onClick: this.onAssignClick}} />
			</div>,
			onShown: () => this.controller.loadAssigns(1),
		},
	];
	*/

	content() {
		// return <Tabs tabs={this.tabs} tabPosition="top" size="sm" /> 
		return <List items={this.myAssignsPager} 
			item={{render: this.renderItem, onClick: this.onAssignClick}} />;
	}
}