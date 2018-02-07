const assign = require('lodash/assign')

function PugLexBemifier() {
  this.tokens = this.tokens || []
  this.bemBlocks = this.bemBlocks || []
  this.originBemBlocks = this.originBemBlocks || []
  this.cacheIndex = {}
}

/* get the first token col */
PugLexBemifier.prototype.getLineStartCol = function(token, index, tokens) {
  while (token.type !== 'outdent' && token.type !== 'indent' && token.type !== 'newline') {
    const newToken = tokens[--index]
    if (!newToken) break
    token = newToken
  }
  return tokens[index + 1].col
}

PugLexBemifier.prototype.isClosestTokenSameAsRecentBEMBlock = function(token, index, tokens, mostRecentBEMBlock, originMostRecentBEMBlock) {
  while (token.type === 'outdent' || token.type === 'indent' || token.type === 'newline' || this.getLineStartCol(token, index, tokens) !== mostRecentBEMBlock.col) {
    token = tokens[--index]
  }
  while (token.type !== 'outdent' && token.type !== 'indent' && token.type !== 'newline') {
    if (token === originMostRecentBEMBlock) {
      this.cacheIndex.index = index
      return true
    }
    token = tokens[--index]
  }
  this.cacheIndex.index = index
  return false
}

PugLexBemifier.prototype.getMostRecentBEMBlock = function(token, index, tokens) {
  if (!this.bemBlocks.length) throw new Error('no bem block')
  let tokenCol = this.getLineStartCol(token, index, tokens)
  let mostRecentBEMBlock = this.bemBlocks[this.bemBlocks.length - 1]
  while (mostRecentBEMBlock && tokenCol <= mostRecentBEMBlock.col) {
    this.bemBlocks.pop()
    this.originBemBlocks.pop()
    mostRecentBEMBlock = this.bemBlocks[this.bemBlocks.length - 1]
  }
  let originMostRecentBEMBlock = this.originBemBlocks[this.originBemBlocks.length - 1]

  this.cacheIndex.index = index
  while (!this.isClosestTokenSameAsRecentBEMBlock(token, this.cacheIndex.index, tokens, mostRecentBEMBlock, originMostRecentBEMBlock)) {
    this.bemBlocks.pop()
    this.originBemBlocks.pop()
    mostRecentBEMBlock = this.bemBlocks[this.bemBlocks.length - 1]
    originMostRecentBEMBlock = this.originBemBlocks[this.originBemBlocks.length - 1]
  }
  return mostRecentBEMBlock
}

PugLexBemifier.prototype.updateData = function(token, index, tokens, reg, str) {
  this.originBemBlocks.push(token)
  token.val = token.val.replace(reg, str)
  this.bemBlocks.push(assign({}, token, { col: this.getLineStartCol(token, index, tokens) }))
}

PugLexBemifier.prototype.bemify = function(token, index, tokens) {
  if (token) {
    this.tokens.push(token)

    if (token.type == 'class') {
      if (token.val.match(/^b\_\_/)) {
        this.updateData(token, index, tokens, /^b\_\_/, '')
      } else if (token.val.match(/^\-/)) {
        this.updateData(token, index, tokens, /^\-\-/, this.getMostRecentBEMBlock(token, index, tokens).val + '--')
      } else if (token.val.match(/^\_/)) {
        this.updateData(token, index, tokens, /^\_\_/, this.getMostRecentBEMBlock(token, index, tokens).val + '__')
      }
    }
  }
}

PugLexBemifier.prototype.reset = function() {
  this.tokens = []
}

module.exports = function() {
  var bemifier = new PugLexBemifier()
  return {
    postLex: function(tokens) {
      bemifier.reset()
      tokens.forEach(function(token, index) {
        bemifier.bemify(token, index, tokens)
      })
      return bemifier.tokens
    }
  }
}
