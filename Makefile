.PHONY: package

# generate package locally
# refers: https://github.com/tj/node-prune
package:
	@node-prune
	@vsce package
