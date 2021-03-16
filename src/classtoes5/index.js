/**
 * 将 es6 中的 class 改造成 es5 的 function 形式
 */
var fs = require('fs')
const babel = require('@babel/core')
const types = require('babel-types')

let visitor = {
    ClassDeclaration (path) {
        let node = path.node; //当前节点
        let id = node.id;   //节点id
        let methods = node.body.body; // 方法数组
        let constructorFunction = null; // 构造方法
        let functions = []; // 目标方法
        
        methods.forEach(method => {
            //如果是构造方法
            if ( method.kind === 'constructor' ) {
                constructorFunction = types.functionDeclaration(id, method.params, method.body, false, false);
                functions.push(constructorFunction)
            } else {
                //普通方法
                let memberExpression = types.memberExpression(types.memberExpression(id, types.identifier('prototype'), false), method.key, false);
                let functionExpression = types.functionExpression(null, method.params, method.body, false, false);
                let assignmentExpression = types.assignmentExpression('=', memberExpression, functionExpression);
                functions.push(types.expressionStatement(assignmentExpression));
            }
        })
        //判断，replaceWithMultiple用于多重替换
        if(functions.length === 1){
            path.replaceWith(functions[0])
        }else{
            path.replaceWithMultiple(functions)
        }
    }
}

if (process.argv.length < 3) {  
    console.log('Usage: index.js file.js');  
    process.exit(1);  
}  
    
var filename = process.argv[2];
console.log('Reading ' + filename);  
var code = fs.readFileSync(filename, 'utf8');  

let result = babel.transform(code,{
    plugins:[
        {
            visitor
        }
    ]
})

console.log(result.code);
