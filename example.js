var escodegen = require('escodegen')
var acorn     = require('acorn')
var astw      = require('astw')
var source    = require('./')
var fs        = require('fs')

var src      = fs.readFileSync(__filename, 'utf8')
var ast      = acorn.parse(src)

// required to assign "parent" properties
// to each node
astw(ast)(function(){})

var srcNode  = ast.body[6].declarations[0].init.arguments[0]
var declNode = source(srcNode)

console.log('original usage:')
console.log(escodegen.generate(srcNode.parent))
console.log()

console.log('declaration:')
console.log(escodegen.generate(declNode.parent.parent))
console.log()
