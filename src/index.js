import parse from './parse'

const tempalteString = `<div>
    <h3 class="aa bb cc" id="mybox" >你好</h3>
    <ul>
        <li>A</li>
        <li>B</li>
        <li>C</li>
    </ul>
</div>`

// alert(tempalteString)

const ast = parse(tempalteString)
console.log(ast)
