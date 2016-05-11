import internal from './internal';
import ns from './namespace';
import qs from 'querystring';
import cookies from 'js-cookie';

const privates = ns();
export default class Request {
	constructor() {
		let self = internal(this);
		self.setURL = setURL.bind(this);

		/*
		this.app = null;
		this.baseUrl = null;
		this.data = null;
		this.dispatcher = null;
		this.hash = null;
		this.hostname = null;
		this.method = null;
		this.originalUrl = null;
		this.params = null;
		this.path = null;
		this.pathname = null;
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




function setURL(url) {
	this.originalUrl = url.href;
	this.secure = url.auth;
	this.protocol = url.protocol;
	this.hostname = url.hostname;
	this.port = url.port;
	this.pathname = url.pathname;
	this.path = url.path = url.path
	this.search = url.search;
	this.hash = url.hash;
	this.query = qs.parse(url.query);
}