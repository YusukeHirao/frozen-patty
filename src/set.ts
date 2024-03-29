import './polyfill';

import type { Filter, FrozenPattyData } from './frozen-patty';
import setValue from './setValue';

export default function (
	el: Element,
	data: FrozenPattyData,
	attr: string,
	filter?: Filter,
) {
	el = el.cloneNode(true) as Element;
	for (const dataKeyName in data) {
		if (dataKeyName in data) {
			const datum = data[dataKeyName];
			const selector = `[data-${attr}*="${dataKeyName}"]`;
			const targetList = el.querySelectorAll(selector);
			if (Array.isArray(datum)) {
				const targetEl = targetList[0];
				if (!targetEl) {
					continue;
				}
				const listRoot = targetEl.closest(`[data-${attr}-list]`);
				if (!listRoot || (listRoot && !listRoot.children.length)) {
					continue;
				}
				const listItem = listRoot.children[0].cloneNode(true);
				while (datum.length > listRoot.children.length) {
					listRoot.appendChild(listItem.cloneNode(true));
				}
				const newChildren = listRoot.querySelectorAll(selector);
				const oldChildList = Array.from(listRoot.children);
				let deleteNodeList: Element[] = [];
				Array.from(newChildren).forEach((child, i) => {
					if (datum[i] != null) {
						setValue(dataKeyName, datum[i], child, attr, filter);
						deleteNodeList = [];
					} else {
						setValue(dataKeyName, '', child, attr, filter);
						deleteNodeList.push(oldChildList[i]);
					}
				});
				deleteNodeList.forEach((node) => node.remove());
			} else {
				Array.from(targetList).forEach((targetEl, i) => {
					setValue(dataKeyName, datum, targetEl, attr, filter);
				});
			}
		}
	}
	return el;
}
