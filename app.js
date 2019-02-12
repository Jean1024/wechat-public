'use strict'
const Koa = require('koa');
const path = require('path')
const wechat_file = path.join(__dirname,'./config/wechat.txt')
const wechat = require('./wechat/g')
const util = require('./libs/util.js')
const config = {
    wechat: {
        token:"qiuzhilin",
        appID:"wx073a992a88e1356a",
        appScrect:"72fba66ce0195f15075451c775712496",
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

app.listen(80, () => {
    console.log('App listening on port 80!');
});