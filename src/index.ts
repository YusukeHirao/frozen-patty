import type { Filter, FrozenPattyOptions, PrimitiveDatum } from './frozen-patty';
import FrozenPatty from './frozen-patty';
import _getValue from './getValue';
import _setValue from './setValue';
import { arrayToHash } from './util';

/**
 * Pure HTML to JSON converter that not use template engine.
 *
 * @param html Original HTML
 * @param options Options
 */
function frozenPatty(html: string, options?: FrozenPattyOptions) {
	return new FrozenPatty(html, options);
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
namespace frozenPatty {
	/**
	 * Set value to an element
	 *
	 * ```html
	 * <div [target-attribute] data-[attr]="[name]:[target-attribute]"></div>
	 * ```
	 *
	 * @param el A target element
	 * @param name A label name
	 * @param datum A datum of value
	 * @param attr Data attribute name for specifying the node that FrozenPatty treats as a field
	 */
	export function setValue(
		el: Element,
		name: string,
		datum: PrimitiveDatum,
		attr = 'field',
		filter?: Filter,
	) {
		return _setValue(name, datum, el, attr, filter);
	}

	/**
	 * Get value from an element
	 *
	 * @param el A target element
	 * @param name A label name
	 * @param typeConvert Auto covert type of value
	 * @param attr Data attribute name for specifying the node that FrozenPatty treats as a field
	 */
	export function getValue(
		el: Element,
		name: string,
		typeConvert = false,
		attr = 'field',
		filter?: Filter,
	) {
		const data = arrayToHash(_getValue(el, attr, typeConvert, filter));
		return data[name];
	}
}

export default frozenPatty;
