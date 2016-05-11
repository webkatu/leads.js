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
   *     Documentはルート要素(html)のHTMLを現在のDocumentのルート要素のHTMLと切り替える
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
				document.documentElement.innerHTML = data.documentElement.innerHTML;
				//html要素の属性も同じにする;
				Array.prototype.forEach.bind(data.documentElement.attributes)(function (attr) {
					document.documentElement.setAttributes(attr, data.documentElement.getAttribute(attr));
				});
				if (options.title !== undefined && options.title !== null) {
					document.title = options.title;
				}
				return document.documentElement;
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

		xhr.onerror = function (e) {
			error(e);
		};
		xhr.onloadend = function () {
			if (xhr.status !== 200) return;
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