import ns from './namespace';
import cookies from 'js-cookie';
import httpStatusTable from './httpStatusTable';

let privates = ns();
export default class Response {
	constructor() {
		let self = privates(this);
	
		self.defaults = {};
		let baseElement = document.body;
		let filename = 'file';
		let url = true;
		let transition = false;
		Object.defineProperties(self.defaults, {
			baseElement: {
				get: () => { return baseElement; },
				set: (value) => { if(value instanceof Element) baseElement = value; },
				enumerable: true,
			},
			filename: {
				get: () => { return filename; },
				set: (value) => { filename = String(value); },
				enumerable: true,
			},
			url: {
				get: () => { return url; },
				set: (value) => { url = Boolean(value); },
				enumerable: true,
			},
			transition: {
				get: () => { return transition; },
				set: (value) => { transition = Boolean(value); },
				enumerable: true,
			},
		});

		self.downloadOnCross = downloadOnCross.bind(this);
		self.downloadByA = downloadByA.bind(this);
		self.downloadByXHR = downloadByXHR.bind(this);
		self.blobDownload = blobDownload.bind(this);
		self.showObject = showObject.bind(this);
		self.showBlob = showBlob.bind(this);
		self.createBlob = createBlob.bind(this);

		Object.defineProperties(this, {
			defaults: {
				get: () => { return self.defaults; },
				set: (obj) => {
					if(typeof obj !== 'object' || obj === null) return;
					for(let prop in self.defaults) {
						if(! (prop in obj)) continue;
						self.defaults[prop] = obj[prop];
					}
				},
				enumerable: true,
			},
		});
	}

	cookie(name, value, options) {
		cookies.set(name, value, options);
	}

	clearCookie(name, options) {
		cookies.remove(name, options);
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
	download(file, options) {
		if(file === undefined || file === null) {
			return;
		}

		let self = privates(this);
		if(typeof options !== 'object' || options === null) {
			options = {};
		}
		if(typeof options.filename !== 'string' && typeof options.filename !== 'number') {
			options.filename = self.defaults.filename;
		}
		if(options.url === undefined) {
			options.url = self.defaults.url;
		}
		if(typeof options.error !== 'function') {
			options.error = new Function();
		}

		if(typeof file === 'string' && options.url === true) {
			//fileはURL;
			if(options.type === undefined) {
				options.type = '';
			}
			self.downloadOnCross(file, options);
			return;
		}

		let blob = self.createBlob(file, options.type);
		self.blobDownload(blob, options.filename);
	}

	redirect(pathname) {
		if(pathname === 'back') {
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
	 *     ElementはElement内のHTMLをoptions.baseElementに表示
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
	send(data, options) {
		if(data === undefined || data === null) {
			return null;
		}

		let self = privates(this);
		if(typeof options !== 'object' || options === null) {
			options = {};
		}
		if(! (options.baseElement instanceof Element)) {
			options.baseElement = self.defaults.baseElement;
		}

		if(data instanceof Element) {
			options.baseElement.innerHTML = data.innerHTML;
			if(options.title !== undefined && options.title !== null) {
				document.title = options.title;
			}
			return options.baseElement;
		}

		if(data instanceof Document) {
			document.documentElement.innerHTML = data.documentElement.innerHTML;
			//html要素の属性も同じにする;
			Array.prototype.forEach.bind(data.documentElement.attributes)((attr) => {
				document.documentElement.setAttributes(attr, data.documentElement.getAttribute(attr));
			});
			if(options.title !== undefined && options.title !== null) {
				document.title = options.title;
			}
			return document.documentElement;
		}

		//dataがBlob/ArrayBuffer/Objectの時はsendFileで処理する;
		if(typeof data !== 'string' && typeof data !== 'number') {
			return this.sendFile(data, options);
		}

		//dataはtext;
		options.baseElement.innerHTML = data;
		if(options.title !== undefined && options.title !== null) {
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
	sendFile(file, options) {
		if(file === undefined || file === null) {
			return null;
		}

		let self = privates(this);
		if(typeof options !== 'object' || options === null) {
			options = {};
		}
		if(! (options.baseElement instanceof Element)) {
			options.baseElement = self.defaults.baseElement;
		}
		if(typeof options.filename !== 'string' && typeof options.filename !== 'number') {
			options.filename = self.defaults.filename;
		}
		if(typeof options.type !== 'string') {
			options.type = '';
		}
		if(options.url === undefined) {
			options.url = self.defaults.url;
		}
		if(options.transition === undefined) {
			options.transition = self.defaults.transition;
		}



		if(options.title !== undefined && options.title !== null) {
			document.title = options.title;
		}

		if(typeof file === 'string' && options.url === true) {
			//fileはURL;
			//画面遷移するか;
			if(options.transition === true) {
				location.replace(file);
				return null;
			}
			//遷移しないならオブジェクト要素でURL先のコンテンツを表示;
			return self.showObject(file, options);
		}

		let blob = self.createBlob(file, options.type);
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
	sendStatus(status, options) {
		if(status === undefined || status === null) {
			return;
		}
		status = Number(status);

		let self = privates(this);
		if(typeof options !== 'object' || options === null) {
			options = {};
		}
		if(! (options.baseElement instanceof Element)) {
			options.baseElement = self.defaults.baseElement;
		}

		let responseText = httpStatusTable[status]
			? `${status} ${httpStatusTable[status]}`
			: status;
		
		document.title = options.title === undefined || options.title === null
			? responseText
			: options.title;

		options.baseElement.innerHTML = options.message === undefined || options.message === null
			? responseText
			: options.message;
	}

}

function downloadOnCross(url, options) {
	let self = privates(this);

	let a = document.createElement('a');
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
}

function downloadByA(url, filename, type) {
	let a = document.createElement('a');
	a.download = filename;
	a.href = url;
	a.type = type;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

function downloadByXHR(url, filename, type, error) {
	let self = privates(this);
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.overrideMimeType(type);
	xhr.responseType = 'blob';

	xhr.onerror = function(e) { error(e); };
	xhr.onloadend = function() {
		if(xhr.status !== 200) return;
		self.blobDownload(xhr.response, filename);
	};
	xhr.send();
}

function blobDownload(blob, filename) {
	let self = privates(this);
	if(window.navigator.msSaveBlob) {
		window.navigator.msSaveBlob(blob, filename);
		return;
	}
	if(! ('download' in document.createElement('a'))) return;

	let url = window.URL.createObjectURL(blob);
	self.downloadByA(url, filename, blob.type);
	window.setTimeout(() => { window.URL.revokeObjectURL(url); }, 100);
}

function showObject(url, options) {
	let object = document.createElement('object');
	object.data = url;
	object.type = options.type;
	options.baseElement.innerHTML = '';
	options.baseElement.appendChild(object);
	return object;
}

function showBlob(blob, options) {
	let self = privates(this);
	if(window.navigator.msSaveBlob) {
		window.navigator.msSaveBlob(blob, options.filename);
		return null;
	}

	let url = window.URL.createObjectURL(blob);
	
	if(options.transition === true) {
		location.replace(url);
		return null;
	}

	return self.showObject(url, options);
}

function createBlob(param, type) {
	if(param instanceof Blob) {
		return param;
	}
	if(param instanceof ArrayBuffer) {
		return new Blob([ param ], { type: type || 'application/octet-stream' });
	}
	if(typeof param === 'object' && param !== null) {
		return new Blob([ JSON.stringify(param) ], { type: type || 'application/json' });
	}
	return new Blob([ String(param) ], { type: type || 'text/plain' });
}
