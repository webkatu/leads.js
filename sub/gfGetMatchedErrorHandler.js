function* gfGetMatchedErrorHandler(request) {
	yield* privates(this).getMatchedErrorHandlers(request);
}