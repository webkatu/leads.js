'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _internal = require('./internal');

var _internal2 = _interopRequireDefault(_internal);

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var privates = (0, _namespace2.default)();

var Request = function () {
	function Request() {
		_classCallCheck(this, Request);

		var self = (0, _internal2.default)(this);
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