'use strict'
const sha1 = require('sha1');
const Wechat = require('./wechat');
const getRowBody = require('raw-body')
const util = require('./util')
module.exports = function(opts){
    //微信加密
    var wechat = new Wechat(opts)
    return function *(next){
        var signature = this.query.signature,//微信加密签名
            timestamp = this.query.timestamp,//时间戳
            nonce = this.query.nonce,//随机数
            echostr = this.query.echostr,//随机字符串
            token = opts.token;
        var str = [timestamp,token,nonce].sort().join('')
        var sha = sha1(str)

        if(this.method === 'GET'){
            if(sha === signature){
                this.body = echostr
            }else{
                this.body = '验证失败'
            }
        }else if(this.method === 'POST'){
            if(sha !== signature){
                this.body = '验证失败'
                return false
            }
            var data = yield getRowBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            })
            var content = yield util.parseXMLAsync(data)
           
            const message = util.formatMessage(content)
            console.log(message)
        }
    }
}