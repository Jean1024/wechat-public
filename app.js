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

app.use(async (ctx,next) => {
    console.log(ctx.query)
    next()
})

app.listen(80, () => {
    console.log('App listening on port 80!');
});