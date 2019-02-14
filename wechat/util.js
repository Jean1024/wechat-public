'use strict'

const xml2js = require('xml2js')
const Promise = require('bluebird');
const tpl = require('./tpl')
exports.parseXMLAsync = function(xml){
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {trim: true},function (err,content) {
            if(err) reject(err)
            else resolve(content)
        })
    }) 
}
function formatMessage(result){
    var message = {}
    if(typeof result === 'object'){
        var keys = Object.keys(result)
        for (let i = 0; i < keys.length; i++) {
            const item = result[keys[i]];
            var key = keys[i]
            if(!(item instanceof Array) || item.length === 0){
                continue
            }
            if(item.length === 1){
                var val = item[0]
                if(typeof val === 'object'){
                    message[key] = formatMessage(val)
                }else{
                    message[key] = (val || "").trim()
                }
            }else{
                message[key] = []
                for (let j = 0; j < item.length; j++) {
                    message[key].push(formatMessage(item[j]))
                }
            }
        }
    }
    return message
}
exports.formatMessage = formatMessage

exports.tpl = function(content,message){
    
    const info = {}
    let type = 'text'
    const fromUserName = message.FromUserName
    const toUserName = message.ToUserName

    if(Array.isArray(content)){
        type = 'news'
    }
    if (!content) {
        content = 'Empty news'
    }
    type = content.type || type
    info.content = content
    info.createTime = new Date().getTime()
    info.msgType = type
    info.toUserName = fromUserName
    info.fromUserName = toUserName
    console.log(info)
    return tpl.compiled(info)
}