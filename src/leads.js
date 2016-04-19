import Application from './Application';
import Router from './Router';

function leads(options) {
	return new Application(options);
}

leads.Router = function(options) {
	return new Router(options);
}

export default leads