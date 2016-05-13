import ns from './namespace';
import cookies from 'js-cookie';

const privates = ns();
export default class Request {
	constructor() {
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
	}

	get cookies() {
		let selfClass = privates(Request);
		if(document.cookie === selfClass.documentCookie && selfClass.documentCookie !== undefined) {
			return selfClass.cookies;
		}

		selfClass.documentCookie = document.cookie;
		selfClass.cookies = Object.freeze(cookies.get());
		return selfClass.cookies;
	}
}