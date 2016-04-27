var r = leads.Router();
var called = false;
var calledTime = 0;
var middlewareCalledTime = 0;
var errorHandlerCalledTime = 0;
var paramHandlerCalledTime = 0;
var options = { changePath: false, addHistory: false };

var _call = function _call(req, res, next) {
	calledTime++;
	next();
}

var callErrorHandler = function(err, req, res, next) {
	errorHandlerCalledTime++;
	next();
}

var callMiddleware = function callMiddleware(req, res, next) {
	middlewareCalledTime++;
	next();
}

var callParamHandler = function callParamHandler(req, res, next, id) {
	paramHandlerCalledTime++;
	next();
}

describe('r.use() register handler', function() {
	it('should call all', function() {
		var r = leads.Router();
		r.use(_call);
		r.use(_call, _call);
		r.use(_call, _call, _call);
		r.use('/', _call);
		r.use('/', _call, _call);
		r.use('/', _call, _call, _call);
		r.use('*', _call);
		r.use('/*', _call);
		r.use(/\//, _call);
		
		calledTime = 0;
		r.all('/', options);
		assert(calledTime === 15);
	});
});

describe('r.use() register child router', function() {
	it('should call all', function() {
		var r = leads.Router();
		var cr = leads.Router();
		var cr2 = leads.Router();
		var ccr = leads.Router();
		ccr.use('/ghi', _call);
		cr.use('/def', _call);
		cr.use('/def', ccr);
		cr2.use('/def', _call);
		cr2.use('/def', ccr);
		r.use('/abc', cr, cr2);
		
		calledTime = 0;
		r.all('/abc/def/ghi', options);
		assert(calledTime === 4);
	});
});

describe('r.use() register error handler', function() {
	it('should call all', function() {
		var r = leads.Router();
		r.use('/', callErrorHandler);
		r.use('/', callErrorHandler, callErrorHandler);
		r.use('/', callErrorHandler, callErrorHandler, callErrorHandler);
		r.use(callErrorHandler);
		r.use(callErrorHandler, callErrorHandler);
		r.use(callErrorHandler, callErrorHandler, callErrorHandler);

		r.use(function(req, res, next) {
			next('error');
		});

		errorHandlerCalledTime = 0;
		r.all('/', options);
		assert(errorHandlerCalledTime === 12);
	});
});

describe('r.use() register handler & child router & errorHandler', function() {
	var r = leads.Router();
	var cr = leads.Router();
	var ccr = leads.Router();
	ccr.use('/', _call, callErrorHandler);
	cr.use(ccr, callErrorHandler, _call, _call);
	r.use('/', _call, callErrorHandler, cr, ccr, _call, callErrorHandler);
	it('should call handler & router', function() {
		calledTime = 0;
		r.all('/', options);
		assert(calledTime === 6);
	});
	it('should call errorHandler', function() {
		r.use('/', function(req, res, next) { next('error') });
		errorHandlerCalledTime = 0;
		r.all('/', options);
		assert(errorHandlerCalledTime === 2);
	});
});

describe('r.METHOD() register handler', function() {
	it('should register', function() {
		var r = leads.Router();
		r.get('/', _call);
		r.get('/', _call, _call);
		r.get('/', _call, _call, _call);
		r.get('*', _call);
		r.get('/*', _call);
		r.get(/\//, _call);
		
		calledTime = 0;
		r.all('/', options);
		assert(calledTime === 9);
	});
});

describe('r.METHOD() register child router', function() {
	it('should call all', function() {
		var r = leads.Router();
		var cr = leads.Router();
		var cr2 = leads.Router();
		var ccr = leads.Router();
		ccr.get('/', _call);
		cr.get('/', _call);
		cr.get('/', ccr);
		cr2.get('/', _call);
		cr2.get('/', ccr);
		r.get('/', cr, cr2);
		
		calledTime = 0;
		r.all('/', options);
		assert(calledTime === 4);
	});
});

describe('r.METHOD() register error handler', function() {
	it('should call all', function() {
		var r = leads.Router();
		r.all('/', callErrorHandler);
		r.all('/', callErrorHandler, callErrorHandler);
		r.all('/', callErrorHandler, callErrorHandler, callErrorHandler);

		r.all('/', function(req, res, next) {
			next('error');
		});

		errorHandlerCalledTime = 0;
		r.all('/', options);
		assert(errorHandlerCalledTime === 6);
	});
});

describe('r.param() register ', function() {
	it('should call all', function() {
		var r = leads.Router();
		r.use('/:id', _call);
		r.param('id', function(req, res, next, id) {
			_call(req, res, next);
		});

		calledTime = 0;
		r.all('/abc', options);
		assert(calledTime === 2);
	});
});

describe('r.route() register', function() {
	it('should call all', function() {
		var r = leads.Router();
		r.route('/route').all(_call).get(_call).post(_call).put(_call).delete(_call);
		
		calledTime = 0;
		r.all('/route', options);
		assert(calledTime === 5);
	});
});

describe('call r.use(string)', function() {
	it('should call properly', function() {
		var r = leads.Router();
		r.use('/', _call);
		r.use('/foo', _call);
		r.use('/f*', _call);
		r.use('/foo/*', _call)
		r.use('/foo/b(a)?r', _call);
		r.use('/foo/bar', _call);
		r.use('/foo/bar/baz', _call);
		r.use('/f', _call);
		r.use('foo', _call);
		r.use('/bar', _call);

		calledTime = 0;
		r.all('/foo', options);
		assert(calledTime === 3);
		calledTime = 0;
		r.all('/foo/br', options);
		assert(calledTime === 5);
		calledTime = 0;
		r.all('/foo/bar', options);
		assert(calledTime === 6);
		calledTime = 0;
		r.all('/foo/bar/baz', options);
		assert(calledTime === 7);
	});
});

describe('call r.use(regexp)', function() {
	it('should call properly', function() {
		var r = leads.Router();
		r.use(/\//, _call);
		r.use(/\/foo/, _call);
		r.use(/\/f/, _call);
		r.use(/\/foo\//, _call);
		r.use(/\/foo\/bar/, _call);
		r.use(/\/foo\/bar\/baz/, _call);
		r.use(/foo/, _call);
		r.use(/\/bar/, _call);

		calledTime = 0;
		r.all('/foo', options);
		assert(calledTime === 2);
		calledTime = 0;
		r.all('/foo/bar', options);
		assert(calledTime === 4);
		calledTime = 0;
		r.all('/foo/bar/baz', options);
		assert(calledTime === 5);
	});
});

describe('call r.use(array)', function() {
	it('should call properly', function() {
		var r = leads.Router();
		r.use(['/foo', '/hoge'], _call);
		r.use(['/hoge', '/foo/bar'], _call);
		r.use(['/hoge', '/huga', '/piyo'], _call);
		r.use(['/bar', /\/baz/, /foo/], _call);

		calledTime = 0;
		r.all('/foo', options);
		assert(calledTime === 1);
		calledTime = 0;
		r.all('/foo/bar', options);
		assert(calledTime === 2);
		calledTime = 0;
		r.all('/baz', options);
		assert(calledTime === 1);
	});
});

describe('call r.use(router)', function() {
	it('should call properly', function() {
		var r = leads.Router();
		var cr = leads.Router();
		cr.use(['/foo', '/bar'], _call);
		cr.use([/\f/, /\/b/], _call);
		cr.use(/\/bar/, _call);
		cr.use(/bar/, _call);
		r.use('/foo', cr);
		r.use('/foo/bar', _call);

		calledTime = 0;
		r.all('/foo', options);
		assert(calledTime === 0);
		calledTime = 0;
		r.all('/foo/bar', options);
		assert(calledTime === 3);
		calledTime = 0;
		r.all('/foo/bar/baz', options);
		assert(calledTime === 3);
	});
});

describe('call r.METHOD(string)', function() {
	it('should call properly', function() {
		var r = leads.Router();
		r.get('/', _call);
		r.get('/foo', _call);
		r.get('/f*', _call);
		r.get('/foo/*', _call)
		r.get('/foo/b(a)?r', _call);
		r.get('/foo/bar', _call);
		r.get('/foo/bar/baz', _call);
		r.get('/f', _call);
		r.get('foo', _call);
		r.get('/bar', _call);

		calledTime = 0;
		r.all('/foo', options);
		assert(calledTime === 2);
		calledTime = 0;
		r.all('/foo/br', options);
		assert(calledTime === 3);
		calledTime = 0;
		r.all('/foo/bar', options);
		assert(calledTime === 4);
		calledTime = 0;
		r.all('/foo/bar/baz', options);
		assert(calledTime === 3);
	});
});

describe('call r.METHOD(regexp)', function() {
	it('should call properly', function() {
		var r = leads.Router();
		r.post(/\//, _call);
		r.post(/\/foo/, _call);
		r.post(/\/f/, _call);
		r.post(/\/foo\//, _call);
		r.post(/\/foo\/bar/, _call);
		r.post(/\/foo\/bar\/baz/, _call);
		r.post(/foo/, _call);
		r.post(/\/bar/, _call);

		calledTime = 0;
		r.all('/foo', options);
		assert(calledTime === 4);
		calledTime = 0;
		r.all('/foo/bar', options);
		assert(calledTime === 7);
		calledTime = 0;
		r.all('/foo/bar/baz', options);
		assert(calledTime === 8);
	});
});

describe('call r.METHOD(array)', function() {
	it('should call properly', function() {
		var r = leads.Router();
		r.post(['/foo', '/hoge'], _call);
		r.post(['/hoge', '/foo/bar'], _call);
		r.post(['/hoge', '/huga', '/piyo'], _call);
		r.post(['/bar', /\/baz/, /foo/], _call);

		calledTime = 0;
		r.all('/foo', options);
		assert(calledTime === 2);
		calledTime = 0;
		r.all('/foo/bar', options);
		assert(calledTime === 2);
		calledTime = 0;
		r.all('/baz', options);
		assert(calledTime === 1);
	});
});

describe('call r.METHOD(router)', function() {
	it('should call properly', function() {
		var r = leads.Router();
		var cr = leads.Router();
		cr.get('/', _call);
		r.get('/foo', cr);
		r.get('/foo/bar', _call);

		calledTime = 0;
		r.all('/foo', options);
		assert(calledTime === 1);
		calledTime = 0;
		r.all('/foo/bar', options);
		assert(calledTime === 1);
	});
});

describe('call r.get()', function() {
	it('should call get method only', function() {
		var r = leads.Router();
		r.route('/').get(_call).post(_call).put(_call).delete(_call);

		calledTime = 0;
		r.get('/', options);
		assert(calledTime === 1);
	}); 
});

describe('call r.param()', function() {
	it('should call properly', function() {
		var r = leads.Router();
		var cr = leads.Router();
		cr.use('/user/:id', _call);
		r.use('/:id', _call);
		r.use(cr)
		r.get('/:id', _call);
		r.use('/user/:id', _call);
		r.param('id', callParamHandler);

		paramHandlerCalledTime = 0;
		r.all('/user/123', options);
		assert(paramHandlerCalledTime === 2);
	});
});

describe('next()', function() {
	it('should call properly', function() {
		var r = leads.Router();
		var cr = leads.Router();
		cr.use(function(req, res, next) {}, _call);
		r.use(_call, cr, _call);
		calledTime = 0;
		r.all('/', options);
		assert(calledTime === 1);
	});
});

describe('next(\'route\')', function() {
	it('should skip', function() {
		var skipListener = function(req, res, next) { next('route'); };
		var r = leads.Router();
		var cr = leads.Router();
		cr.use(_call, skipListener, _call);
		r.use('/:foo', _call, cr, _call); //3
		r.use('/', skipListener, _call, cr, _call); //0
		r.get('/:foo', _call, cr, _call); //3
		r.param('foo', _call);
		r.param('foo', skipListener);
		r.param('foo', _call);

		calledTime = 0;
		r.all('/foo', options);
		assert(calledTime === 7);
	});
});

describe('setOptions', function() {
	it('should change options value', function() {
		var r = leads.Router();
		if(r.defaults.caseSensitive === false && r.defaults.mergeParams === false) {
			r.defaults = { caseSensitive: true, mergeParams: true };
			assert(r.defaults.caseSensitive && r.defaults.mergeParams);
		}else { assert(false); }
	});
});

describe('r.options.caseSensitive', function() {
	it('should call properly on caseSensitive = false', function() {
		var r = leads.Router();
		r.use('/foo', _call);
		r.use('/Foo', _call);
		r.all('/foo', _call);
		r.all('/Foo', _call);

		calledTime = 0;
		r.all('/foo', options);
		r.all('/Foo', options);
		assert(calledTime === 8);
	});

	it('should call properly on caseSensitive = true', function() {
		var r = leads.Router({ caseSensitive: true });
		r.use('/foo', _call);
		r.use('/Foo', _call);
		r.all('/foo', _call);
		r.all('/Foo', _call);

		calledTime = 0;
		r.all('/foo', options);
		r.all('/Foo', options);
		assert(calledTime === 4);
	});
});

describe('r.options.strict', function() {
	it('should call properly on strict = false', function() {
		var r = leads.Router();
		r.use('/foo', _call);
		r.use('/foo/', _call);
		r.all('/foo', _call);
		r.all('/foo/', _call);

		calledTime = 0;
		r.all('/foo', options);
		r.all('/foo/', options);
		assert(calledTime === 8);
	});

	it('should call properly on strict = true', function() {
		var r = leads.Router({ strict: true });
		r.use('/foo', _call);
		r.use('/foo/', _call);
		r.all('/foo', _call);
		r.all('/foo/', _call);

		calledTime = 0;
		r.all('/foo', options);
		r.all('/foo/', options);
		assert(calledTime === 5);
	});
});

describe('r.options.mergeParams', function() {
	it('should return params that were not merged on mergeParams = false', function() {
		var r = leads.Router();
		var cr = leads.Router();
		var params = null;
		cr.use('/:foo', function(req, res, next) {
			assert(req.params.bar !== params.bar);
			next();
		});
		r.use('/:foo/:bar', function(req, res, next) {
			params = req.params;
			next();
		}, cr);

		r.all('/foo/bar/baz', options);
	});

	it('should return params that were merged on mergeParams = true', function() {
		var r = leads.Router();
		var cr = leads.Router({ mergeParams: true });
		var params = null;
		cr.use('/:foo', function(req, res, next) {
			assert(req.params.foo === 'baz');
			assert(req.params.bar === params.bar);
			next();
		});
		r.use('/:foo/:bar', function(req, res, next) {
			params = req.params;
			next();
		}, cr);

		r.all('/foo/bar/baz', options);
	});
});

describe('req.baseUrl', function() {
	it('req.baseUrl === \'/foo\' should return true in r.use()', function() {
		var r = leads.Router();
		var cr = leads.Router();
		cr.use('/bar', function(req, res, next) {
			assert(req.baseUrl === '/foo');
			next();
		});
		r.use('/foo', cr);

		r.all('/foo/bar', options);
	});

	it('req.baseUrl === \'/foo/bar\' should return true in r.METHOD()', function() {
		var r = leads.Router();
		var cr = leads.Router();
		cr.get('/', function(req, res, next) {
			assert(req.baseUrl === '/foo/bar');
			next();
		});
		r.get('/foo/bar', cr);

		r.all('/foo/bar', options);
	});
});

describe('req.data', function() {
	it('req.data === 123', function() {
		var r = leads.Router();

		r.use(function(req) {
			assert(req.data === 123);
		});

		r.all('', { changePath: false, addHistory: false, data: 123 });
	});

	it('req.data === options.data', function() {
		var r = leads.Router();
		var data = {}

		r.use(function(req) {
			assert(req.data === data);
		});

		r.all('', { changePath: false, addHistory: false, data: data });
	});
});

describe('req.URL', function() {
	var urlString = '/foo/bar?a=1&b=2#hash';
	it('req.originalUrl === location.origin + \'/foo/bar?a=1&b=2#hash\'', function() {
		var r = leads.Router();
		r.use('/foo/bar', function(req) {
			assert(req.originalUrl === location.origin + urlString);
		});

		r.all(urlString, options);
	});

	it('req.secure === location.protocol === \'https:\'', function() {
		var r = leads.Router();
		r.use('/foo/bar', function(req) {
			assert(req.secure === (location.protocol === 'https:'));
		});

		r.all(urlString, options);
	});

	it('req.protocol === location.protocol', function() {
		var r = leads.Router();
		r.use('/foo/bar', function(req) {
			assert(req.protocol === location.protocol);
		});

		r.all(urlString, options);
	});

	it('req.hostname === location.hostname', function() {
		var r = leads.Router();
		r.use('/foo/bar', function(req) {
			assert(req.hostname === location.hostname);
		});

		r.all(urlString, options);
	});

	it('req.hash === \'#hash\'', function() {
		var r = leads.Router();
		r.use('/foo/bar', function(req) {
			assert(req.hash === '#hash');
		});

		r.all(urlString, options);
	});

	it('req.search === \'?a=1&b=2\'', function() {
		var r = leads.Router();
		r.use('/foo/bar', function(req) {
			assert(req.search === '?a=1&b=2');
		});

		r.all(urlString, options);
	});

	it('req.pathname === \'/foo/bar\'', function() {
		var r = leads.Router();
		r.use('/foo/bar', function(req) {
			assert(req.pathname === '/foo/bar');
		});

		r.all(urlString, options);
	});

	it('req.path === \'/foo/bar?a=1&b=2\'', function() {
		var r = leads.Router();
		r.use('/foo/bar', function(req) {
			assert(req.path === '/foo/bar?a=1&b=2');
		});

		r.all(urlString, options);
	});

	it('req.query is {a: \'1\', b: \'2\'}', function() {
		var r = leads.Router();
		r.use('/foo/bar', function(req) {
			assert(req.query.a === '1');
			assert(req.query.b === '2');
		});

		r.all(urlString, options);
	});
});