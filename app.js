'use strict'
const Koa = require('koa');
const path = require('path')
const wechat_file = path.join(__dirname,'./config/wechat.txt')
const wechat = require('./wechat/g')
const util = require('./libs/util.js')
const config = {
    wechat: {
        token:"qiuzhilin",
        appID:"wx5e8a16fa067e5067",
        appScrect:"73dcf94846cdad3831cf04de8baed56d",
        getAccessToken:function(){
            return util.readFileAsync(wechat_file,'utf-8')
        },
        saveAccessToken:function(data){
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_file,data)
        }
    }
}

const app = new Koa()

app.use(wechat(config.wechat))

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});