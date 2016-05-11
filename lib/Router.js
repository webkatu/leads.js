'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _internal = require('./internal');

var _internal2 = _interopRequireDefault(_internal);

var _URL = require('./URL');

var _URL2 = _interopRequireDefault(_URL);

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _Request = require('./Request');

var _Request2 = _interopRequireDefault(_Request);

var _Response = require('./Response');

var _Response2 = _interopRequireDefault(_Response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var privates = (0, _namespace2.default)();

var Router = function () {
	function Router(options) {
		_classCallCheck(this, Router);

		var self = privates(this);

		self.handlers = [];
		self.errorHandlers = [];
		self.paramHandlers = {};
		self.defaults = {};
		var caseSensitive = false;
		var mergeParams = false;
		var strict = false;
		Object.defineProperties(self.defaults, {
			caseSensitive: {
				get: function get() {
					return caseSensitive;
				},
				set: function set(value) {
					caseSensitive = Boolean(value);
				},
				enumerable: true
			},
			mergeParams: {
				get: function get() {
					return mergeParams;
				},
				set: function set(value) {
					mergeParams = Boolean(value);
				},
				enumerable: true
			},
			strict: {
				get: function get() {
					return strict;
				},
				set: function set(value) {
					strict = Boolean(value);
				},
				enumerable: true
			}
		});

		for (var method in privateMethods) {
			self[method] = privateMethods[method].bind(this);
		}

		this.defaults = options;
	}

	_createClass(Router, [{
		key: 'dispatch',
		value: function dispatch(urlString, method, options) {
			if (typeof urlString !== 'string') return;
			if (typeof method !== 'string') method = 'all';
			if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object' || options === null) options = {};
			if (typeof options.addHistory !== 'boolean') options.addHistory = true;
			if (typeof options.changePath !== 'boolean') options.changePath = true;

			var self = privates(this);
			var request = new _Request2.default();
			var response = new _Response2.default();

			var url = _URL2.default.parse(urlString);
			if (url.origin !== location.origin) {
				//別オリジンならurl遷移;
				location.href = url.href;
				return;
			}
			request.dispatcher = this;
			(0, _internal2.default)(request).setURL(url);
			request.method = method;
			request.data = options.data;

			if (options.addHistory === false && options.changePath === false) {
				//何もしない;
			} else if (options.addHistory === true && options.changePath === false) {
					window.history.pushState(null, null, location.href);
				} else if (options.addHistory === false && options.changePath === true) {
					window.history.replaceChild(null, null, url.href);
				} else {
					//default;
					//ex) (true && true) || (undefined && undefined);
					window.history.pushState(null, null, url.href);
				}

			self.goGetCalledHandler = self.gfGetCalledHandler(url.pathname, method, '', {});
			self.runNextHandler(request, response);
		}

		//use(callback [, callback...]) -> middleware
		//use(pathname, callback [, callback...]);
		//use(pathname, router);
		//use(pathnames, router);

	}, {
		key: 'use',
		value: function use() {
			if (arguments.length === 0) return this;

			var path = '/';
			var type = 'middleware';
			var firstParam = arguments[0];
			//最初の引数がpathかどうか;
			if (firstParam !== undefined && firstParam !== null && typeof firstParam !== 'function' && !(firstParam instanceof Router)) {
				path = firstParam;
				Array.prototype.shift.bind(arguments)();
			}
			var self = privates(this);
			var listeners = [];
			Array.prototype.forEach.bind(arguments)(function (arg) {
				if (typeof arg !== 'function' && !(arg instanceof Router)) {
					return;
				}
				if (typeof arg === 'function' && arg.length === 4) {
					//error handler登録;
					self.register({ path: path, type: type, listener: arg }, 'error');
					return;
				}
				listeners.push(arg);
			});

			if (listeners.length !== 0) {
				self.register({ path: path, type: type, listeners: listeners });
			}
			return this;
		}
	}, {
		key: 'all',
		value: function all(path) {
			privates(this).METHOD(path, 'all', arguments);return this;
		}
	}, {
		key: 'get',
		value: function get(path) {
			privates(this).METHOD(path, 'get', arguments);return this;
		}
	}, {
		key: 'post',
		value: function post(path) {
			privates(this).METHOD(path, 'post', arguments);return this;
		}
	}, {
		key: 'head',
		value: function head(path) {
			privates(this).METHOD(path, 'head', arguments);return this;
		}
	}, {
		key: 'put',
		value: function put(path) {
			privates(this).METHOD(path, 'put', arguments);return this;
		}
	}, {
		key: 'delete',
		value: function _delete(path) {
			privates(this).METHOD(path, 'delete', arguments);return this;
		}
	}, {
		key: 'options',
		value: function options(path) {
			privates(this).METHOD(path, 'options', arguments);return this;
		}
	}, {
		key: 'route',
		value: function route(path) {
			var _this = this;

			var ret = {};
			['all', 'get', 'post', 'head', 'put', 'delete', 'options'].forEach(function (method) {
				//ArrowFunctionはarguments使えないのでfunction(){}.bind(this)で代替;
				ret[method] = function () {
					this[method].bind(this, path).apply(this, arguments);
					return ret;
				}.bind(_this);
			});
			return ret;
		}
	}, {
		key: 'param',
		value: function param(name, callback) {
			if (typeof callback !== 'function') {
				return;
			}
			var self = privates(this);
			var names = null;
			if (Array.isArray(name)) {
				names = name;
			} else {
				names = [name];
			}

			names.forEach(function (name) {
				if (typeof name !== 'string') {
					return;
				}
				if (name in self.paramHandlers) {
					self.paramHandlers[name].listeners.push(callback);
					return;
				}
				self.paramHandlers[name] = { listeners: [callback], type: 'parameter' };
			});
		}
	}, {
		key: 'defaults',
		get: function get() {
			return privates(this).defaults;
		},
		set: function set(obj) {
			var self = privates(this);
			if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null) return;
			for (var prop in self.defaults) {
				if (!(prop in obj)) continue;
				self.defaults[prop] = obj[prop];
			}
		}
	}]);

	return Router;
}();

exports.default = Router;


var privateMethods = {
	METHOD: function METHOD(path, method, args) {
		if (path === undefined || path === null) {
			return;
		}
		if (args.length === 1) {
			this.dispatch(path, method);
			return;
		}
		if (args.length === 2 && _typeof(args[1]) === 'object' && args[1] !== null && !(args[1] instanceof Router)) {
			//args[1] is options;
			this.dispatch(path, method, args[1]);
			return;
		}
		var self = privates(this);
		var type = 'method';
		var listeners = [];
		Array.prototype.shift.bind(args)();
		Array.prototype.forEach.bind(args)(function (arg) {
			if (typeof arg !== 'function' && !(arg instanceof Router)) {
				return;
			}
			if (typeof arg === 'function' && arg.length === 4) {
				//error handler登録;
				self.register({ path: path, type: type, method: method, listener: arg }, 'error');
				return;
			}
			listeners.push(arg);
		});
		if (listeners.length !== 0) {
			self.register({ path: path, type: type, method: method, listeners: listeners });
		}
	},


	//matchedはpattern.execの返り値を想定;
	//元のURLからマッチした部分を引いて先頭にスラッシュをつけたものを返す
	//(これが新たなpathになり子ルーターに渡される);
	//元のURLからマッチした部分を引いた結果がURLのpathに相応しくないならnullを返す;
	getRemainder: function getRemainder(matched) {
		if (matched.index !== 0) {
			return null;
		}
		var remainder = matched.input.replace(matched[0], '');
		if (matched[0].slice(-1) !== '/' && remainder[0] !== '/' && remainder !== '') {
			return null;
		}
		return _URL2.default.addFirstSlash(remainder);
	},


	//matchedはpattern.execの返り値を想定。matchedは破壊されない;
	//keysはpathToRegExp()の返り値の第二引数を想定。URLparameterのproperty名が入っている配列;
	//parentParamsは継承するparams。子ルーターのURLparameterと親のルーターのURLparameterを併合する時のため。
	getParams: function getParams(matched, keys, parentParams) {
		var self = privates(this);
		var params = self.defaults.mergeParams ? _extends({}, parentParams) : {};
		matched = matched.concat([]);

		matched.shift();
		if (matched.length === 0) {
			return params;
		}

		keys.forEach(function (value) {
			if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
				return;
			}
			params[value.name] = matched.shift();
		});

		return params;
	},


	//paramsObserverとparamsのpropertyに違いがあれば、その違うproperty名を取得する;
	//取得されたpropertyはそのproperty名で登録されているparamHandlerを取得するために用いられる;
	getChangedParamKeys: function getChangedParamKeys(paramsObserver, params) {
		var keys = [];
		for (var prop in params) {
			if (paramsObserver[prop] !== params[prop]) {
				paramsObserver[prop] = params[prop];
				keys.push(prop);
			}
		}
		return keys;
	},


	/**
  * keysに含まれているparamHandler全て取得
  * @param [array] keys getChangedParamKeysの返り値
  * @return [array] keysにマッチしたparamHandlerが全て入っている配列
  *     paramHandlerの構造 => { handler, paramValue, req }
  */
	getParamHandlers: function getParamHandlers(keys, req) {
		var self = privates(this);
		var paramHandlers = [];
		keys.forEach(function (key) {
			if (key in self.paramHandlers === false) {
				return;
			}
			paramHandlers.push({
				handler: {
					type: self.paramHandlers[key].type,
					listeners: self.paramHandlers[key].listeners
				},
				paramValue: req.params[key],
				req: req
			});
		});
		return paramHandlers;
	},
	getMatchedMiddlewareHandlers: function getMatchedMiddlewareHandlers(handler, req, remainder) {
		if (typeof handler.listener === 'function') {
			return [{ handler: handler, req: req }];
		}
		if (handler.listener instanceof Router) {
			return handler.listener.getMatchedHandlers(remainder, req.method, req.baseUrl, req.params);
		}
	},


	/**
  * Routerからpathとmethodにマッチするhandlerを全て取得する
  * @param [string] path パス
  * @param [string] method httpメソッド名
  * @return [array] マッチしたhandler(matchedHandler)が全て入っている配列
  *     matchedHandlerの構造 => { handler, matched, baseUrl, remainder }
  */
	getMatchedHandlers: function getMatchedHandlers(path, method, _baseUrl) {
		var self = privates(this);
		var matchedHandlers = [];
		self.handlers.forEach(function (handler) {
			var baseUrl = _baseUrl;
			var matched = handler.pattern.exec(path);
			if (matched === null) {
				return;
			}
			if (handler.type === 'middleware') {
				var remainder = self.getRemainder(matched);
				if (remainder === null) {
					return;
				}
				baseUrl += _URL2.default.removeTrailingSlash(matched[0]);
				matchedHandlers.push({ handler: handler, matched: matched, baseUrl: baseUrl, remainder: remainder });
			} else if (method === 'all' || handler.method === 'all' || handler.method === method) {
				matchedHandlers.push({ handler: handler, matched: matched, baseUrl: baseUrl, remainder: '/' });
			}
		});
		return matchedHandlers;
	},
	getCalledHandlers: function getCalledHandlers(path, method, baseUrl, params) {
		var _this2 = this;

		var self = privates(this);
		var matchedHandlers = self.getMatchedHandlers(path, method, baseUrl);
		var calledHandlers = [];
		var paramsObserver = {};
		matchedHandlers.forEach(function (matchedHandler) {
			var handler = matchedHandler.handler;
			var matched = matchedHandler.matched;
			var remainder = matchedHandler.remainder;
			var req = {
				app: _this2,
				baseUrl: matchedHandler.baseUrl,
				params: self.getParams(matched, handler.pattern.keys, params)
			};

			//新たなparameterがあれば、そのparameterのparamHandlersを取得する;
			var changedParamKeys = self.getChangedParamKeys(paramsObserver, req.params);
			var paramHandlers = self.getParamHandlers(changedParamKeys, req);
			calledHandlers.push.apply(calledHandlers, _toConsumableArray(paramHandlers));

			calledHandlers.push({ handler: handler, req: req, remainder: remainder });
		});

		return calledHandlers;
	},


	// ../sub/gfGetCalledHandler.jsにgeneratorFunctionで書かれたコードが有るため、コードを読む際はそちらへ;
	gfGetCalledHandler: function gfGetCalledHandler(path, method, baseUrl, params) {
		var calledHandlers = privates(this).getCalledHandlers(path, method, baseUrl, params);
		var i = 0;
		var l = 0;
		var childRouter = null;
		var obj = {
			value: undefined,
			done: true
		};
		return {
			next: function next(skip) {
				if (calledHandlers.length <= i) {
					return {
						done: true,
						value: undefined
					};
				}
				var calledHandler = calledHandlers[i];
				if (calledHandler.handler.listeners.length <= l) {
					i++;
					l = 0;
					return this.next();
				}

				if (childRouter) {
					var nextHandler = childRouter.getNextHandler(skip);
					if (nextHandler) {
						return {
							done: false,
							value: nextHandler
						};
					}
					l++;
					childRouter = null;
					return this.next();
				}

				if (l !== 0 && skip) {
					i++;
					l = 0;
					return this.next();
				}

				var listener = calledHandler.handler.listeners[l];
				if (listener instanceof Router) {
					childRouter = privates(listener);
					childRouter.goGetCalledHandler = childRouter.gfGetCalledHandler(calledHandler.remainder, method, calledHandler.req.baseUrl, calledHandler.req.params);
					var _nextHandler = childRouter.getNextHandler();
					if (_nextHandler) {
						return {
							done: false,
							value: _nextHandler
						};
					}
					l++;
					childRouter = null;
					return this.next();
				}

				l++;
				//次のhandlerがあるなら最終的にこのobjectを返す;
				return {
					done: false,
					value: {
						type: calledHandler.handler.type,
						listener: listener,
						req: calledHandler.req,
						paramValue: calledHandler.paramValue
					}
				};
			}
		};
	},
	getMatchedErrorHandlers: function getMatchedErrorHandlers(request) {
		var self = privates(this);
		var matchedHandlers = [];
		var method = request.method;
		var path = request.pathname;
		self.errorHandlers.forEach(function (handler) {
			var matched = handler.pattern.exec(path);
			if (matched === null) {
				return;
			}

			if (handler.type === 'middleware') {
				var remainder = self.getRemainder(matched);
				if (remainder === null) {
					return;
				}
				matchedHandlers.push({ handler: handler });
			} else if (handler.method === 'all' || method === 'all' || handler.method === method) {
				matchedHandlers.push({ handler: handler });
			}
		});

		return matchedHandlers;
	},


	// ../sub/gfGetMatchedErrorHandler.jsにgeneratorFunctionで書かれたコードが有るため、コードを読む際はそちらへ;
	gfGetMatchedErrorHandler: function gfGetMatchedErrorHandler(request) {
		var matchedHandlers = privates(this).getMatchedErrorHandlers(request);
		var i = 0;
		return {
			next: function next() {
				if (matchedHandlers.length <= i) {
					return { done: true, value: undefined };
				}
				return { done: false, value: matchedHandlers[i++] };
			}
		};
	},
	getNextHandler: function getNextHandler() {
		var genObj = privates(this).goGetCalledHandler.next(arguments[0]);
		if (genObj.done) {
			return null;
		}
		return genObj.value;
	},
	runNextHandler: function runNextHandler(request, response, error) {
		var self = privates(this);
		var nextHandler = null;
		if (error === 'route') {
			nextHandler = self.getNextHandler(true);
		} else if (error !== undefined) {
			self.goGetMatchedErrorHandlers = self.gfGetMatchedErrorHandler(request);
			self.runNextErrorHandler(request, response, error);
			return;
		} else {
			nextHandler = self.getNextHandler();
		}
		if (nextHandler === null) {
			return;
		}
		_extends(request, nextHandler.req);
		var next = self.runNextHandler.bind(self, request, response);
		if (nextHandler.type === 'parameter') {
			nextHandler.listener(request, response, next, nextHandler.paramValue);
			return;
		}
		nextHandler.listener(request, response, next);
	},
	getNextErrorHandler: function getNextErrorHandler() {
		var genObj = privates(this).goGetMatchedErrorHandlers.next();
		if (genObj.done) {
			return null;
		}
		return genObj.value;
	},
	runNextErrorHandler: function runNextErrorHandler(request, response, error) {
		var self = privates(this);
		var nextHandler = self.getNextErrorHandler();
		if (nextHandler === null) {
			return;
		}
		var next = self.runNextErrorHandler.bind(self, request, response, error);
		nextHandler.handler.listener(error, request, response, next);
	},
	register: function register(properties, destination) {
		var self = privates(this);
		var handler = properties;
		if (handler.type === 'middleware') {
			handler.pattern = (0, _pathToRegexp2.default)(handler.path, null, {
				sensitive: self.defaults.caseSensitive,
				strict: self.defaults.strict,
				end: false
			});
		} else {
			handler.pattern = (0, _pathToRegexp2.default)(handler.path, null, {
				sensitive: self.defaults.caseSensitive,
				strict: self.defaults.strict,
				end: true
			});
		}

		if (destination === 'error') {
			self.errorHandlers.push(handler);
			return;
		}
		self.handlers.push(handler);
	}
};