function gfGetMatchedErrorHandler(request) {
	let matchedHandlers = privates(this).getMatchedErrorHandlers(request);
	let i = 0;
	return {
		next: function() {
			if(matchedHandlers.length <= i) {
				return { done: true, value: undefined, }
			}
			return { done: false, value: matchedHandlers[i++], };
		},
	};
}

function* gfGetMatchedErrorHandler(request) {
	yield* privates(this).getMatchedErrorHandlers(request);
}