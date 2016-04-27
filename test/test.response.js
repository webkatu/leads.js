var testApp = leads();
var app = leads();
var res = null;
var url = 'http://webkatu.com/img/1.jpg';
var html = document.documentElement.innerHTML;

var testData = {
	string: 'This is the string',
	object: { This: 'is', the: ['json'] },
	arraybuffer: new Uint8Array(5).buffer,
	blob: new Blob(['This is the blob'], { type: 'text/plain' }),
};

testApp.use('/test', app);

app.use('/', function(req, response, next) {
	res = response;
	next();
});

app.get('/response.html', function(req, res, next) {
	res.send(html, { baseElement: document.documentElement });
	document.documentElement.lang = 'en';

	res.defaults = {
		baseElement: document.body,
		filename: 'file',
		url: true,
		transition: false,
	};
});

app.use('/download', function(req, res, next) {
	res.download('', { type: 'text/html', filename: 'response.html' });
	res.download({a:1, b:2}, { filename: 'test.json' });
	res.download(new ArrayBuffer(), { filename: 'arraybuffer' });
	res.download(new Blob(['123'], {type: 'text/plain'}), { filename: 'blob.txt' });
	res.download('abc', { url: false, filename: 'text.txt' })
	res.download('http://www.google.com');
	res.download('/');

	//第二引数チェック;
	res.download('./', {
		type: 'aaa',
		filename: 'bbb',
		url: false,
	});

	//error引数チェック;
	res.download('http://www.google.com', {
		type: 'text/html',
		filename: 'a',
		url: true,
		error: function(e) {
			console.log(e);
		}
	});
});

var sendR = leads.Router();

sendR.use('/document', function(req, res, next) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/test/index.html');
	xhr.responseType = 'document';
	xhr.onloadend = function() {
		console.log(xhr.response);
		res.send(xhr.response);

	}
	xhr.send();

	res.send(testData.string);
	res.send(document.createElement('html'), { baseElement: document.documentElement });
});

sendR.use('/element', function(req, res, next) {
	var div = document.createElement('div');
	div.innerHTML = '<p>test<span>text</span></p>'
	res.send(div);
});

sendR.use('/string', function(req, res, next) {
	res.send(testData.string);
});

sendR.use('/json', function(req, res, next) {
	res.send(testData.object);
});

sendR.use('/blob', function(req, res, next) {
	res.send(testData.blob);
});

sendR.use('/arraybuffer', function(req, res, next) {
	res.send(testData.arraybuffer);
});

var sendDefaultsR = leads.Router();

sendDefaultsR.use('/0', function(req, res, next) {
	var div = document.createElement('div');
	document.body.appendChild(div);
	res.send('<p>foo</p><p>bar</p>', {
		baseElement: div,
		title: 'test send',
	});
});

sendDefaultsR.use('/1', function(req, res, next) {
	var div = document.createElement('div');
	document.body.appendChild(div);
	res.defaults.baseElement = div;
	res.send('<p>foo</p><p><bar</p>');
});

sendDefaultsR.use('/2', function(req, res, next) {
	res.send(testData.object, {
		title: 'test send',
		filename: 'object',
		transition: false,
	});
});

sendDefaultsR.use('/3', function(req, res, next) {
	res.send(testData.blob, {
		filename: 'blob.txt',
		title: 'aaa',
		type: 'text/plain',
		transition: true,
	});
});

sendDefaultsR.use('/4', function(req, res, next) {
	res.defaults = {
		type: 'text/plain',
		filename: 'foobar.txt',
		transition: true,
	};

	res.send(testData.arraybuffer);
});

sendR.use('/defaults', sendDefaultsR);

app.use('/send', sendR);

var sendFileR = leads.Router();

sendFileR.use('/blob', function(req, res, next) {
	res.sendFile(testData.blob);
});

sendFileR.use('/arraybuffer', function(req, res, next) {
	res.sendFile(testData.arraybuffer, { type: 'text/plain' });
});

sendFileR.use('/json', function(req, res, next) {
	res.sendFile(testData.object);
});

sendFileR.use('/string', function(req, res, next) {
	res.sendFile(testData.string, { url: false });
});

sendFileR.use('/localURL', function(req, res, next) {
	res.sendFile('/test/index.html');
});

sendFileR.use('/imageURL', function(req, res, next) {
	res.sendFile(url);
});

sendFileR.use('/url', function(req, res, next) {
	res.sendFile('https://google.com');
});

var sendFileDefaultsR = leads.Router();

sendFileDefaultsR.use('/0', function(req, res, next) {
	var div = document.createElement('div');
	document.body.appendChild(div);
	res.sendFile(testData.blob, {
		baseElement: div,
		title: 'test sendFile',
		filename: 'blob.html',
		type: 'text/html',
		url: false,
		transition: false,
	});
});

sendFileDefaultsR.use('/1', function(req, res, next) {
	var div = document.createElement('div');
	document.body.appendChild(div);
	res.defaults = {
		baseElement: div,
		filename: 'blob.html',
		url: false,
		transition: false,
	}
	res.sendFile(testData.blob);
});

sendFileDefaultsR.use('/2', function(req, res, next) {
	res.sendFile(url, {
		title: 'test sendFile',
		type: 'text/html',
		url: true,
		transition: false,
	});
});

sendFileDefaultsR.use('/3', function(req, res, next) {
	res.sendFile('https://www.google.com', {
		type: 'text/plain',
		url: false,
		transition: true,
	});
});

sendFileDefaultsR.use('/4', function(req, res, next) {
		res.sendFile('https://www.google.com', {
		type: 'text/plain',
		url: true,
		transition: true,
	});
});

sendFileR.use('/defaults', sendFileDefaultsR);

app.use('/sendFile', sendFileR);

var sendStatusR = leads.Router();

sendStatusR.use('/200', function(req, res, next) {
	res.sendStatus(200);
});

sendStatusR.use('/404', function(req, res, next) {
	res.sendStatus(404);
});

sendStatusR.use('/500', function(req, res, next) {
	res.sendStatus(500);
});

sendStatusR.use('/9999', function(req, res, next) {
	res.sendStatus(9999);
});

sendStatusR.use('/abc', function(req, res, next) {
	res.sendStatus('abc');
});

var sendStatusDefaultsR = leads.Router();

sendStatusDefaultsR.use('/0', function(req, res, next) {
	document.body.textContent = 'test sendStatus';
	var div = document.createElement('div');
	document.body.appendChild(div);
	res.sendStatus(403, {
		baseElement: div,
	});
});

sendStatusDefaultsR.use('/1', function(req, res, next) {
	document.body.textContent = 'test sendStatus';
	var div = document.createElement('div');
	document.body.appendChild(div);
	res.defaults.baseElement = div;
	res.sendStatus(403);
});

sendStatusDefaultsR.use('/2', function(req, res, next) {
	res.sendStatus(403, {
		title: 'test sendStatusTitle',
		message: 'test sendStatusMessage',
	});
});

sendStatusR.use('/defaults', sendStatusDefaultsR);

app.use('/sendStatus', sendStatusR);

/*
dispatch;

testApp.all('/test/response.html');
testApp.all('/test/download');

testApp.all('/test/send/document');
testApp.all('/test/send/element');
testApp.all('/test/send/string');
testApp.all('/test/send/blob');
testApp.all('/test/send/json');
testApp.all('/test/send/arraybuffer');
testApp.all('/test/send/defaults/0');
testApp.all('/test/send/defaults/1');
testApp.all('/test/send/defaults/2');
testApp.all('/test/send/defaults/3');
testApp.all('/test/send/defaults/4');

testApp.all('/test/sendFile/blob');
testApp.all('/test/sendFile/json');
testApp.all('/test/sendFile/arraybuffer');
testApp.all('/test/sendFile/string');
testApp.all('/test/sendFile/localURL');
testApp.all('/test/sendFile/imageURL');
testApp.all('/test/sendFile/url');
testApp.all('/test/sendFile/defaults/0');
testApp.all('/test/sendFile/defaults/1');
testApp.all('/test/sendFile/defaults/2');
testApp.all('/test/sendFile/defaults/3');
testApp.all('/test/sendFile/defaults/4');

testApp.all('/test/sendStatus/200');
testApp.all('/test/sendStatus/404');
testApp.all('/test/sendStatus/500');
testApp.all('/test/sendStatus/9999');
testApp.all('/test/sendStatus/abc');
testApp.all('/test/sendStatus/defaults/0');
testApp.all('/test/sendStatus/defaults/1');
testApp.all('/test/sendStatus/defaults/2');
*/

function test() {
	var pathes = [
		'/test/response.html',
		
		'/test/download',
		'/test/send/document',
		'/test/send/element',
		'/test/send/string',
		'/test/send/blob',
		'/test/send/json',
		'/test/send/arraybuffer',
		'/test/send/defaults/0',
		'/test/send/defaults/1',
		'/test/send/defaults/2',
		//'/test/send/defaults/3',
		//'/test/send/defaults/4',

		'/test/sendFile/blob',
		'/test/sendFile/json',
		'/test/sendFile/arraybuffer',
		'/test/sendFile/string',
		'/test/sendFile/localURL',
		'/test/sendFile/imageURL',
		'/test/sendFile/url',
		'/test/sendFile/defaults/0',
		'/test/sendFile/defaults/1',
		'/test/sendFile/defaults/2',
		//'/test/sendFile/defaults/3',
		//'/test/sendFile/defaults/4',

		'/test/sendStatus/200',
		'/test/sendStatus/404',
		'/test/sendStatus/500',
		'/test/sendStatus/9999',
		'/test/sendStatus/abc',
		'/test/sendStatus/defaults/0',
		'/test/sendStatus/defaults/1',
		'/test/sendStatus/defaults/2',
	];
	var i = 1;
	var flag = false;

	return function() {
		if(flag === true) {
			testApp.all(pathes[0]);
			flag = false;
			return;
		}
		testApp.all(pathes[i]);
		i++;
		flag = true;
	};
}

var t = test();