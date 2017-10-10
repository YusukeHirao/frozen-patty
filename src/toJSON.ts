import { FrozenPattyData, PrimitiveDatum } from './frozen-patty';
import './polyfill';

export function toJSON (el: HTMLElement, attr: string) {
	const filedElements = el.querySelectorAll(`[data-${attr}]`);
	let values: [keyof FrozenPattyData, PrimitiveDatum, boolean][] = [];
	for (const _el of Array.from(filedElements)) {
		values = values.concat(extractor(_el as HTMLElement, attr));

	}
	// console.log(values);
	const result = arrayToHash(values);
	return result as FrozenPattyData;
}

/**
 *
 * @param el HTMLElement
 * @param attr Data attribute name for specifying the node that FrozenPatty treats as a field.
 */
export function extractor (el: HTMLElement, attr: string) {
	/**
	 * [key, value, forceArray]
	 */
	const result: [keyof FrozenPattyData, PrimitiveDatum, boolean][] = [];
	const rawValue = el.getAttribute(`data-${attr}`);
	const listRoot = el.closest(`[data-${attr}-list]`);
	const forceArray = !!listRoot;
	if (rawValue == null) {
		throw new Error(`data-${attr} attriblute is empty.`);
	}
	const fieldList = `${rawValue}`.split(/\s*,\s*/);
	// console.log({fieldList, el: el.innerHTML});
	for (let fieldName of fieldList) {
		let splitKey: string[];
		let keyAttr = '';
		let value: PrimitiveDatum;
		fieldName = fieldName.trim();
		if (/^[a-z_-](?:[a-z0-9_-])*:[a-z_-](?:[a-z0-9_-])*(?:\([a-z-]+\))?/i.test(fieldName)) {
			splitKey = fieldName.split(':');
			fieldName = splitKey[0].trim();
			keyAttr = splitKey[1].trim();
		}
		// console.log({fieldName, keyAttr, el: el.innerHTML});
		if (keyAttr === 'text') {
			value = el.innerHTML;
		} else if (/^style\([a-z-]+\)$/i.test(keyAttr)) {
			const css = keyAttr.replace(/^style\(([a-z-]+)\)$/i, '$1');
			const style = window.getComputedStyle(el);
			value = style.getPropertyValue(css);
			if (css === 'background-image') {
				value = getBackgroundImagePath(value);
			}
		} else if (keyAttr) {
			switch (keyAttr) {
				case 'checked': {
					value = (el as HTMLInputElement).checked;
					break;
				}
				case 'disabled': {
					value = (el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement).disabled;
					break;
				}
				case 'download': {
					value = (el as HTMLAnchorElement).download;
					break;
				}
				case 'contenteditable': {
					value = el.contentEditable;
					break;
				}
				default: {
					value = el.getAttribute(keyAttr) || '';
				}
			}
		} else {
			if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
				const val = el.value;
				if (Array.isArray(val)) {
					value = val[0];
				} else {
					value = val || '';
				}
			} else {
				value = el.innerHTML;
			}
		}
		// console.log({fieldName, value});
		value = value != null ? value : '';
		result.push([fieldName, value, forceArray]);
	}
	// console.log({result});
	return result;
}

/**
 * Get path from value of "background-image"
 *
 */
function getBackgroundImagePath (value: string) {
	const origin = `${location.protocol}//${location.hostname}${(location.port ? `:${location.port}` : '')}`;
	return decodeURI(value.replace(/^url\(["']?([^"']+)["']?\)$/i, '$1').replace(origin, ''));
}

/**
 *
 */
function arrayToHash<T, K extends string> (kvs: [K, T, boolean][]) {
	const result = {} as {[P in K]: T | T[]};
	kvs.forEach((kv) => {
		const k = kv[0];
		const v = kv[1];
		const toArray = kv[2]; // tslint:disable-line:no-magic-numbers
		if (toArray) {
			const alv = result[k];
			if (Array.isArray(alv)) {
				alv.push(v);
			} else {
				result[k] = k in result ? [alv, v] : [v];
			}
		} else {
			result[k] = v;
		}
	});
	return result;
}
