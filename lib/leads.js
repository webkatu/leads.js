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