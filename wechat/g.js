'use strict'
const sha1 = require('sha1');
const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const prefix = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
    accessToken: prefix + 'token?grant_type=client_credential'
}
class Wechat{
    constructor(opts){
        const that = this
        this.appID = opts.appID
        this.appScrect = opts.appScrect
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken
        this.getAccessToken()
        .then(function(data){
            try{
                data = JSON.parse(data)
            }catch(e){
                return that.updataAccessToken()
            }
            if(that.isValidAccessToken(data)){
                return Promise.resolve(data)
            }else{
                return that.updataAccessToken()
            }
        })
        .then(function(data){
            that.access_token = data.access_token
            that.expires_in = data.expires_in
            that.saveAccessToken(data)
        })
    }
    isValidAccessToken(data){
        // 检测合法性
        if(!data || !data.access_token || !data.expires_in){
            return false
        }
        var expires_in = data.expires_in
        var now = (new Date()).getTime()
        if(now < expires_in){
            return true
        }else{
            return false
        }
    }
    updataAccessToken(){
        // 更新token
        var appID = this.appID
        var appScrect = this.appScrect
        var url = api.accessToken + '&appid='+appID+'&secret='+appScrect
        return new Promise((resolve, reject) => {
            request({url,json:true})
            .then(response=>{
                var data = response.body
                var now = (new Date()).getTime()
                // 有效时间缩短20s
                var expires_in = now + (data.expires_in - 20) * 1000
                data.expires_in = expires_in
                resolve(data)
            })
        })
    }
}
module.exports = function(opts){
    var wechat = new Wechat(opts)
    return function *(ctx){
        var signature = ctx.query.signature,//微信加密签名
            timestamp = ctx.query.timestamp,//时间戳
            nonce = ctx.query.nonce,//随机数
            echostr = ctx.query.echostr,//随机字符串
            token = opts.token;
        var str = [timestamp,token,nonce].sort().join('')
        var sha = sha1(str)
        if(sha === signature){
            ctx.body = echostr
        }else{
            ctx.body = '验证失败'
        }
    }
}