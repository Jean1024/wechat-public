'use strict'

const xml2js = require('xml2js')
const Promise = require('bluebird');

exports.parseXMLAsync = function(xml){
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml,{trim:true,function (err,content) {
            if(err) reject(err)
            resolve(content)
        }})
    })
    
}
function formatMessage(result){
    var message = {}
    console.log(result)
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