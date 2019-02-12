'use strict'
const sha1 = require('sha1')
module.exports = function(opts){
    return async function (ctx) {
        const tocken = opts.wechat.tocken
        const signature = ctx.query.signature
        const echostr = ctx.query.echostr
        const timestamp = ctx.query.timestamp
        const nonce = ctx.query.nonce
        const str = [tocken,timestamp,nonce].sort().join('')
        const sha = sha1(str)
        if(sha === signature){
            ctx.body = echostr
        }else{
            ctx.body = '验证失败'
        }
    }
}
