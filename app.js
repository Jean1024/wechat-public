'use strict'
const Koa = require('koa')
const app = new Koa()
const wechat = require("./wechat/g")
const config = require('./config')

app.use(wechat(config))
app.listen(80, () => {
    console.log('App listening on port 80!');
});