'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var URL = {};

URL.parse = function (urlString) {
	var a = document.createElement('a');
	a.href = urlString;
	a.href = a.href; //for IE;
	var urlObj = {};
	urlObj.protocol = a.protocol;
	urlObj.auth = a.protocol === 'https:';
	urlObj.host = a.port === '80' ? a.host.replace(':80', '') : a.host;
	urlObj.port = a.port === '80' ? '' : a.port;
	urlObj.hostname = a.hostname;
	urlObj.hash = a.hash;
	urlObj.search = a.search;
	urlObj.query = a.search.slice(1);
	urlObj.pathname = URL.adjustURLSlash(URL.addFirstSlash(a.pathname));
	urlObj.path = urlObj.pathname + a.search;
	urlObj.href = a.href;
	urlObj.origin = a.protocol + '//' + urlObj.host;

	return urlObj;
};

URL.addFirstSlash = function (pathString) {
	return pathString.replace(/^(\/*)?/, '/');
};

URL.addTrailingSlash = function (pathString) {
	return pathString.replace(/(\/*)?$/, '/');
};

URL.removeTrailingSlash = function (pathname) {
	return pathname.replace(/\/*$/, '');
};

URL.adjustURLSlash = function (pathname) {
	return pathname.replace(/\/+/g, '/');
};

exports.default = URL;