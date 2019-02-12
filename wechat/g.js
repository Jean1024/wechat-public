'use strict'
const sha1 = require('sha1');
const Wechat = require('./wechat');
const getRowBody = require('raw-body')
module.exports = function(opts){
    //微信加密
    var wechat = new Wechat(opts)
    return function *(ctx){
        var signature = ctx.query.signature,//微信加密签名
            timestamp = ctx.query.timestamp,//时间戳
            nonce = ctx.query.nonce,//随机数
            echostr = ctx.query.echostr,//随机字符串
            token = opts.token;
        var str = [timestamp,token,nonce].sort().join('')
        var sha = sha1(str)

        if(ctx.method === 'GET'){
            if(sha === signature){
                ctx.body = echostr
            }else{
                ctx.body = '验证失败'
            }
        }else if(ctx.method === 'POST'){
            if(sha !== signature){
                ctx.body = '验证失败'
                return false
            }
            var data = yield getRowBody(ctx.req, {
                length: ctx.length,
                limit: '1mb',
                encoding: ctx.charset
            })
            console.log(data.toString())
        }
    }
}