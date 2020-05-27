import * as React from 'react';
import classNames from 'classnames';
import { CTask } from './CTask';
import { VPage, List, EasyTime, Muted, tv, TabProp, Tabs, FA } from 'tonva';
import { Assign, AssignTask } from 'models';
import { EnumTaskStep, stateText } from 'tapp';

export class VMyTasks extends VPage<CTask> {
	header() { return '任务'; }

	private renderTaskItem = (stepText:string, myTaskItem: AssignTask, index:number) => {
		let {assign, $create, stepDate, stepComment, state} = myTaskItem;
		// eslint-disable-next-line
		let {text, act} = stateText(state);
		return tv(assign, (values:Assign) => {
			let {caption, discription} = values;
			return <div className="py-3 px-3">
				<div>
					<div><b>{caption}</b> &nbsp; {discription}</div>
					<div className="small">
						<FA className="text-danger mr-1" name="chevron-circle-right" />
						<span className="text-primary">{text}</span> &nbsp;
						<EasyTime date={stepDate} />
						{stepText}
						<Muted>{stepComment}</Muted>
					</div>
				</div>
				<div className="flex-fill"></div>
				<div>
					<Muted><EasyTime date={$create} /></Muted>
				</div>
			</div>;
		});
	}

	private onTaskClick = (myTaskItem: AssignTask) => {
		this.controller.showTask(myTaskItem.id);
	}

	private cnTabSelected = (selected:boolean) => classNames({
		"bg-white border border-warning":selected,
		"border":!selected,
	},  'cursor-pointer px-4 py-2 rounded');
	private tabs:TabProp[] = [
		{
			name: 'todo',
			caption: (selected) => <div className={this.cnTabSelected(selected)}>领办</div>,
			content: () => <div>
				<List items={this.controller.myTasksPager} 
					item={{
						render: (item, index) => this.renderTaskItem('领办', item, index), 
						onClick: this.onTaskClick
					}} />
			</div>,
			onShown: () => this.controller.loadTaskArchive(EnumTaskStep.todo),
		},
		{
			name: 'done',
			caption: (selected) => <div className={this.cnTabSelected(selected)}>完成</div>,
			content: () => <div>
				<List items={this.controller.myTasksPager} 
					item={{
						render: (item, index) => this.renderTaskItem('完成', item, index), 
						onClick: this.onTaskClick
					}} />
			</div>,
			onShown: () => this.controller.loadTaskArchive(EnumTaskStep.done),
		},
		{
			name: 'check',
			caption: (selected) => <div className={this.cnTabSelected(selected)}>查验</div>,
			content: () => <div>
				<List items={this.controller.myTasksPager} 
					item={{
						render: (item, index) => this.renderTaskItem('查验', item, index), 
						onClick: this.onTaskClick
					}} />
			</div>,
			onShown: () => this.controller.loadTaskArchive(EnumTaskStep.check),
		},
		{
			name: 'rate',
			caption: (selected) => <div className={this.cnTabSelected(selected)}>评分</div>,
			content: () => <div>
				<List items={this.controller.myTasksPager} 
					item={{
						render: (item, index) => this.renderTaskItem('评分', item, index), 
						onClick: this.onTaskClick
					}} />
			</div>,
			onShown: () => this.controller.loadTaskArchive(EnumTaskStep.rate),
		},
	];

	content() {
		return <Tabs tabs={this.tabs} tabPosition="top" size="sm" />;
	}
}