/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IControlTypeStrong, IToolbarCollection, IToolbarElement } from '../../types/toolbar';
import { Component, STATUSES } from '../Component';
import { ToolbarCollection } from './collection';
import { ToolbarIcon } from './icon';
import { Dom } from '../Dom';
import { IViewBased, TagNames } from '../../types';
import { trim } from '../helpers/string';

export abstract class ToolbarElement extends Component
	implements IToolbarElement {
	container: HTMLElement;
	parentToolbar?: IToolbarCollection;
	use: boolean;

	protected constructor(
		parentToolbarOrView: IToolbarCollection | IViewBased,
		containerTag: TagNames = 'li',
		containerClass: string = 'jodit_toolbar_btn'
	) {
		if (parentToolbarOrView instanceof ToolbarCollection) {
			super(parentToolbarOrView.jodit);
			this.parentToolbar = <IToolbarCollection>parentToolbarOrView;
		} else {
			super(<IViewBased>parentToolbarOrView);
		}

		this.container = this.jodit.create.element(containerTag);
		this.container.classList.add(containerClass);
		this.use = true;
	}

	focus() {
		this.container.focus();
	}

	destruct(): any {
		if (this.isInDestruct) {
			return;
		}

		this.setStatus(STATUSES.beforeDestruct);

		Dom.safeRemove(this.container);
		this.parentToolbar = undefined;
		super.destruct();
	}

	createIcon(clearName: string, control?: IControlTypeStrong): HTMLElement {
		const icon: string = control ? control.icon || control.name : clearName;
		const useText:boolean = control ? control.useText || false : false;	
		const isTextBox:boolean = control ? control.isTextBox || false : false;	
		
		const cssName:string = control ? control.cssName || '' : '';	
		const idControl:string = control ? 'id='+control.idComponent || '' : '';	
		
		if (control && control.name === 'addBlock')
			console.log(icon);

		if (!this.jodit.options.textIcons && !useText && !isTextBox ) {
			let iconSVG: string | void | HTMLElement = this.jodit.events.fire(
				'getIcon',
				icon,
				control,
				clearName
			);

			let iconElement: HTMLElement;

			if (control && control.iconURL && iconSVG === undefined) {
				iconElement = this.jodit.create.element('i');
				iconElement.style.backgroundImage =
					'url(' +
					control.iconURL.replace('{basePath}', this.jodit.basePath) +
					')';
			} else {
				if (iconSVG === undefined) {
					if (ToolbarIcon.exists(icon)) {
						iconSVG = ToolbarIcon.getIcon(icon);
					} else {
						iconSVG = ToolbarIcon.getIcon('empty');
					}
				}

				iconElement =
					typeof iconSVG === 'string'
						? this.jodit.create.fromHTML(trim(iconSVG))
						: iconSVG;
			}

			iconElement.classList.add('jodit_icon', 'jodit_icon_' + clearName);

			return iconElement;
		}
		else if (isTextBox){
			const textValue:string = control ? control.textValue || '' : '';	
			return this.jodit.create.fromHTML(
				`<input type='text' ${idControl}  class="jodit_icon ${cssName}" value="${textValue}"  />`
			);
		}
		else if (useText){
			const textValue:string = control ? control.textValue || '' : '';	
			return this.jodit.create.fromHTML(
				`<span ${idControl}  class="jodit_icon ${cssName}">${textValue}</span>`
			);
		}

		

		return this.jodit.create.fromHTML(
			`<span ${idControl}  class="jodit_icon ${cssName}">${this.jodit.i18n(
				control ? control.name : clearName
			)}</span>`
		);
	}
}

