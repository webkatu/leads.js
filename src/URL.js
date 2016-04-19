const URL = {};

URL.parse = (urlString) => {
	const a = document.createElement('a');
	a.href = urlString;
	a.href = a.href; //for IE;
	const urlObj = {};
	urlObj.protocol = a.protocol;
	urlObj.auth = a.protocol === 'https:';
	urlObj.host = (a.port === '80') ? a.host.replace(':80', '') : a.host;
	urlObj.port = (a.port === '80') ? '' : a.port;
	urlObj.hostname = a.hostname;
	urlObj.hash = a.hash;
	urlObj.search = a.search;
	urlObj.query = a.search.slice(1);
	urlObj.pathname = URL.adjustURLSlash(URL.addFirstSlash(a.pathname));
	urlObj.path = urlObj.pathname + a.search;
	urlObj.href = a.href;
	urlObj.origin = `${a.protocol}//${urlObj.host}`;

	return urlObj;
};

URL.addFirstSlash = (pathString) => {
	return pathString.replace(/^(\/*)?/, '/');
};

URL.addTrailingSlash = (pathString) => {
	return pathString.replace(/(\/*)?$/, '/');
};

URL.removeTrailingSlash = (pathname) => {
	return pathname.replace(/\/*$/, '');
};

URL.adjustURLSlash = (pathname) => {
	return pathname.replace(/\/+/g, '/');
};

export default URL;