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
		this.host = null;
		this.hostname = null;
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




function setURL(url) {
	this.hash = url.hash;
	this.host = url.host;
	this.hostname = url.hostname;
	this.origin = url.origin;
	this.originalUrl = url.href;
	this.path = url.path = url.path
	this.pathname = url.pathname;
	this.port = url.port;
	this.protocol = url.protocol;
	this.query = qs.parse(url.query);
	this.search = url.search;
	this.secure = url.auth;
}