const acorn  = require('acorn')
const test   = require('tape')
const astw   = require('astw')
const source = require('./')

test('simple test', t => {
  const ast = acorn.parse(`
    var x = 1

    console.log(x)
  `)

  astw(ast)(_=>{})

  var lost  = ast.body[1].expression.arguments[0]
  var found = source(lost)

  t.equal(found, ast.body[0].declarations[0].id, 'finds original source')
  t.end()
})

test('function declarations', t => {
  const ast = acorn.parse(`
    console.log(x)

    function x() {

    }
  `)

  astw(ast)(_=>{})

  var lost  = ast.body[0].expression.arguments[0]
  var found = source(lost)

  t.equal(found, ast.body[1].id, 'find original function declaration')
  t.end()
})

test('for loops', t => {
  const ast = acorn.parse(`
    for (var i = 0; i < 0; i++) {
      console.log(i)
    }
  `)

  astw(ast)(_=>{})

  var goal  = ast.body[0].init.declarations[0].id
  var lost1 = ast.body[0].test.left
  var lost2 = ast.body[0].body.body[0].expression.arguments[0]

  t.equal(source(lost1), goal, 'finds loop decl from within test statement')
  t.equal(source(lost2), goal, 'finds loop decl from within block')
  t.end()
})

test('while loops', t => {
  const ast = acorn.parse(`
    var i = 0

    while (i--) {
      console.log(i)
    }
  `)

  astw(ast)(_=>{})

  var goal  = ast.body[0].declarations[0].id
  var lost1 = ast.body[1].test.argument
  var lost2 = ast.body[1].body.body[0].expression.arguments[0]

  t.equal(source(lost1), goal, 'finds loop decl from within test statement')
  t.equal(source(lost2), goal, 'finds loop decl from within block')
  t.end()
})
