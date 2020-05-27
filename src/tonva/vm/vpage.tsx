import * as React from 'react';
import { Page, Scroller, TabsProps } from "../components";
import { View } from "./view";
import { Controller } from "./controller";

export abstract class VPage<C extends Controller> extends View<C> {
	// private onClosePage:(ret:any)=>void;
	protected retOnClosePage: any;

    open(param?:any, onClosePage?:(ret:any)=>void):Promise<void> {
		//this.onClosePage = onClosePage;
		this.init(param);
		let _onClosePage: ()=>void;
		if (onClosePage !== undefined) _onClosePage = () => onClosePage(this.retOnClosePage);
		this.openPageElement(this.renderPage(), _onClosePage);
		return;
	}

	render(param?:any):JSX.Element {
		this.init(param);
		//return this.content();
		return this.renderPage();
	}

	init(param?:any):void {return;}

	header():string|boolean|JSX.Element {return null;}
	right():JSX.Element {return null;}
	content():JSX.Element {return null;}
	footer():JSX.Element {return null;}
	logout(): boolean | (()=>Promise<void>) {return false;}
	protected renderPage():JSX.Element {
		let header = this.header();
		if (!header) header = false;
		return <Page
			header={header} right={this.right()} footer={this.footer()}
			onScroll={(e:any)=>this.onPageScroll(e)}
			onScrollTop={(scroller: Scroller) => this.onPageScrollTop(scroller)}
			onScrollBottom={(scroller: Scroller) => this.onPageScrollBottom(scroller)}
			back={this.back}
			headerClassName={this.headerClassName}
			className={this.className}
			afterBack={()=>this.afterBack()}
			tabsProps={this.tabsProps}
			logout={this.logout()}
		>
			{this.content()}
		</Page>;
	}

	protected onPageScroll(e:any) {}
	protected async onPageScrollTop(scroller: Scroller): Promise<boolean> {return false;}
	protected async onPageScrollBottom(scroller: Scroller): Promise<boolean> {return false;}
	protected afterBack():void {}
	protected get back(): 'close' | 'back' | 'none' {return 'back'}
	protected get headerClassName(): string {return null;}
	protected get className(): string {return null;}
	protected get tabsProps(): TabsProps {return null;}
}