'use strict'
const path = require('path')
const wechat_file = path.join(__dirname,'./config/wechat.txt')
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

module.exports = config