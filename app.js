'use strict'
const Koa = require('koa');
const wechat = require('./wechat/g')
const config = require('./config')
const weixin = require('./weixin')
const app = new Koa()

app.use(wechat(config.wechat,weixin.reply))

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});