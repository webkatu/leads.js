'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _internal = require('./internal');

var _internal2 = _interopRequireDefault(_internal);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function Request() {
	_classCallCheck(this, Request);

	var self = (0, _internal2.default)(this);
	self.setURL = setURL.bind(this);

	this.originalUrl = null;
	this.protocol = null;
	this.hostname = null;
	this.pathname = null;
	this.path = null;
	this.search = null;
	this.hash = null;
	this.query = null;
	this.cookies = Object.freeze(_jsCookie2.default.get());
	this.params = {};
};

exports.default = Request;


function setURL(url) {
	this.originalUrl = url.href;
	this.secure = url.auth;
	this.protocol = url.protocol;
	this.hostname = url.hostname;
	this.port = url.port;
	this.pathname = url.pathname;
	this.path = url.path = url.path;
	this.search = url.search;
	this.hash = url.hash;
	this.query = _querystring2.default.parse(url.query);
}