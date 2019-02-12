'use strict'
const Koa = require('koa')
const sha1 = require('sha1')
const app = new Koa()
const config = {
    wechat:{
        appID: 'wx5e8a16fa067e5067',
        appsecret: '73dcf94846cdad3831cf04de8baed56d',
        tocken: 'qiuzhilin'
    }
}

app.use(async (ctx) => {
    const tocken = config.wechat.tocken
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
})

app.listen(80, () => {
    console.log('App listening on port 80!');
});