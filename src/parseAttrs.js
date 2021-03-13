export default function(attrsStr) {
    if(!attrsStr) return []
    
    // 指针
    var index = 0
    var point = 0
    var result = []
    var isYinhao = false


    while(index < attrsStr.length -1) {
        let char = attrsStr[index]
        if(char === '"') {
            isYinhao = !isYinhao
        } else if(char === ' ' && !isYinhao) {
            let content = attrsStr.substring(point, index)
            if(!/^\s*$/.test(content)) {
                result.push(content.trim())
                point = index
            }
        }
        index = index + 1
    }
    // 循环结束之后,还剩下最后一个属性k="v"
    result.push(attrsStr.substring(point).trim())
    
    result = result.map(item => {
        const o = item.match(/^(.+)="(.+)"$/)
        return {
            name: o[1],
            value: o[2]
        }
    })
    return result
}