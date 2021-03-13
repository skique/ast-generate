export default function(tempalteString){
    // 指针
    var index = 0
    var rest
    
    // 开始标记正则：^\<([a-z]+[1-6]?)\>
    var startRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/;
    var endRegExp =  /^\<\/([a-z]+[1-6]?)\>/;
    // 不是以<开头的并且以</>中间的文字
    var wordRegExp = /^([^\<]+)\<\/([a-z]+[1-6]?)\>/

    var stack1 = []             
    var stack2 = [{'children': []}]

    while(index < tempalteString.length -1) {
        rest = tempalteString.substring(index)
        // console.log(index, rest)
        if (startRegExp.test(rest)) { // 识别开始标记
            let tag = rest.match(startRegExp)[1]
            console.log('检测到开始标记', tag)
            // +2 因为<>占两位
            index += tag.length + 2
            // 压栈
            stack1.push(tag)
            stack2.push({ 'tag': tag, 'children':[] })
            console.log(stack1)
        } else if (endRegExp.test(rest)) { // 识别结束标记
            let tag = rest.match(endRegExp)[1]
            console.log('检测到结束标记', tag)
            // 弹栈
            let pop_tag = stack1.pop()
            if(tag === pop_tag) {
                let pop_arr = stack2.pop()
                if (stack2.length > 0) {
                    stack2[stack2.length -1].children.push(pop_arr)
                }
            } else {
                throw new Error(pop_tag + '标签没有封闭！！')
            }
            // +3 因为</>占三位
            index += tag.length + 3 
        } else if (wordRegExp.test(rest)) { // 检测不是全空的文字
            let word = rest.match(wordRegExp)[1]
            if(!/^\s+$/.test(word)) {
                console.log('检测文字', word)
                // 此时改变stack2的栈顶元素
                stack2[stack2.length -1].children.push({ 'text': word, 'type': 3 })
            }
            index += word.length
        } else {
            index ++
        }
    }
    return stack2[0].children
}