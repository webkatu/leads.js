import internal from './internal';
import URL from './URL';
import pathToRegexp from 'path-to-regexp';
import ns from './namespace';
import Request from './Request';
import Response from './Response';

let privates = ns();
export default class Router {
	constructor(options) {
		let self = privates(this);
	
		self.handlers = [];
		self.errorHandlers = [];
		self.paramHandlers = {};
		self.options = {};
		let caseSensitive = false;
		let mergeParams = false;
		let strict = false;
		Object.defineProperties(self.options, {
			caseSensitive: {
				get: () => { return caseSensitive; },
				set: (value) => { caseSensitive = Boolean(value); },
				enumerable: true,
			},
			mergeParams: {
				get: () => { return mergeParams; },
				set: (value) => { mergeParams = Boolean(value); },
				enumerable: true,
			},
			strict: {
				get: () => { return strict; },
				set: (value) => { strict = Boolean(value); },
				enumerable: true,
			},
		});

		self.register = register.bind(this);
		self.METHOD = METHOD.bind(this);
		self.param = param.bind(this);
		self.getMatchedHandlers = getMatchedHandlers.bind(this);
		self.getCalledHandlers = getCalledHandlers.bind(this);
		self.gfGetCalledHandler = gfGetCalledHandler.bind(this);
		self.getNextHandler = getNextHandler.bind(this);
		self.runNextHandler = runNextHandler.bind(this);
		self.getMatchedErrorHandlers = getMatchedErrorHandlers.bind(this);
		self.gfGetMatchedErrorHandler = gfGetMatchedErrorHandler.bind(this);
		self.getNextErrorHandler = getNextErrorHandler.bind(this);
		self.runNextErrorHandler = runNextErrorHandler.bind(this);
		self.getRemainder = getRemainder.bind(this);
		self.getParams = getParams.bind(this);
		self.getChangedParamKeys = getChangedParamKeys.bind(this);
		self.getParamHandlers = getParamHandlers.bind(this);

		Object.defineProperties(this, {
			options: {
				get: () => { return self.options; },
				set: (obj) => {
					if(typeof obj !== 'object' || obj === null) return;
					for(let prop in self.options) {
						if(! (prop in obj)) continue;
						self.options[prop] = obj[prop];
					}
				},
				enumerable: true,
			},
		});

		this.options = options;
	}

	dispatch(urlString, method, options) {
		if(typeof urlString !== 'string') return;
		if(typeof method !== 'string') method = 'all';
		if(typeof options !== 'object' || options === null) options = {};
		if(typeof options.changePath !== 'boolean') options.changePath = true;
		if(typeof options.addHistory !== 'boolean') options.addHistory = true;

		let self = privates(this);
		let request = new Request();
		let response = new Response();

		let url = URL.parse(urlString);
		if(url.origin !== location.origin) {
			//別オリジンならurl遷移;
			location.href = url.href;
			return;
		}
		internal(request).setURL(url);
		request.method = method;
		request.data = options.data;

		if(options.changePath === false && options.addHistory === false) {
			//何もしない;
		}else if(options.changePath === false && options.addHistory === true) {
			window.history.pushState(null, null, location.href);
		}else if(options.changePath === true && options.addHistory === false) {
			window.history.replaceChild(null, null, url.href);
		}else {
			//default;
			//ex) (true && true) || (undefined && undefined);
			window.history.pushState(null, null, url.href);
		}

		self.goGetCalledHandler = self.gfGetCalledHandler(request, url.pathname, method, '', {});
		self.runNextHandler(request, response);
	}

	//use(callback [, callback...]) -> middleware
	//use(pathname, callback [, callback...]);
	//use(pathname, router);
	//use(pathnames, router);
	use() {
		if(arguments.length === 0) return this;

		let path = '/';
		let type = 'middleware';
		let firstParam = arguments[0];
		//最初の引数がpathかどうか;
		if(firstParam !== undefined && firstParam !== null && typeof firstParam !== 'function' && ! (firstParam instanceof Router)) {
			path = firstParam;
			Array.prototype.shift.bind(arguments)();
		}
		let self = privates(this);
		let listeners = [];
		Array.prototype.forEach.bind(arguments)((arg) => {
			if(typeof arg !== 'function' && ! (arg instanceof Router)) {
				return;
			}
			if(typeof arg === 'function' && arg.length === 4) {
				//error handler登録;
				self.register({ path, type, listener: arg }, 'error');
				return;
			}
			listeners.push(arg);
		});

		if(listeners.length !== 0) {
			self.register({ path, type, listeners });
		}
		return this;
	}

	all(path) { privates(this).METHOD(path, 'all', arguments); return this; }
	get(path) { privates(this).METHOD(path, 'get', arguments); return this; }
	post(path) { privates(this).METHOD(path, 'post', arguments); return this; }
	put(path) { privates(this).METHOD(path, 'put', arguments); return this; }
	delete(path) { privates(this).METHOD(path, 'delete', arguments); return this; }

	route(path) {
		let ret = {};
		['all', 'get', 'post', 'put', 'delete'].forEach((method) => {
			//ArrowFunctionはarguments使えないのでfunction(){}.bind(this)で代替;
			ret[method] = function() {
				this[method].bind(this, path).apply(this, arguments);
				return ret;
			}.bind(this);
		});
		return ret;
	}

	param(name, callback) {
		if(typeof callback !== 'function') {
			return;
		}
		let self = privates(this);
		let names = null;
		if(Array.isArray(name)) {
			names = name;
		}else {
			names = [name];
		}

		names.forEach((name) => {
			if(typeof name !== 'string') {
				return;
			}
			if(name in self.paramHandlers) {
				self.paramHandlers[name].listeners.push(callback);
				return;
			}
			self.paramHandlers[name] = { listeners: [callback], type: 'parameter' };
		});
	}
}

function METHOD(path, method, args) {
	if(path === undefined || path === null) {
		return;
	}
	if(args.length === 1) {
		this.dispatch(path, method);
		return;
	}
	if(args.length === 2 && typeof args[1] === 'object' && args[1] !== null && ! (args[1] instanceof Router)) {
		//args[1] is options;
		this.dispatch(path, method, args[1]);
		return;
	}
	let self = privates(this);
	let type = 'method';
	let listeners = [];
	Array.prototype.shift.bind(args)();
	Array.prototype.forEach.bind(args)((arg) => {
		if(typeof arg !== 'function' && ! (arg instanceof Router)) {
			return;
		}
		if(typeof arg === 'function' && arg.length === 4) {
			//error handler登録;
			self.register({ path, type, method, listener: arg }, 'error');
			return;
		}
		listeners.push(arg);
	});
	if(listeners.length !== 0) {
		self.register({ path, type, method, listeners });
	}
}

//matchedはpattern.execの返り値を想定;
//元のURLからマッチした部分を引いて先頭にスラッシュをつけたものを返す
//(これが新たなpathになり子ルーターに渡される);
//元のURLからマッチした部分を引いた結果がURLのpathに相応しくないならnullを返す;
function getRemainder(matched) {
	if(matched.index !== 0) {
		return null;
	}
	let remainder = matched.input.replace(matched[0], '');
	if(matched[0].slice(-1) !== '/' && remainder[0] !== '/' && remainder !== '') {
		return null;
	}
	return URL.addFirstSlash(remainder);
}

//matchedはpattern.execの返り値を想定。matchedは破壊されない;
//keysはpathToRegExp()の返り値の第二引数を想定。URLparameterのproperty名が入っている配列;
//parentParamsは継承するparams。子ルーターのURLparameterと親のルーターのURLparameterを併合する時のため。
function getParams(matched, keys, parentParams) {
	let params = privates(this).options.mergeParams ? Object.assign({}, parentParams) : {};
	matched = matched.concat([]);

	matched.shift();
	if(matched.length === 0) {
		return params;
	}

	keys.forEach((value) => {
		if(typeof value !== 'object') {
			return;
		}
		params[value.name] = matched.shift();
	});

	return params;
}

//paramsObserverとparamsのpropertyに違いがあれば、その違うproperty名を取得する;
//取得されたpropertyはそのproperty名で登録されているparamHandlerを取得するために用いられる;
function getChangedParamKeys(paramsObserver, params) {
	let keys = [];
	for(let prop in params) {
		if(paramsObserver[prop] !== params[prop]) {
			paramsObserver[prop] = params[prop];
			keys.push(prop);
		}
	}
	return keys;
}

/**
 * keysに含まれているparamHandler全て取得
 * @param [array] keys getChangedParamKeysの返り値
 * @return [array] keysにマッチしたparamHandlerが全て入っている配列
 *     paramHandlerの構造 => { handler, paramValue, req }
 */
function getParamHandlers(keys, req) {
	let self = privates(this);
	let paramHandlers = [];
	keys.forEach((key) => {
		if(key in self.paramHandlers === false) {
			return;
		}
		paramHandlers.push({
			handler: {
				type: self.paramHandlers[key].type,
				listeners: self.paramHandlers[key].listeners,
			},
			paramValue: req.params[key],
			req,
		});
	});
	return paramHandlers;
}

function getMatchedMiddlewareHandlers(handler, req, remainder) {
	if(typeof handler.listener === 'function') {
		return [{ handler: handler, req: req }];
	}
	if(handler.listener instanceof Router) {
		return handler.listener.getMatchedHandlers(remainder, req.method, req.baseUrl, req.params);
	}
}

/**
 * RouterからpathStringとmethodにマッチするhandlerを全て取得する
 * @param [string] pathString パス
 * @param [string] method httpメソッド名
 * @return [array] マッチしたhandler(matchedHandler)が全て入っている配列
 *     matchedHandlerの構造 => { handler, matched, remainder }
 */
function getMatchedHandlers(pathString, method) {
	let self = privates(this);
	let matchedHandlers = [];
	self.handlers.forEach((handler) => {
		let matched = handler.pattern.exec(pathString);
		if(matched === null) {
			return;
		}
		if(handler.type === 'middleware') {
			let remainder = self.getRemainder(matched);
			if(remainder === null) {
				return;
			}
			matchedHandlers.push({ handler, matched, remainder });
		}else if(method === 'all' || handler.method === 'all' || handler.method === method) {
			matchedHandlers.push({ handler, matched, remainder: '/' });
		}
	});
	return matchedHandlers;
}



function getCalledHandlers(pathString, method, baseUrl, params) {
	let self = privates(this);
	let matchedHandlers = self.getMatchedHandlers(pathString, method);
	let calledHandlers = [];
	let paramsObserver = {};
	matchedHandlers.forEach((matchedHandler) => {
		let handler = matchedHandler.handler;
		let matched = matchedHandler.matched;
		let remainder = matchedHandler.remainder;
		let req = {
			baseUrl: baseUrl,
			params: self.getParams(matched, handler.pattern.keys, params),
		};

		//新たなparameterがあれば、そのparameterのparamHandlersを取得する;
		let changedParamKeys = self.getChangedParamKeys(paramsObserver, req.params);
		let paramHandlers = self.getParamHandlers(changedParamKeys, req);
		calledHandlers.push(...paramHandlers);

		calledHandlers.push({ handler, req, remainder });
	});

	return calledHandlers;
}

// ../sub/gfGetCalledHandler.jsにgeneratorFunctionで書かれたコードが有るため、コードを読む際はそちらへ;
function gfGetCalledHandler(request, pathString, method, baseUrl, params) {
	let calledHandlers = privates(this).getCalledHandlers(pathString, method, baseUrl, params);
	let i = 0;
	let l = 0;
	let childRouter = null;
	let obj = {
		value: undefined,
		done: true,
	}
	return {
		next: function(skip) {
			if(calledHandlers.length <= i) {
				return {
					done: true,
					value: undefined,
				};
			}
			let calledHandler = calledHandlers[i];
			if(calledHandler.handler.listeners.length <= l) {
				i++;
				l = 0;
				return this.next();
			}

			if(childRouter) {
				let nextHandler = childRouter.getNextHandler(skip);
				if(nextHandler) {
					return {
						done: false,
						value: nextHandler
					};
				}
				l++;
				childRouter = null;
				return this.next();
			}
			
			if(l !== 0 && skip) {
				i++;
				l = 0;
				return this.next();
			}


			let listener = calledHandler.handler.listeners[l];
			if(listener instanceof Router) {
				childRouter = privates(listener);
				let baseUrl = request.pathname.replace(RegExp(calledHandler.remainder + '$'), '');
				childRouter.goGetCalledHandler = childRouter.gfGetCalledHandler(
					request,
					calledHandler.remainder,
					method,
					baseUrl,
					calledHandler.req.params
				);
				let nextHandler = childRouter.getNextHandler();
				if(nextHandler) {
					return {
						done: false,
						value: nextHandler
					};
				}
				l++;
				childRouter = null;
				return this.next();
			}

			l++;
			return {
				done: false,
				value:{
					type: calledHandler.handler.type,
					listener: listener,
					req: calledHandler.req,
					paramValue: calledHandler.paramValue,
				},
			};
		},
	};
}

function getMatchedErrorHandlers(request) {
	let self = privates(this);
	let matchedHandlers = [];
	let method = request.method;
	let pathString = request.pathname;
	self.errorHandlers.forEach((handler) => {
		let matched = handler.pattern.exec(pathString);
		if(matched === null) {
			return;
		}

		if(handler.type === 'middleware') {
			let remainder = self.getRemainder(matched);
			if(remainder === null) {
				return;
			}
			matchedHandlers.push({ handler });
		}else if(handler.method === 'all' || method === 'all' || handler.method === method) {
			matchedHandlers.push({ handler });
		}
	});

	return matchedHandlers;
}

// ../sub/gfGetMatchedErrorHandler.jsにgeneratorFunctionで書かれたコードが有るため、コードを読む際はそちらへ;
function gfGetMatchedErrorHandler(request) {
	let matchedHandlers = privates(this).getMatchedErrorHandlers(request);
	let i = 0;
	return {
		next: function() {
			if(matchedHandlers.length <= i) {
				return { done: true, value: undefined, }
			}
			return { done: false, value: matchedHandlers[i++], };
		},
	};
}

function getNextHandler() {
	let genObj = privates(this).goGetCalledHandler.next(arguments[0]);
	if(genObj.done) {
		return null;
	}
	return genObj.value;
}

function runNextHandler(request, response, error) {
	let self = privates(this);
	let nextHandler = null;
	if(error === 'route') {
		nextHandler = self.getNextHandler(true);
	}else if(error !== undefined) {
		self.goGetMatchedErrorHandlers = self.gfGetMatchedErrorHandler(request);
		self.runNextErrorHandler(request, response, error);
		return;
	}else {
		nextHandler = self.getNextHandler();
	}
	if(nextHandler === null) {
		return;
	}
	Object.assign(request, nextHandler.req);
	let next = self.runNextHandler.bind(self, request, response);
	if(nextHandler.type === 'parameter') {
		nextHandler.listener(request, response, next, nextHandler.paramValue);
		return;
	}
	nextHandler.listener(request, response, next);
}

function getNextErrorHandler() {
	let genObj = privates(this).goGetMatchedErrorHandlers.next();
	if(genObj.done) {
		return null;
	}
	return genObj.value;
}

function runNextErrorHandler(request, response, error) {
	let self = privates(this);
	let nextHandler = self.getNextErrorHandler();
	if(nextHandler === null) {
		return;
	}
	let next = self.runNextErrorHandler.bind(self, request, response, error);
	nextHandler.handler.listener(error, request, response, next);
}

function register(properties, destination) {
	let self = privates(this);
	let handler = properties;
	if(handler.type === 'middleware') {
		handler.pattern = pathToRegexp(handler.path, null, {
			sensitive: self.options.caseSensitive,
			strict: self.options.strict,
			end: false,
		});
	}else {
		handler.pattern = pathToRegexp(handler.path, null, {
			sensitive: self.options.caseSensitive,
			strict: self.options.strict,
			end: true,
		});
	}

	if(destination === 'error') {
		self.errorHandlers.push(handler);
		return;
	}
	self.handlers.push(handler);
}

function param(names, callback) {
	let self = privates(this);
	names.forEach((name) => {
		if(name in self.paramHandlers) {
			self.paramHandlers[name].listeners.push(callback);
			return;
		}
		self.paramHandlers[name] = { listeners: [callback], type: 'parameter' };
	});
}