.PHONY: package publish

# generate package locally
# refers: https://github.com/tj/node-prune
package:
	@node-prune
	@vsce package

publish:
	@vsce publish
