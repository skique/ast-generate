/*
* 构建一个简单的静态分析器，它可以从命令行进行运行。它能够识别下面几部分内容：
* 已声明但没有被调用的函数
* 调用了未声明的函数
* 被调用多次的函数
*/

var fs = require('fs'),  
esprima = require('esprima');
estraverse = require('estraverse')
    
// 1. 执行主要的代码分析工作
function analyzeCode(code) {
    var ast = esprima.parse(code);  

    var functionsStats = {}; // 1. 存放函数的调用和声明的统计信息 

    var addStatsEntry = function (funcName) { // 2. 存放统计信息  
        if (!functionsStats[funcName]) {  
            functionsStats[funcName] = { calls: 0, declarations: 0 };  
        }  
    };  

    // 3. 遍历AST  
    estraverse.traverse(ast, {
        enter: function (node) { 
            if (node.type === 'FunctionDeclaration') {  
                addStatsEntry(node.id.name); // 4. 如果发现了函数声明，增加一次函数声明  
                functionsStats[node.id.name].declarations++;  
            } else if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {  
                addStatsEntry(node.callee.name);  
                functionsStats[node.callee.name].calls++; // 5. 如果发现了函数调用，增加一次函数调用
            }  
        }  
    });  

    // 处理结果
    processResults(functionsStats);
}

function processResults(results) {
    for (var name in results) {
        if (results.hasOwnProperty(name)) { 
            var stats = results[name];  
            if (stats.declarations === 0) {
                console.log('Function', name, 'undeclared');  
            } else if (stats.declarations > 1) {
                console.log('Function', name, 'decalred multiple times');  
            } else if (stats.calls === 0) {
                console.log('Function', name, 'declared but not called');  
            }  
        }  
    }  
}
    
// 2.  这可以通过查看process.argv的长度来得到分析文件的具体位置
if (process.argv.length < 3) {  
    console.log('Usage: index.js file.js');  
    process.exit(1);  
}  
    
// 3. 获取文件，并将文件传入到analyzeCode函数中进行处理
var filename = process.argv[2];
console.log('Reading ' + filename);  
var code = fs.readFileSync(filename, 'utf8');  

// console.log(code)
    
analyzeCode(code);  
console.log('Done');  


