"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = namespace;
function namespace() {
	var map = new WeakMap();

	return function (object) {
		if (!map.has(object)) {
			map.set(object, {});
		}
		return map.get(object);
	};
};