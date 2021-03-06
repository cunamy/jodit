/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { Plugin } from '../modules/Plugin';
import { IControlType } from '../types/toolbar';
import { IJodit } from '../types';

Config.prototype.controls.redo = {
	mode: consts.MODE_SPLIT,
	isDisable: (editor: IJodit): boolean => !editor.observer.stack.canRedo(),
	tooltip: 'Redo'
} as IControlType;

Config.prototype.controls.undo = {
	mode: consts.MODE_SPLIT,
	isDisable: (editor: IJodit): boolean => !editor.observer.stack.canUndo(),
	tooltip: 'Undo'
} as IControlType;

/**
 * Custom process Redo and Undo functionality
 */
export class redoundo extends Plugin {
	beforeDestruct() {
		// do nothing
	}
	afterInit(editor: IJodit) {
		const callback = (command: string): void | false => {
			if (editor.getRealMode() === consts.MODE_WYSIWYG) {
				editor.observer[command as 'redo' | 'undo']();
			}

			return false;
		};

		editor.registerCommand('redo', {
			exec: callback,
			hotkeys: ['ctrl+y', 'ctrl+shift+z', 'cmd+y', 'cmd+shift+z']
		});

		editor.registerCommand('undo', {
			exec: callback,
			hotkeys: ['ctrl+z', 'cmd+z']
		});
	}
}
