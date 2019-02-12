const sha1 = require('sha1')
module.exports = function(config){
    return async function(ctx){
        var signature = ctx.query.signature,//微信加密签名
            timestamp = ctx.query.timestamp,//时间戳
            nonce = ctx.query.nonce,//随机数
            echostr = ctx.query.echostr,//随机字符串
            token = config.token;
        const str = [token,nonce,timestamp].sort().join('')
        const sha = sha1(str)
        if(sha === signature){
            ctx.body = echostr
        }else{
            ctx.body = '验证失败,请在微信中打开'
        }
    }
}