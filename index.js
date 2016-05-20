(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],3:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":1,"./encode":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Router2 = require('./Router');

var _Router3 = _interopRequireDefault(_Router2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Application = function (_Router) {
	_inherits(Application, _Router);

	function Application(options) {
		_classCallCheck(this, Application);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Application).call(this, options));
	}

	return Application;
}(_Router3.default);

exports.default = Application;
},{"./Router":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var privates = (0, _namespace2.default)();

var Request = function () {
	function Request() {
		/*
  this.app = null;
  this.baseUrl = null;
  this.data = null;
  this.dispatcher = null;
  this.hash = null;
  this.host = null;
  this.hostname = null;
  this.href = null;
  this.method = null;
  this.origin = null;
  this.originalUrl = null;
  this.params = null;
  this.path = null;
  this.pathname = null;
  this.port = null;
  this.protocol = null;
  this.query = null;
  this.search = null;
  this.secure = null;
  */

		_classCallCheck(this, Request);
	}

	_createClass(Request, [{
		key: 'cookies',
		get: function get() {
			var selfClass = privates(Request);
			if (document.cookie === selfClass.documentCookie && selfClass.documentCookie !== undefined) {
				return selfClass.cookies;
			}

			selfClass.documentCookie = document.cookie;
			selfClass.cookies = Object.freeze(_jsCookie2.default.get());
			return selfClass.cookies;
		}
	}]);

	return Request;
}();

exports.default = Request;
},{"./namespace":12,"js-cookie":14}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _httpStatusTable = require('./httpStatusTable');

var _httpStatusTable2 = _interopRequireDefault(_httpStatusTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var privates = (0, _namespace2.default)();

var Response = function () {
	function Response() {
		_classCallCheck(this, Response);

		var self = privates(this);

		self.defaults = {};
		var baseElement = document.body;
		var filename = 'file';
		var url = true;
		var transition = false;
		var cookieExpires = '';
		var cookiePath = '/';
		var cookieDomain = '';
		var cookieSecure = false;
		Object.defineProperties(self.defaults, {
			baseElement: {
				get: function get() {
					return baseElement;
				},
				set: function set(value) {
					if (value instanceof Element) baseElement = value;
				},
				enumerable: true
			},
			filename: {
				get: function get() {
					return filename;
				},
				set: function set(value) {
					filename = String(value);
				},
				enumerable: true
			},
			url: {
				get: function get() {
					return url;
				},
				set: function set(value) {
					url = Boolean(value);
				},
				enumerable: true
			},
			transition: {
				get: function get() {
					return transition;
				},
				set: function set(value) {
					transition = Boolean(value);
				},
				enumerable: true
			},
			cookieExpires: {
				get: function get() {
					return cookieExpires;
				},
				set: function set(value) {
					cookieExpires = String(value);
				},
				enumerable: true
			},
			cookiePath: {
				get: function get() {
					return cookiePath;
				},
				set: function set(value) {
					cookiePath = String(value);
				},
				enumerable: true
			},
			cookieDomain: {
				get: function get() {
					return cookieDomain;
				},
				set: function set(value) {
					cookieDomain = String(value);
				},
				enumerable: true
			},
			cookieSecure: {
				get: function get() {
					return cookieSecure;
				},
				set: function set(value) {
					cookieSecure = Boolean(value);
				},
				enumerable: true
			}
		});

		for (var method in privateMethods) {
			self[method] = privateMethods[method].bind(this);
		}
	}

	_createClass(Response, [{
		key: 'cookie',
		value: function cookie(name, value, options) {
			var self = privates(this);
			if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object' || options === null) {
				options = {};
			}
			if (typeof options.expires !== 'string' && typeof options.expires !== 'number') {
				options.expires = self.defaults.cookieExpires;
			}
			if (typeof options.path !== 'string') {
				options.path = self.defaults.cookiePath;
			}
			if (typeof options.domain !== 'string') {
				options.domain = self.defaults.cookieDomain;
			}
			if (typeof options.secure !== 'boolean') {
				options.secure = self.defaults.cookieSecure;
			}
			_jsCookie2.default.set(name, value, options);
		}
	}, {
		key: 'clearCookie',
		value: function clearCookie(name, options) {
			var self = privates(this);
			if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object' || options === null) {
				options = {};
			}
			if (typeof options.path !== 'string') {
				options.path = self.defaults.cookiePath;
			}
			if (typeof options.domain !== 'string') {
				options.domain = self.defaults.cookieDomain;
			}
			if (typeof options.secure !== 'boolean') {
				options.secure = self.defaults.cookieSecure;
			}
			_jsCookie2.default.remove(name, options);
		}

		/**
   * fileをダウンロード
   * @param [Blob|ArrayBuffer|Object|Number|String] file ダウンロードするファイル. URLも可. URLとBlob以外はBlob化される
   *     ArrayBufferはバイナリファイルとしてblob化
   *     ObjectはJSONとしてblob化
   *     Number/StringはURLまたはURLのパスとして解される. ただしoptionsでurl=falseを指定するとTextとしてblob化される
   * @param [Object] options オプション(任意)
   *     [String] options.filename ファイルネーム
   *     [String] options.type ファイルのmimetype
   *     [Boolean] options.url fileが文字列の時、それがURLかただのテキストか判断. デフォルトはtrue
   *     [Function] options.error ダウンロード失敗時に実行される関数. IEはa.downloadの代わりにxhrを使うので失敗する可能性がある
   */

	}, {
		key: 'download',
		value: function download(file, options) {
			if (file === undefined || file === null) {
				return;
			}

			var self = privates(this);
			if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object' || options === null) {
				options = {};
			}
			if (typeof options.filename !== 'string' && typeof options.filename !== 'number') {
				options.filename = self.defaults.filename;
			}
			if (options.url === undefined) {
				options.url = self.defaults.url;
			}
			if (typeof options.error !== 'function') {
				options.error = new Function();
			}

			if (typeof file === 'string' && options.url === true) {
				//fileはURL;
				if (options.type === undefined) {
					options.type = '';
				}
				self.downloadOnCross(file, options);
				return;
			}

			var blob = self.createBlob(file, options.type);
			self.blobDownload(blob, options.filename);
		}
	}, {
		key: 'redirect',
		value: function redirect(pathname) {
			if (pathname === 'back') {
				history.back();
				return;
			}
			location.href = pathname;
		}

		/**
   * dataを送信
   * dataがtextの場合HTML内に表示
   * dataがfileの場合res.sendFile()で処理をする
   * @param [Element|Document|Blob|ArrayBuffer|Object|Number|String] data 送るデータ
   *     Elementはoptions.baseElementにElementを追加
   *     Documentはdocument.childNodesを全て入れ替える
   *     Blob/ArrayBuffer/Objectはres.sendFile()に渡す
   *     Number/Stringはそのままoptions.baseElementに表示
   * @param [Object] options オプション(任意)
   *     [Element] options.baseElement dataを表示する要素
   *     [String] options.title タイトル
   *     [String] options.filename ファイルネーム. res.sendFile()に渡す
   *     [String] options.type ファイルのmimetype. res.sendFile()に渡す
   *     [Boolean] options.transition 画面遷移するか. デフォルトはfalse. res.sendFile()に渡す
   * @return [Element|null] HTMLを入れ替えた要素を返す
   *     dataが空であればnullを返す
   *     dataがBlob/ArrayBuffer/ObjectであればObject要素を返す
   */

	}, {
		key: 'send',
		value: function send(data, options) {
			if (data === undefined || data === null) {
				return null;
			}

			var self = privates(this);
			if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object' || options === null) {
				options = {};
			}
			if (!(options.baseElement instanceof Element)) {
				options.baseElement = self.defaults.baseElement;
			}

			if (data instanceof Element) {
				options.baseElement.appendChild(data);
				if (options.title !== undefined && options.title !== null) {
					document.title = options.title;
				}
				return options.baseElement;
			}

			if (data instanceof Document) {
				//document以下のnodeを全て消す;
				var node = null;
				while (node = document.firstChild) {
					document.removeChild(node);
				}

				//documentにdataのnodeを全て追加;
				var childs = Array.prototype.slice.call(data.childNodes);
				childs.forEach(function (node) {
					document.appendChild(node);
				});

				if (options.title !== undefined && options.title !== null) {
					document.title = options.title;
				}
				return document;
			}

			//dataがBlob/ArrayBuffer/Objectの時はsendFileで処理する;
			if (typeof data !== 'string' && typeof data !== 'number') {
				return this.sendFile(data, options);
			}

			//dataはtext;
			options.baseElement.innerHTML = data;
			if (options.title !== undefined && options.title !== null) {
				document.title = options.title;
			}
			return options.baseElement;
		}

		/**
   * fileを送信
   * fileからBlobURLを作ってそれを表示
   * URLをObject要素で表示するか、直接そのURLに遷移するかoptionsで選択する
   * @param [Blob|ArrayBuffer|Object|Number|String] file 送るファイル. URLも可. URLとBlob以外はBlob化される
   *     ArrayBufferはバイナリファイルとしてblob化
   *     ObjectはJSONとしてblob化
   *     Number/StringはURLまたはURLのパスとして解される. ただしoptionsでurl=falseを指定するとTextとしてblob化される
   * @param [Object] options オプション(任意)
   *     [Element] options.baseElement Object要素を置く要素
   *     [String] options.title タイトル
   *     [String] options.filename ファイルネーム. IEでblobを直接ダウンロードするときのファイル名
   *     [String] options.type ファイルのmimetype
   *     [Boolean] options.url fileが文字列の時、それがURLかただのテキストか判断. デフォルトはtrue
   *     [Boolean] options.transition 画面遷移するか. デフォルトはfalse
   * @return [Element|null] Object要素を返す
   *     fileが空または画面遷移する時はnullを返す
   */

	}, {
		key: 'sendFile',
		value: function sendFile(file, options) {
			if (file === undefined || file === null) {
				return null;
			}

			var self = privates(this);
			if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object' || options === null) {
				options = {};
			}
			if (!(options.baseElement instanceof Element)) {
				options.baseElement = self.defaults.baseElement;
			}
			if (typeof options.filename !== 'string' && typeof options.filename !== 'number') {
				options.filename = self.defaults.filename;
			}
			if (typeof options.type !== 'string') {
				options.type = '';
			}
			if (options.url === undefined) {
				options.url = self.defaults.url;
			}
			if (options.transition === undefined) {
				options.transition = self.defaults.transition;
			}

			if (options.title !== undefined && options.title !== null) {
				document.title = options.title;
			}

			if (typeof file === 'string' && options.url === true) {
				//fileはURL;
				//画面遷移するか;
				if (options.transition === true) {
					location.replace(file);
					return null;
				}
				//遷移しないならオブジェクト要素でURL先のコンテンツを表示;
				return self.showObject(file, options);
			}

			var blob = self.createBlob(file, options.type);
			options.type = blob.type;

			return self.showBlob(blob, options);
		}

		/**
   * HTTPのステータスを送信
   * httpStatusTableからメッセージを取得して表示
   * httpStatusTableにないステータスは番号をそのまま表示
   * @param [Number|String] status HTTPのステータス番号
   * @param [Object] options オプション(任意)
   *     [Element] options.baseElement HTTPステータスメッセージを表示する要素
   *     [String] options.title タイトル. 指定しない場合はHTTPステータスメッセージがtitleになる
   *     [String] options.message デフォルトのHTTPステータスメッセージ以外のメッセージを表示したい時、指定する
   */

	}, {
		key: 'sendStatus',
		value: function sendStatus(status, options) {
			if (status === undefined || status === null) {
				return;
			}
			status = Number(status);

			var self = privates(this);
			if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object' || options === null) {
				options = {};
			}
			if (!(options.baseElement instanceof Element)) {
				options.baseElement = self.defaults.baseElement;
			}

			var responseText = _httpStatusTable2.default[status] ? status + ' ' + _httpStatusTable2.default[status] : status;

			document.title = options.title === undefined || options.title === null ? responseText : options.title;

			options.baseElement.innerHTML = options.message === undefined || options.message === null ? responseText : options.message;
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

	return Response;
}();

exports.default = Response;


var privateMethods = {
	downloadOnCross: function downloadOnCross(url, options) {
		var self = privates(this);

		var a = document.createElement('a');
		a.href = url;
		self.downloadByXHR(a.href, options.filename, options.type, options.error);
		/*
  if(a.origin !== location.origin) {
  	self.downloadByXHR(a.href, options.filename, options.type, options.error);
  	return;
  }
  if(! ('download' in a)) {
  	self.downloadByXHR(a.href, options.filename, options.type, options.error);
  	return;
  }
  self.downloadByA(a.href, options.filename, options.type);
  */
	},
	downloadByA: function downloadByA(url, filename, type) {
		var a = document.createElement('a');
		a.download = filename;
		a.href = url;
		a.type = type;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	},
	downloadByXHR: function downloadByXHR(url, filename, type, error) {
		var self = privates(this);
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.overrideMimeType(type);
		xhr.responseType = 'blob';

		xhr.ontimeout = function () {
			error(new Error('timeout'));
		};
		xhr.onerror = function () {
			error(new Error('error'));
		};
		xhr.onload = function () {
			if (xhr.status !== 200) {
				error(new Error(xhr.statusText));
				return;
			}
			self.blobDownload(xhr.response, filename);
		};
		xhr.send();
	},
	blobDownload: function blobDownload(blob, filename) {
		var self = privates(this);
		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob, filename);
			return;
		}
		if (!('download' in document.createElement('a'))) return;

		var url = window.URL.createObjectURL(blob);
		self.downloadByA(url, filename, blob.type);
		window.setTimeout(function () {
			window.URL.revokeObjectURL(url);
		}, 100);
	},
	showObject: function showObject(url, options) {
		var object = document.createElement('object');
		object.data = url;
		object.type = options.type;
		options.baseElement.innerHTML = '';
		options.baseElement.appendChild(object);
		return object;
	},
	showBlob: function showBlob(blob, options) {
		var self = privates(this);
		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob, options.filename);
			return null;
		}

		var url = window.URL.createObjectURL(blob);

		if (options.transition === true) {
			location.replace(url);
			return null;
		}

		return self.showObject(url, options);
	},
	createBlob: function createBlob(param, type) {
		if (param instanceof Blob) {
			return param;
		}
		if (param instanceof ArrayBuffer) {
			return new Blob([param], { type: type || 'application/octet-stream' });
		}
		if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object' && param !== null) {
			return new Blob([JSON.stringify(param)], { type: type || 'application/json' });
		}
		return new Blob([String(param)], { type: type || 'text/plain' });
	}
};
},{"./httpStatusTable":9,"./namespace":12,"js-cookie":14}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
		var addHistory = true;
		var changePath = true;
		var transition = true;
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
			},
			addHistory: {
				get: function get() {
					return addHistory;
				},
				set: function set(value) {
					addHistory = Boolean(value);
				},
				enumerable: true
			},
			changePath: {
				get: function get() {
					return changePath;
				},
				set: function set(value) {
					changePath = Boolean(value);
				},
				enumerable: true
			},
			transition: {
				get: function get() {
					return transition;
				},
				set: function set(value) {
					transition = Boolean(value);
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
			var self = privates(this);

			if (typeof urlString !== 'string') return;
			if (typeof method !== 'string') method = 'all';
			if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object' || options === null) options = {};
			if (typeof options.addHistory !== 'boolean') options.addHistory = self.defaults.addHistory;
			if (typeof options.changePath !== 'boolean') options.changePath = self.defaults.changePath;
			if (typeof options.transition !== 'boolean') options.transition = self.defaults.transition;

			var request = new _Request2.default();
			var response = new _Response2.default();

			var url = _URL2.default.parse(urlString);
			if (url.origin !== location.origin) {
				//別オリジンならurl遷移;
				if (options.transition) location.href = url.href;
				return;
			}
			request.dispatcher = this;
			request.originalUrl = urlString;
			request.method = method;
			request.data = options.data;
			_extends(request, url);

			var state = { path: urlString };
			if (options.addHistory && options.changePath) {
				//default;
				window.history.pushState(state, null, url.href);
			} else if (options.addHistory && options.changePath === false) {
				window.history.pushState(state, null, location.href);
			} else if (options.addHistory === false && options.changePath) {
				window.history.replaceState(state, null, url.href);
			}
			// false && false は何もしない;

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
},{"./Request":5,"./Response":6,"./URL":8,"./namespace":12,"path-to-regexp":15}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var URL = {};

URL.parse = function (urlString) {
	var a = document.createElement('a');
	a.href = urlString;
	a.href = a.href; //for IE;
	var urlObj = {};
	urlObj.protocol = a.protocol; // same as auth;
	urlObj.secure = a.protocol === 'https:';
	urlObj.host = a.port === '80' ? a.host.replace(':80', '') : a.host;
	urlObj.port = a.port === '80' ? '' : a.port;
	urlObj.hostname = a.hostname;
	urlObj.hash = a.hash;
	urlObj.search = a.search;
	urlObj.query = _querystring2.default.parse(a.search.slice(1));
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
},{"querystring":3}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	'100': 'Continue',
	'101': 'Switching Protocols',
	'200': 'OK',
	'201': 'Created',
	'202': 'Accepted',
	'203': 'Non-Authoritative Information',
	'204': 'No Content',
	'205': 'Reset Content',
	'206': 'Partial Content',
	'226': 'IM Used',
	'300': 'Multiple Choices',
	'301': 'Moved Permanently',
	'302': 'Found',
	'303': 'See Other',
	'304': 'Not Modified',
	'305': 'Use Proxy',
	'307': 'Temporary Redirect',
	'308': 'Permanent Redirect',
	'400': 'Bad Request',
	'401': 'Unauthorized',
	'402': 'Payment Required',
	'403': 'Forbidden',
	'404': 'Not Found',
	'405': 'Method Not Allowed',
	'406': 'Not Acceptable',
	'407': 'Proxy Authentication Required',
	'408': 'Request Timeout',
	'409': 'Conflict',
	'410': 'Gone',
	'411': 'Length Required',
	'412': 'Precondition Failed',
	'413': 'Request Entity Too Large',
	'414': 'Request-URI Too Long',
	'415': 'Unsupported Media Type',
	'416': 'Requested Range Not Satisfiable',
	'417': 'Expectation Failed',
	'418': 'I\'m a teapot',
	'421': 'Misdirected Request',
	'426': 'Upgrade Required',
	'428': 'Precondition Required',
	'429': 'Too Many Requests ',
	'431': 'Request Header Fields Too Large',
	'451': 'Unavailable For Legal Reasons',
	'500': 'Internal Server Error',
	'501': 'Not Implemented',
	'502': 'Bad Gateway',
	'503': 'Service Unavailable',
	'504': 'Gateway Timeout',
	'505': 'HTTP Version Not Supported',
	'506': 'Variant Also Negotiates',
	'510': 'Not Extended',
	'511': 'Network Authentication Required'
};
},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Application = require('./Application');

var _Application2 = _interopRequireDefault(_Application);

var _Router = require('./Router');

var _Router2 = _interopRequireDefault(_Router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function leads(options) {
	return new _Application2.default(options);
}

leads.Router = function (options) {
	return new _Router2.default(options);
};

exports.default = leads;
},{"./Application":4,"./Router":7}],11:[function(require,module,exports){
'use strict';

var _leads = require('./leads');

var _leads2 = _interopRequireDefault(_leads);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.leads = _leads2.default;
},{"./leads":10}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],14:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.1.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
					attributes.path    && '; path=' + attributes.path,
					attributes.domain  && '; domain=' + attributes.domain,
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var name = parts[0].replace(rdecode, decodeURIComponent);
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api(key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],15:[function(require,module,exports){
var isarray = require('isarray')

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */
function parse (str) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var suffix = res[6]
    var asterisk = res[7]

    var repeat = suffix === '+' || suffix === '*'
    var optional = suffix === '?' || suffix === '*'
    var delimiter = prefix || '/'
    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: escapeGroup(pattern)
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {String}   str
 * @return {Function}
 */
function compile (str) {
  return tokensToFunction(parse(str))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^' + tokens[i].pattern + '$')
    }
  }

  return function (obj) {
    var path = ''
    var data = obj || {}

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encodeURIComponent(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = encodeURIComponent(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {String} str
 * @return {String}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function stringToRegexp (path, keys, options) {
  var tokens = parse(path)
  var re = tokensToRegExp(tokens, options)

  // Attach keys back to the regexp.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] !== 'string') {
      keys.push(tokens[i])
    }
  }

  return attachKeys(re, keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {Array}  tokens
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function tokensToRegExp (tokens, options) {
  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''
  var lastToken = tokens[tokens.length - 1]
  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = token.pattern

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (prefix) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || []

  if (!isarray(keys)) {
    options = keys
    keys = []
  } else if (!options) {
    options = {}
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options)
  }

  if (isarray(path)) {
    return arrayToRegexp(path, keys, options)
  }

  return stringToRegexp(path, keys, options)
}

},{"isarray":13}]},{},[11]);
