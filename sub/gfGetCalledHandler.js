function* gfGetCalledHandler(path, method, baseUrl, params) {
	let calledHandlers = privates(this).getCalledHandlers(path, method, baseUrl, params);

	for(let i = 0, len = calledHandlers.length; i < len; i++) {
		let calledHandler = calledHandlers[i];
		for(let i = 0, len = calledHandler.handler.listeners.length; i < len; i++) {
			let listener = calledHandler.handler.listeners[i];
			//listenerはfunctionかRouterかAppか;
			if(listener instanceof Router) {
				let childRouter = privates(listener);
				childRouter.goGetCalledHandler = childRouter.gfGetCalledHandler(
					calledHandler.remainder,
					method,
					calledHandler.req.baseUrl,
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