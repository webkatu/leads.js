# leads.js

leads.js is a client-side routing library that is very similar to express.js.

```javascript
var app = leads();

app.get('/', function(req, res, next) {
	res.send('Hello world');
});

app.dispatch('/', 'get'); // or app.get('/');
```

## Example

Define handlers.

```javascript
app = leads();

app.all('/', indexHandler);
app.all('/user/:id', load, show);
app.all('/user/:id/profile', getProfile);
```

Define handlers using various path.

```javascript
app.all('/foo/bar', handler);
app.all('/foo/:bar', handler);
app.all('/foo/:bar/:baz?', handler);
app.all('/ab(c)?d', handler);
app.all('/a(bc)+d', handler);
app.all('/abc/*', handler);
app.all(/\/foo\/bar/, handler);
app.all(['/abc/def', '/user/:id', /\/foo\/bar/], handler);
```

Define handlers using various METHOD.(See [app.METHOD()](#app_method1)).

```javascript
app.all('/', handler);
app.get('/', handler);
app.post('/', handler);
app.put('/', handler);
app.delete('/', handler);
```

Define middleware.(See [app.use()](#app_use))

```javascript
app.use('/', middleware, errorHandler);
app.use('/admin', authenticate, router);
app.use('/blog', blogApp);
```

Dispatch!!

```javascript
app.dispatch('/', 'all'); // or app.all('/');
app.dispatch('/user/123', 'get'); // or app.get('/user/123');
app.dispatch('/comments/post', 'post'); // or app.post('/comments/post');
```

## Installation

```
$ npm install leads # for browserify
$ git clone https://github.com/webkatu/leads.js
```

```html
<script src="leads.js"></script>
```


## API

* [leads](#leads1)
* [Application](#application)
* [next](#next)
* [Request](#request)
* [Response](#response)
* [Router](#router)

This API is referring the [4.x API of Express](http://expressjs.com/ja/4x/api.html).

### <a name="leads1">leads()</a>

This is a main function that creates an application.

```javascript
var app = leads();
```


#### <a name="leads2">leads([options])</a>

It creates an instance of [Application](#application).

```javascript
var app = leads({
	caseSensitive: false,
	mergeParams: false,
	strict: false,
});
```

The optional options parameter specifies the behavior of the router in app.


|Property|Type|Description|Default|
|---|---|---|---|
|caseSensitive|Boolean|Enable case sensitivity.|false, treating '/Foo' and '/foo' as the same.|
|mergeParams|Boolean|Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence.|false|
|strict|Boolean|Enable strict routing.|false, '/foo' and '/foo/' are treated the same by the router.|
|addHistory|Boolean|app.dispatch() option|true|
|changePath|Boolean|app.dispatch() option|true|
|transition|Boolean|app.dispatch() option|true|


#### <a name="leads_router">leads.Router([options])</a>

It creates an instance of `Router`.

The `options` is the same as options of `leads([options])`.


### <a name="application">Application</a>

This object is subclass of [Router](#router).


#### <a name="app_defaults">app.defaults</a>

This property is an object that has properties, `caseSensitive`, `mergeParams`, `strict`, `addHistory`, `changePath`, `transition`.

```javascript
var app = leads({caseSensitive: true});
console.log(app.defaults.caseSensitive); // true
app.defaults.caseSensitive = false;
console.log(app.defaults.caseSensitive); // false
```


#### <a name="app_all1">app.all(path, callback[, callback ...])</a>

It registers route handler(s).

It defines a route mapping path to the given callback(s). Each callback is given three arguments, `request`, `response`, `next`.

This method is one of the `app.METHOD()` methods.

```javascript
app.all('/', index);
app.all('*', all);
app.all('/user/:id', authenticate, show);
```

The leads.js is using internally '[path-to-regexp](https://github.com/pillarjs/path-to-regexp)' to match the path.


#### <a name="app_all2>app.all(path[, options])</a>

`app.all(path, options)` is same as `app.dispatch(path, 'all', options)`.


#### <a name="app_dispatch">app.dispatch(path[, method][, options])</a>

`app.dispatch()` invokes middleware and matching route handlers(callbacks).

And, it changes the url path by History API.

`app.dispatch(path)` is same as `app.dispatch(path, 'all')` and `app.all(path)`.

The second param is specified HTTP method. However, leads.js doesn't do actually HTTP request beacuse leads.js is client-side router.
This is one of the mere conditions when matching routes.

```javascript
app.all('/greet', function(req, res, next) {
	console.log('Hello');
	next();
});

app.get('/greet', function(req, res, next) {
	console.log('Hi');
});

app.dispatch('/greet'); // same as app.all('/greet')
/* console
Hello
Hi
*/
app.dispatch('/greet', 'get'); // same as app.get('/greet')
/* console
Hi
*/
```

The third param is dispatch options.


|Property|Type|Description|Default|
|---|---|---|---|
|addHistory|Boolean|If false, the history doesn't add.|true|
|changePath|Boolean|If false, the url path doesn't change.|true|
|data|multiple|This property is given directly to req.data|undefined|
|transition|boolean|It transition page if you specify other origin url to path. If false, it doesn't transition.|true|

About `addHistory` and `changePath`.

```javascript
app.get('/greet', function(req, res, next) {
	console.log('Hi');
});

app.dispatch('/greet', 'get', {
	addHistory: false,
	changePath: false,
}); // URL and History don't change
```

About `data`.

```javascript
app.post('/signup', function(req, res, next) {
	console.log(req.data);
});

app.dispatch('/signup', 'post', {
	data: new FormData();
});
/* console
FormData {}
*/
```

About `transition`.

```javascript
app.dispatch('http://www.google.com', null, {
	transition: false 
}); // not occur anything.

app.dispatch('http://www.google.com'); // transition to the google.
```


#### <a name="app_method1">app.METHOD(path, callback[, callback ...])</a>

This register route handler(s).

As with `app.all()`, it defines a route mapping path to the given callback(s).

Specify HTTP method name in the METHOD.

```javascript
app.get('/image', load, show);
app.post('/user/:id', authenticate);
app.put('/edit', send, show);
```

The HTTP method name is given to `req.method`.

Supported methods

* get
* post
* head
* put
* delete
* options


#### <a name="app_method2>app.METHOD(path[, options])</a>

This is same as `app.dispatch(path, METHOD, options)`.


#### <a name="app_param">app.param(name, callback)</a>

This registers a route parameter handler.

When it matches the route of path that contains the parameters, callback defined by `app.param()` is called first.

The callback is given four arguments, `request`, `response`, `next` and `paramValue`.

```javascript
app.get('/user/:id', function(req, res, next) {
	console.log('Hi user');
});

app.param('id', function(req, res, next, value) {
	console.log('ID is ' + value);
	next();
});

app.dispatch('/user/123');
/* console
ID is 123
Hi user
*/

```

Same param callback is not called in succession.

```javascript
app.param('id', function(req, res, next, value) {
	console.log('ID is ' + value);
	next();
});

app.get('/user/:id', function(req, res, next) {
	console.log('This matches');
	next();
});

app.get('/user/:id', function(req, res, next) {
	console.log('This matches too');
});

app.dispatch('/user/456');
/* console
ID is 456
This matches
This matches too
*/

```

It is also possible to give an array to `name` such as `app.param(['class', 'id'], callback)`

leads.js is using `path-to-regexp`. Please refer to [path-to-regexp](https://github.com/pillarjs/path-to-regexp) about path that contains the parameters.


#### <a name="app_route">app.route(path)</a>

`app.route()` returns a route object mapping the path.

The route object has method of app.METHOD(), and it defines callback by method chain.

Use app.route() to avoid duplicate route names.

```javascript
app.route('/blog/article')
	.all(function(req, res, next) {
		console.log('Hi');
		next();
	})
	.get(function(req, res) {
		console.log('Get article');
	})
	.post(function(req, res) {
		console.log('Post article');
	})
	.delete(function(req, res) {
		console.log('Delete article');
	});
```


#### <a name="app_use">app.use([path, ]function[, function ...])</a>

It mounts the middleware function(s).
Each middleware function is given three arguments, `request`, `response`, `next`.

If the first param is path, middleware is called when it matches path prefix.

For example, `app.use('/blog',middleware)` will match `/blog`, `/blog/articles`, `/apple/articles/123`, and so on.

If path is not specified, it defaults to '/'.

```javascript
app.use(function(req, res, next) { // same as app.use('/', ...)
	console.log('This is called every time');
});
```

`app.use()` is also possible to mount router and sub-app as well as function.

```javascript
var router = leads.Router();

router.get('/', function(req, res, next) {
	console.log('Hi');
});

router.get('/Hello', function(req, res, next) {
	console.log('Hello');
});

app.use('/greet', router);
```

```javascript
var subApp = leads();
app.use('/blog', subApp);
```

In addition, `app.use()` can mount error handler. The error handler function is given four arguments, `error`, `request`, `response`, `next`.
The error handler will be called when given a value other than undefined to `next()`.

```javascript
app.use(function(err, req, res, next) {
	console.log(err);
});

app.get('/', function(req, res, next) {
	next('Error Occurred');
});

app.get('/', function(req, res, next) {
	console.log("I won't be called.");
});

app.dispatch('/');
/* console
Error Occurred
*/
```

You can specify various types of path, a path string, a path pattern, a named parameter, a regular expression, an array of combinations thereof.


From [Express4.x](http://expressjs.com/ja/4x/api.html#app.use) table
<table>
	<thead>
		<tr><th>Type</th><th>Example</th></tr>
	</thead>
	<tbody>
		<tr>
			<td>Path</td>
			<td>
				This will match paths starting with <code>/abcd</code>.
				<pre lang="javascript">
app.use('/abcd', function (req, res, next) {
	next();
});
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>Path Pattern</td>
			<td>
				This will match paths starting with <code>/abcd</code> and <code>/abd</code>.
				<pre lang="javascript">
app.use('/ab(c)?d', function (req, res, next) {
	next();
});
				</pre>
				This will match paths starting with <code>/abcd</code>, <code>/abbcd</code>, <code>/abbbbbcd</code>, and so on.
				<pre lang="javascript">
app.use('/a(b)+cd', function (req, res, next) {
	next();
});
				</pre>
				This will match paths starting with <code>/abcd</code>, <code>/abxcd</code>, <code>/abFOOcd</code>, <code>/abbArcd</code>, and so on.
				<pre lang="javascript">
app.use('/ab(.*)cd', function (req, res, next) {
	next();
});
				</pre>
				This will match paths starting with <code>/ad</code> and <code>/abcd</code>.
				<pre lang="javascript">
app.use('/a(bc)?d', function (req, res, next) {
	next();
});
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>Named Parameter</td>
			<td>
				This will match paths starting with <code>/abc/xyz</code>, <code>/1234/5678</code>, <code>everything/everything</code>.
				<pre lang="javascript">
app.use('/:foo/:bar', function(req, res, next) {
	next();
});
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>Regular Expression</td>
			<td>
				This will match paths starting with <code>/abc</code> and <code>/xyz</code>.
				<pre lang="javascript">
app.use(/\/abc|\/xyz/, function (req, res, next) {
	next();
});				
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>Array</td>
			<td>
				This will match paths starting with <code>/abcd</code>, <code>/xyza</code>, <code>/lmn</code>, and <code>/pqr</code>.
				<pre lang="javascript">
app.use(['/abcd', '/xyza', /\/lmn|\/pqr/], function (req, res, next) {
  next();
});			
				</pre>
			</td>
		</tr>
	</tbody>
</table>
Refer to [path-to-regexp](https://github.com/pillarjs/path-to-regexp).

`app.use()` can mount plural middleware. However, it does not support to give array parameter like express `app.use()`.

```javascript
var subApp = leads();
var r1 = leads.Router();
var r2 = leads.Router();
var f = function(req, res, next) { next(); }

app.use(subApp, r1, r2, f); // possible;

app.use(subApp, [r1, r2], f) // impossible;
```


### <a name="next">next()</a>

This is a function given to a route handler and a middleware function for calling the next route handler.

The error handler will be called if you give a value other than undefined to `next()`.

However, if specifying `next('route')`, it will skip to next route.

```javascript
app.get('/', function(req, res, next) {
	next('route');
}, function(req, res, next) {
	console.log(1);
	next();
}, function(req, res, next) {
	console.log(2);
	next();
});

app.get('/', function(req, res, next) {
	console.log(3);
});

app.dispatch('/');
/* console
3
*/
```

When calling the `next('route')` in parameter handler, it will skip only subsequent parameter handlers.

```javascript
app.param('id', function(req, res, next, value) {
	next('route');
});
app.param('id', function(req, res, next, value) {
	console.log(1);
	next();
});
app.param('id', function(req, res, next, value) {
	console.log(2);
	next();
});

app.get('/:id', function(req, res, next) {
	console.log(3);
});

app.dispatch('/123');
/* console
3
*/
```


### <a name="request">Request</a>

This instance is given to a route handler and a middleware function.

When dispatching, it is created and contain context.

#### <a name="req_app">req.app</a>

`req.app` can access an app object or a router object from the inside of middleware that has been mounted by them.

```javascript
var subApp = leads();
subApp.get('/', function(req, res, next) {
	console.log(req.app === subApp); // true
});

var r = leads.Router();
r.get('/', function(req, res, next) {
	console.log(req.app === r); // true
});

app.use(subApp, r);
```


#### <a name="req_baseurl">req.baseUrl</a>

`req.baseUrl` is path of middleware that mounted by `app.use()`.

```javascript
var r = leads.Router();

r.use('/123', function(req, res, next) {
	console.log(req.baseUrl); // /user/123
});

r.get('/123', function(req, res, next) {
	console.log(req.baseUrl); // /user
});

app.use('/user', r);

app.dispatch('/user/123');
/* console
/user/123
/user
*/
```

In other words, the `req.baseUrl` returns matched string.

```javascript
app.use([/\/\d+/, '/a(bc)+d'], function(req, res, next) {
	console.log(req.baseUrl);	
});

app.dispatch('/1111/2222'); // 1111;
app.dispatch('/1234/5678/9'); // 1234;
app.dispatch('/abcbcd/ef'); // abcdcd;
```


#### <a name="req_cookies">req.cookies</a>

It returns cookie object.

```javascript
// cookie => name=Bob
req.cookies.name // => Bob;
```

It is dynamic and read-only.

```javascript
res.cookie('name', 'Bob');
req.cookies.name; => Bob

res.cookie('name', 'John');
req.cookies.name; => John
```


#### <a name="req_data">req.data</a>

When dispatched, `req.data` is given data by the dispatch options.

```javascript
app.all('/', function(req, res, next) {
	console.log(req.data);
});

app.dispatch('/', null, { data: 'foo' });
/* console
foo
*/
```


#### <a name="req_dispatcher">req.dispatcher</a>

`req.dispatcher` is app object or router object that executed the dispatch method.

```javascript
var r = leads.Router();
r.all('/', function(req, res, next) {
	console.log(req.dispatcher === app); // true;
});

app.use(r);

app.dispatch('/');
```


#### <a name="req_hash">req.hash</a>

```javascript
// app.dispatch('http://example.com/foo?page=12#bar');
req.hash // => #bar
```


#### <a name="req_host">req.host</a>

```javascript
// app.dispatch('http://example.com/foo?page=12#bar');
req.host // => example.com
```


#### <a name="req_hostname">req.hostname</a>

```javascript
// app.dispatch('http://example.com/foo?page=12#bar');
req.hostname // => example.com
```


#### <a name="req_href">req.href</a>

```javascript
// When origin is 'http://example.com'
// app.dispatch('/foo?page=12#bar');
req.href // => http://example.com/foo?page=12#bar
```


#### <a name="req_method">req.method</a>

`req.method` is http method name specified in `app.dispatch()`;

```javascript
// app.dispatch('/');
req.method // => all

// app.dispatch('/', 'get');
req.method // => get

// app.post('/');
req.method // => post
```


#### <a name="req_origin">req.origin</a>

```javascript
// app.dispatch('http://example.com/foo?page=12#bar');
req.origin // => http://example.com
```


#### <a name="req_originalurl">req.originalUrl</a>

`req.originalUrl` is path specified in app.dispatch();

```javascript
// app.dispatch('/foo/bar');
req.originalUrl // => /foo/bar

//app.dispatch('http://example.com/foo?page=12#bar');
req.originalUrl // => http://example.com/foo?page=12#bar
```

#### <a name="req_params">req.params</a>

This property is an object containing properties mapped to the named route parameters.

```javascript
app.use('/:foo/:bar', function(req, res, next) {
	console.log(req.params);
});

app.dispatch('/blog/articles');
/* console
{ foo: 'blog', bar: 'articles' }
*/
```

When you use an unnamed parameters such as a path pattern or a regular expression using brackets, it will be numerically indexed.

```javascript
app.use('/fo(o)+/b(ar)?/(.*)', function(req, res, next) {
	console.log(req.params);
	next();
});

app.use(/\/(foo)\/(bar)/, function(req, res, next) {
	console.log(req.params);
});

app.dispatch('/foo/bar/baz/123');
/* console
{ 0: "o", 1: "ar", 2: "baz/123" }
{ 0: "foo", 1: "bar" }
*/
```

Refer to [path-to-regexp](https://github.com/pillarjs/path-to-regexp).


#### <a name="req_path">req.path</a>

```javascript
// app.dispatch('http://example.com/foo?page=12#bar');
req.path // => /foo?page=12
```


#### <a name="req_pathname">req.pathname</a>

```javascript
// app.dispatch('http://example.com/foo?page=12#bar');
req.pathname // => /foo
```

#### <a name="req_port">req.port</a>

It returns `''` if port is number 80.


#### <a name="req_protocol">req.protocol</a>

```javascript
// app.dispatch('http://example.com/foo?page=12#bar');
req.protocol // => http:
```


#### <a name="req_query">req.query</a>

This property is query object of [querystring](https://nodejs.org/api/querystring.html).parse();

```javascript
// app.dispatch('http://example.com/foo?page=12#bar');
req.query.page // 12
```


#### <a name="req_search">req.search</a>

```javascript
// app.dispatch('http://example.com/foo?page=12#bar');
req.search // => ?page=12:
```


#### <a name="req_secure">req.secure</a>

If protocol is https:, `req.secure` returns true.


### <a name="response">Response</a>

This instance is given to a route handler and a middleware function.

This object has various and useful methods. However, they might be not necessarily required. If you want using minimum function, use [leads-router](https://github.com/webkatu/leads-router).


#### <a name="res_defaults">res.defaults</a>

This property is an object to set the default options.

|Property|Type|Description|Default|
|---|---|---|---|
|baseElement|Element|An element to show HTML and text, and so on. |document.body|
|filename|String|The default filename when downloading the file.|'file'|
|url|Boolean|To distinguish url and string when sending file. [res.download()](#res_downlaod) and [res.sendFile()](#res_sendfile) option.|true|
|transition|Boolean|[res.sendFile()](#res_send_file) option.|false|
|cookieExpires|String|[res.cookie()](#res_cookie) option.|''|
|cookiePath|String|[res.cookie()](#res_cookie) and [res.clearCookie()](#res_clearcookie) option.|'/'|
|cookieDomain|String|[res.cookie()](#res_cookie) and [res.clearCookie()](#res_clearcookie) option|''|
|cookieSecure|Boolean|[res.cookie()](#res_cookie) and [res.clearCookie()](#res_clearcookie) option.|false|

Example of setting way.

```javascript
app.use(function(req, res, next) {
	res.defaults = {
		filename: 'filename.txt',
		transition: true,
		cookieExpires: 7,
		cookiePath: ''
	};
});
```


#### <a name="res_cookie">res.cookie(name, value[, options])</a>

`res.cookie()` create a cookie.

```javascript
res.cookie('name', 'value', { expires: 7, path: '' });
```

This method is internally using [js-cookie](https://github.com/js-cookie/js-cookie). `res.cookie(name, value, options)` is the same as `Cookies.set(name, value, options)` of [js-cookie](https://github.com/js-cookie/js-cookie). Please refer to it.

The following are properties of `options`.

* expires
* path
* domain
* secure


#### <a name="res_clearcookie">res.clearCookie(name[, options])</a>

`res.clearCookie()` delete a cookie.

This method is the same as `Cookies.remove(name, options)` of [js-cookie](https://github.com/js-cookie/js-cookie).

The following are properties of `options`.

* path
* domain
* secure

> "IMPORTANT! when deleting a cookie, you must pass the exact same path, domain and secure attributes that were used to set the cookie, unless you're relying on the default attributes."


#### <a name="res_download">res.download(file[, options])</a>

This method downloads a file.

```javascript
res.download('/img/cat.png')
```

In addition to the path, it can specify various types to the file. See the following table.

<table>
	<thead>
		<tr><th>Type</th><th>Description</th><th>Example</th></tr>
	</thead>
	<tbody>
		<tr>
			<td>ArrayBuffer</td>
			<td>It downloads the binary file. Default mimetype is <code>'application/octet-stream'</code>.</td>
			<td>
				<pre lang="javascript">
res.download(new ArrayBuffer())
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>Blob</td>
			<td>It downloads the blob.</td>
			<td>
				<pre lang="javascript">
res.download(new Blob(['foo'], { type: 'text/plain'}))
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>Object</td>
			<td>It downloads as the JSON. Default mimetype is <code>'application/json'</code>.</td>
			<td>
				<pre lang="javascript">
res.download({ foo: 'bar' })
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>URL</td>
			<td>It downloads the file of url. It should be the same origin. If you want to specify cross origin, the server-side must enable CORS.</td>
			<td>
				<pre lang="javascript">
res.download('/img/cat.png')	
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>String</td>
			<td>It downloads the text. Default mimetype is 'text/plain'. You should set to <code>options.url = false</code> to distinguish between the URL and text.</td>
			<td>
				<pre lang="javascript">
res.download('foobar', { url: false })	
				</pre>
			</td>
		</tr>
	</tbody>
</table>

The following table is about `res.download()` options.

<table>
	<thead>
		<tr><th>Property</th><th>Type</th><th>Description</th><th>Default</th><th>Example</th></tr>
	</thead>
	<tbody>
		<tr>
			<td>error</td>
			<td>Function</td>
			<td>When it failed downloading, this function is called with argments that is error object.</td>
			<td></td>
			<td>
				<pre lang="javascript">
res.dowload('http://example.com', {
	error: function(e) {
		console.log(e);
	}
})
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>filename</td>
			<td>String</td>
			<td>File name.</td>
			<td>'file'</td>
			<td>
				<pre lang="javascript">
res.download({ foo: 'bar' }, {
	filename: 'foobar.json'
})
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>type</td>
			<td>String</td>
			<td>File mimetype.</td>
			<td></td>
			<td>
				<pre lang="javascript">
res.download(new ArrayBuffer(), {
	filename: 'img.png',
	type: 'image/png'
})
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>url</td>
			<td>Boolean</td>
			<td>Distinguish between the URL and text.</td>
			<td>true</td>
			<td>
				<pre lang="javascript">
res.download('/image/cat.png', { url: true })
res.download('foobar', { url: false })
				</pre>
			</td>
		</tr>
	</tbody>
</table>


#### <a name="res_send">res.send(data[, options])</a>

It shows the data on document.

```javascript
res.send('send text');
res.send('<p>send HTML</p>');
res.send(Element);
res.send(document);
res.send({ foo: 'bar' });
res.send(new ArrayBuffer());
res.send(blob);
```

The following table is about the data.

<table>
	<thead>
		<tr><th>Type</th><th>Description</th><th>Example</th></tr>
	</thead>
	<tbody>
		<tr>
			<td>Document</td>
			<td>document childnodes are replaced to the new document childnodes.</td>
			<td>
				<pre lang="javascript">
var xhr = new XMLHttpRequest();
xhr.open('GET', '/');
xhr.responseType = 'document';
xhr.onload = function() {
	res.send(xhr.response);
};
xhr.send();
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>Element</td>
			<td>Base element appends the element.</td>
			<td>
				<pre lang="javascript">
var p = document.createElement('p');
p.innerHTML = 'foo&lt;span&gt;bar&lt;/span&gt;';
res.send(p);
/*
&lt;body&gt;
	&lt;p&gt;foo&lt;span&gt;bar&lt;/span&gt;&lt;/p&gt;
&lt;/body&gt;
*/
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>String</td>
			<td>It gives to base element innerHTML.</td>
			<td>
				<pre lang="javascript">
res.send('foobar');
// &lt;body&gt;foobar&lt;/body&gt;
res.send('&lt;p&gt;foobar&lt;/p&gt;');
// &lt;body&gt;&lt;p&gt;foobar&lt;/p&gt;
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>ArrayBuffer</td>
			<td>Refer to <a href="#res_sendfile">res.sendFile()</a></td>
			<td>
				<pre lang="javascript">
res.send(new ArrayBuffer());
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>Blob</td>
			<td>Refer to <a href="#res_sendfile">res.sendFile()</a></td>
			<td>
				<pre lang="javascript">
res.send(new Blob(['foobar'], { type: 'text/plain' }));
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>Object</td>
			<td>Refer to <a href="#res_sendfile">res.sendFile()</a></td>
			<td>
				<pre lang="javascript">
res.send({ foo: 'bar' });
				</pre>
			</td>
		</tr>
	</tbody>
</table>

The following table is about `res.send()` options.

<table>
	<thead>
		<tr><th>Property</th><th>Type</th><th>Description</th><th>Default</th><th>Example</th></tr>
	</thead>
	<tbody>
		<tr>
			<td>baseElement</td>
			<td>Element</td>
			<td>An element to show data of HTML and text and so on.</td>
			<td>document.body</td>
			<td>
				<pre lang="html">
&lt;body&gt;
	&lt;div id="main"&gt;&lt;/div&gt;
&lt;/body&gt;
				</pre>
				<pre lang="javascript">
var main = document.getElementById('main');
res.send('Hello', { baseElement: main });
/*
&lt;body&gt;
	&lt;div id="main"&gt;Hello&lt;/div&gt;
&lt;/body&gt;
*/
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>filename</td>
			<td>String</td>
			<td>For IE. Refer to <a href="#res_sendfile">res.sendFile()</a>.</td>
			<td>'file'</td>
			<td>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>title</td>
			<td>String</td>
			<td>Document title. If not specify, not change title.</td>
			<td></td>
			<td>
				<pre lang="javascript">
res.send('Hello', { title: 'Hello' });
				</pre>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>transition.</td>
			<td>Boolean</td>
			<td>Page transition. Refer to <a href="#res_sendfile">res.sendFile()</a>.</td>
			<td>false</td>
			<td>
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td>type</td>
			<td>String</td>
			<td>mimetype. Refer to <a href="#res_sendfile">res.sendFile()</a>.</td>
			<td></td>
			<td>
			</td>
		</tr>
	</tbody>
</table>


#### <a name="res_sendfile">res.sendFile(file[, options])</a>

(Experimental method)

It shows the file using `&lt;object&gt;&lt;/object&gt;`.

```javascript
res.sendFile('/image/cat.png');
/*
&lt;body&gt;
	&lt;object data="/image/cat.png"&gt;&lt;/object&gt;
&lt;/body&gt;
*/
```

It can specify the following types to the file like [res.download()](#res_download).

* ArrayBuffer
* Blob
* Object
* URL
* String

_If the file isn't URL, `res.sendFile()` creates blob URL from the file. However IE doesn't create blob URL. Therefore IE directly downloads blob._

The following table is about `res.sendFile()` options.

<table>
	<thead>
		<tr><th>Property</th><th>Type</th><th>Description</th><th>Default</th></tr>
	</thead>
	<tbody>
		<tr>
			<td>baseElement</td>
			<td>Element</td>
			<td>An element to append<code>&lt;object&gt;&lt;/object&gt;</code>.</td>
			<td>document.body</td>
		</tr>
		<tr></tr>
		<tr>
			<td>filename</td>
			<td>String</td>
			<td>Filename for IE when downloading blob.</a>.</td>
			<td>'file'</td>
		</tr>
		<tr></tr>
		<tr>
			<td>title</td>
			<td>String</td>
			<td>Document title. If not specify, not change title.</td>
			<td></td>
		</tr>
		<tr></tr>
		<tr>
			<td>transition.</td>
			<td>Boolean</td>
			<td>If true, page transitions to directly show the file.</td>
			<td>false</td>
		</tr>
		<tr></tr>
		<tr>
			<td>type</td>
			<td>String</td>
			<td>Mimetype. It is given to <code>&lt;object type=""&gt;</code></a>.</td>
			<td></td>
		</tr>
		<tr></tr>
		<tr>
			<td>url</td>
			<td>Boolean</td>
			<td>Distinguish between the URL and text.</td>
			<td>true</td>
		</tr>
	</tbody>
</table>


#### <a name="res_sendstatus">res.sendStatus(status[, options])</a>

It sends HTTP status and the status message.

```javascript
res.sendStatus(403) // &lt;body&gt;403 Forbidden&lt;/body&gt;
res.sendStatus(404) // &lt;body&gt;404 Not Found&lt;/body&gt;
res.sendStatus(500) // &lt;body&gt;500 Internal Server Error&lt;/body&gt;
```

Please refer to [httpStatusTable](https://github.com/webkatu/leads.js/blob/master/src/httpStatusTable.js) about status message.

If you specify non-existent status, it returns the status number.

```javascript
res.sendStatus(1234) // &lt;body&gt;1234&lt;/body&gt;
```

You can specify any message.

```javascript
res.sendStatus(404, { message: 'ERROR 404' })  // &lt;body&gt;ERROR 404&lt;/body&gt;
```

The following table is about `res.sendStatus()` options.

<table>
	<thead>
		<tr><th>Property</th><th>Type</th><th>Description</th><th>Default</th></tr>
	</thead>
	<tbody>
		<tr>
			<td>baseElement</td>
			<td>Element</td>
			<td>An element to show status message.</code>.</td>
			<td>document.body</td>
		</tr>
		<tr></tr>
		<tr>
			<td>title</td>
			<td>String</td>
			<td>Document title. If not specify, it change to status message. If you specify <code>options.message</code>, the title will be the its message.</td>
			<td>The same as the status message.</td>
		</tr>
		<tr></tr>
		<tr>
			<td>message.</td>
			<td>String</td>
			<td>You can specify any message to show.</td>
			<td></td>
		</tr>
	</tbody>
</table>


#### <a name="res_redirect">res.redirect(path)</a>

It redirects to path.

```javascript
res.redirect('./');
res.redirect('../');
res.redirect('http://www.google.com');
```

If you specify `res.redirect('back')`, history back.


### <a name="router">Router</a>

Router is a core object of leads.js.

```javascript
var router = leads.Router();
router.get('/', function(req, res, next) {
	/* code */
});

app.use('/user', router);
```

It is inherited to [Application](#application).

#### <a name="router_defaults">router.defaults</a>

See [app.defaults](#app_defaults).

#### <a name="router_all1">router.all(path, callback[, callback ...])</a>

See [app.all()](#app_all1).

#### <a name="router_all2">router.all(path[, options])</a>

See [app.all()](#app_all2).

#### <a name="router_dispatch">router.dispatch(path[, method][, options])</a>

See [app.dispatch()](#app_dispatch).

#### <a name="router_method1">router.METHOD(path, callback[, callback ...])</a>

See [app.METHOD()](#app_method1).

#### <a name="router_method2">router.METHOD(path[, options])</a>

See [app.METHOD()](#app_method2).

#### <a name="router_param">router.param(name, callback)</a>

See [app.param()](#app_param).

#### <a name="router_route">router.route(path)</a>

See [app.route()](#app_route).

#### <a name="router_use">router.use([path, ]function[, function ...])</a>

See [app.use()](#app_use).


## Support

Tested on IE11, Chrome, Firefox.

If you want to support IE10+, use [leads-router](https://github.com/webkatu/leads-router).


## Author

Twitter [@vinyufi](https://twitter.com/vinyufi)
Blog [webkatu.com](http://www.webkatu.com)


## License

[MIT](https://github.com/webkatu/leads.js/blob/master/LICENSE)