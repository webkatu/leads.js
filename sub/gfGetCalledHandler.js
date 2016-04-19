function gfGetCalledHandler(request, pathString, method, baseUrl, params) {
	let calledHandlers = privates(this).getCalledHandlers(pathString, method, baseUrl, params);
	let i = 0;
	let l = 0;
	let childRouter = null;
	let obj = {
		value: undefined,
		done: true,
	}
	return {
		next: function(skip) {
			if(calledHandlers.length <= i) {
				return {
					done: true,
					value: undefined,
				};
			}
			let calledHandler = calledHandlers[i];
			if(calledHandler.handler.listeners.length <= l) {
				i++;
				l = 0;
				return this.next();
			}

			if(childRouter) {
				let nextHandler = childRouter.getNextHandler(skip);
				if(nextHandler) {
					return {
						done: false,
						value: nextHandler
					};
				}
				l++;
				childRouter = null;
				return this.next();
			}
			
			if(l !== 0 && skip) {
				i++;
				l = 0;
				return this.next();
			}


			let listener = calledHandler.handler.listeners[l];
			if(listener instanceof Router) {
				childRouter = privates(listener);
				let baseUrl = request.pathname.replace(RegExp(calledHandler.remainder + '$'), '');
				childRouter.goGetCalledHandler = childRouter.gfGetCalledHandler(
					request,
					calledHandler.remainder,
					method,
					baseUrl,
					calledHandler.req.params
				);
				let nextHandler = childRouter.getNextHandler();
				if(nextHandler) {
					return {
						done: false,
						value: nextHandler
					};
				}
				l++;
				childRouter = null;
				return this.next();
			}

			l++;
			return {
				done: false,
				value:{
					type: calledHandler.handler.type,
					listener: listener,
					req: calledHandler.req,
					paramValue: calledHandler.paramValue,
				},
			};
		},
	};
}

function* gfGetCalledHandler(request, pathString, method, baseUrl, params) {
	let calledHandlers = privates(this).getCalledHandlers(pathString, method, baseUrl, params);

	for(let i = 0, len = calledHandlers.length; i < len; i++) {
		let calledHandler = calledHandlers[i];
		for(let i = 0, len = calledHandler.handler.listeners.length; i < len; i++) {
			let listener = calledHandler.handler.listeners[i];
			//listenerはfunctionかRouterかAppか;
			if(listener instanceof Router) {
				let childRouter = privates(listener);
				let baseUrl = request.pathname.replace(RegExp(calledHandler.remainder + '$'), '');
				childRouter.goGetCalledHandler = childRouter.gfGetCalledHandler(
					request,
					calledHandler.remainder,
					method,
					baseUrl,
					calledHandler.req.params
				);
				let nextHandler = childRouter.getNextHandler();
				while(nextHandler) {
					let skip = yield nextHandler;
					nextHandler = childRouter.getNextHandler(skip);
				}
				continue;
			}

			let skip = yield {
				type: calledHandler.handler.type,
				listener: listener,
				req: calledHandler.req,
				paramValue: calledHandler.paramValue,
			};
			if(skip) break;
		}
	}
}