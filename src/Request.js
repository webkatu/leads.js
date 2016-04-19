import internal from './internal';
import qs from 'querystring';
import cookies from 'js-cookie';

export default class Request {
	constructor() {
		let self = internal(this);
		self.setURL = setURL.bind(this);

		this.originalUrl = null;
		this.protocol = null;
		this.hostname = null;
		this.pathname = null;
		this.path = null;
		this.search = null;
		this.hash = null;
		this.query = null;
		this.cookies = Object.freeze(cookies.get());
		this.params = {};
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