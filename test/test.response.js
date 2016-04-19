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

testApp.use('/nodejs/test', app);

app.use('/', function(req, response, next) {
	res = response;
	next();
});

app.get('/response.html', function(req, res, next) {
	res.send(html, { baseElement: document.documentElement });
	document.documentElement.lang = 'en';

	res.options = {
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
	xhr.open('GET', '/nodejs/test/index.html');
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

var sendOptionsR = leads.Router();

sendOptionsR.use('/0', function(req, res, next) {
	var div = document.createElement('div');
	document.body.appendChild(div);
	res.send('<p>foo</p><p>bar</p>', {
		baseElement: div,
		title: 'test send',
	});
});

sendOptionsR.use('/1', function(req, res, next) {
	var div = document.createElement('div');
	document.body.appendChild(div);
	res.options.baseElement = div;
	res.send('<p>foo</p><p><bar</p>');
});

sendOptionsR.use('/2', function(req, res, next) {
	res.send(testData.object, {
		title: 'test send',
		filename: 'object',
		transition: false,
	});
});

sendOptionsR.use('/3', function(req, res, next) {
	res.send(testData.blob, {
		filename: 'blob.txt',
		title: 'aaa',
		type: 'text/plain',
		transition: true,
	});
});

sendOptionsR.use('/4', function(req, res, next) {
	res.options = {
		type: 'text/plain',
		filename: 'foobar.txt',
		transition: true,
	};

	res.send(testData.arraybuffer);
});

sendR.use('/options', sendOptionsR);

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
	res.sendFile('/nodejs/test/index.html');
});

sendFileR.use('/imageURL', function(req, res, next) {
	res.sendFile(url);
});

sendFileR.use('/url', function(req, res, next) {
	res.sendFile('https://google.com');
});

var sendFileOptionsR = leads.Router();

sendFileOptionsR.use('/0', function(req, res, next) {
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

sendFileOptionsR.use('/1', function(req, res, next) {
	var div = document.createElement('div');
	document.body.appendChild(div);
	res.options = {
		baseElement: div,
		filename: 'blob.html',
		url: false,
		transition: false,
	}
	res.sendFile(testData.blob);
});

sendFileOptionsR.use('/2', function(req, res, next) {
	res.sendFile(url, {
		title: 'test sendFile',
		type: 'text/html',
		url: true,
		transition: false,
	});
});

sendFileOptionsR.use('/3', function(req, res, next) {
	res.sendFile('https://www.google.com', {
		type: 'text/plain',
		url: false,
		transition: true,
	});
});

sendFileOptionsR.use('/4', function(req, res, next) {
		res.sendFile('https://www.google.com', {
		type: 'text/plain',
		url: true,
		transition: true,
	});
});

sendFileR.use('/options', sendFileOptionsR);

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

var sendStatusOptionsR = leads.Router();

sendStatusOptionsR.use('/0', function(req, res, next) {
	document.body.textContent = 'test sendStatus';
	var div = document.createElement('div');
	document.body.appendChild(div);
	res.sendStatus(403, {
		baseElement: div,
	});
});

sendStatusOptionsR.use('/1', function(req, res, next) {
	document.body.textContent = 'test sendStatus';
	var div = document.createElement('div');
	document.body.appendChild(div);
	res.options.baseElement = div;
	res.sendStatus(403);
});

sendStatusOptionsR.use('/2', function(req, res, next) {
	res.sendStatus(403, {
		title: 'test sendStatusTitle',
		message: 'test sendStatusMessage',
	});
});

sendStatusR.use('/options', sendStatusOptionsR);

app.use('/sendStatus', sendStatusR);

/*
dispatch;

testApp.all('/nodejs/test/response.html');
testApp.all('/nodejs/test/download');

testApp.all('/nodejs/test/send/document');
testApp.all('/nodejs/test/send/element');
testApp.all('/nodejs/test/send/string');
testApp.all('/nodejs/test/send/blob');
testApp.all('/nodejs/test/send/json');
testApp.all('/nodejs/test/send/arraybuffer');
testApp.all('/nodejs/test/send/options/0');
testApp.all('/nodejs/test/send/options/1');
testApp.all('/nodejs/test/send/options/2');
testApp.all('/nodejs/test/send/options/3');
testApp.all('/nodejs/test/send/options/4');

testApp.all('/nodejs/test/sendFile/blob');
testApp.all('/nodejs/test/sendFile/json');
testApp.all('/nodejs/test/sendFile/arraybuffer');
testApp.all('/nodejs/test/sendFile/string');
testApp.all('/nodejs/test/sendFile/localURL');
testApp.all('/nodejs/test/sendFile/imageURL');
testApp.all('/nodejs/test/sendFile/url');
testApp.all('/nodejs/test/sendFile/options/0');
testApp.all('/nodejs/test/sendFile/options/1');
testApp.all('/nodejs/test/sendFile/options/2');
testApp.all('/nodejs/test/sendFile/options/3');
testApp.all('/nodejs/test/sendFile/options/4');

testApp.all('/nodejs/test/sendStatus/200');
testApp.all('/nodejs/test/sendStatus/404');
testApp.all('/nodejs/test/sendStatus/500');
testApp.all('/nodejs/test/sendStatus/9999');
testApp.all('/nodejs/test/sendStatus/abc');
testApp.all('/nodejs/test/sendStatus/options/0');
testApp.all('/nodejs/test/sendStatus/options/1');
testApp.all('/nodejs/test/sendStatus/options/2');
*/

function test() {
	var pathes = [
		'/nodejs/test/response.html',
		
		'/nodejs/test/download',
		'/nodejs/test/send/document',
		'/nodejs/test/send/element',
		'/nodejs/test/send/string',
		'/nodejs/test/send/blob',
		'/nodejs/test/send/json',
		'/nodejs/test/send/arraybuffer',
		'/nodejs/test/send/options/0',
		'/nodejs/test/send/options/1',
		'/nodejs/test/send/options/2',
		//'/nodejs/test/send/options/3',
		//'/nodejs/test/send/options/4',

		'/nodejs/test/sendFile/blob',
		'/nodejs/test/sendFile/json',
		'/nodejs/test/sendFile/arraybuffer',
		'/nodejs/test/sendFile/string',
		'/nodejs/test/sendFile/localURL',
		'/nodejs/test/sendFile/imageURL',
		'/nodejs/test/sendFile/url',
		'/nodejs/test/sendFile/options/0',
		'/nodejs/test/sendFile/options/1',
		'/nodejs/test/sendFile/options/2',
		//'/nodejs/test/sendFile/options/3',
		//'/nodejs/test/sendFile/options/4',

		'/nodejs/test/sendStatus/200',
		'/nodejs/test/sendStatus/404',
		'/nodejs/test/sendStatus/500',
		'/nodejs/test/sendStatus/9999',
		'/nodejs/test/sendStatus/abc',
		'/nodejs/test/sendStatus/options/0',
		'/nodejs/test/sendStatus/options/1',
		'/nodejs/test/sendStatus/options/2',
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