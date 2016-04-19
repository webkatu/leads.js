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