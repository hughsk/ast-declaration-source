module.exports = findDeclaration

function findDeclaration(node) {
  var curr = node

  while (curr = curr.parent) {
    if (!curr.body) continue

    for (var i = 0; i < curr.body.length; i++) {
      var target = curr.body[i]
      if (target.type === 'VariableDeclaration') {
        var result = searchDeclarations(target.declarations)
        if (result) return result
      } else
      if (target.type === 'FunctionDeclaration') {
        var id = target.id
        if (id.type !== 'Identifier') continue
        if (id.name !== node.name) continue
        return id
      } else
      if (target.type === 'ForStatement') {
        var result = searchLoop(target.init)
                  || searchLoop(target.test)
                  || searchLoop(target.update)
        if (result) return result
      } else
      if (target.type === 'WhiteStatement') {
        var result = searchLoop(target.test)
        if (result) return result
      }
    }
  }

  function searchLoop(target) {
    if (target.type !== 'VariableDeclaration') return
    return searchDeclarations(target.declarations)
  }

  function searchDeclarations(declarations) {
    for (var j = 0; j < declarations.length; j++) {
      var decl = declarations[j]
      var id   = decl.id
      if (id.type !== 'Identifier') continue
      if (id.name !== node.name) continue
      return id
    }
  }
}
