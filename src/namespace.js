export default function namespace() {
	let map = new WeakMap();

	return function(object) {
		if(! map.has(object)) {
			map.set(object, {});
		}
		return map.get(object);
	};
};