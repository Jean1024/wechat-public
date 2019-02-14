'use strict'
const fs = require('fs')
const Promise = require('bluebird')
var _ = require('lodash')
const request = Promise.promisify(require('request'))
const prefix = 'https://api.weixin.qq.com/cgi-bin/'
const util = require('./util')
const api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    temporary: {
        upload: prefix + 'media/upload?',
        fetch: prefix + 'media/get?'
    },
    permanent: {
        upload: prefix + 'material/add_material?',
        fetch: prefix + 'material/get_material?',
        uploadNews: prefix + 'material/add_news?',
        uploadNewsPic: prefix + 'media/uploadimg?',
        del: prefix + 'material/del_material?',
        update: prefix + 'material/update_news?',
        count: prefix + 'material/get_materialcount?',
        batch: prefix + 'material/batchget_material?'
    },
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
                return that.updateAccessToken()
            }
            if(that.isValidAccessToken(data)){
                return Promise.resolve(data)
            }else{
                return that.updateAccessToken()
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
    updateAccessToken(){
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
    reply(){
        const content = this.body
        const message = this.weixin

        const xml = util.tpl(content, message)
        console.log(xml)
        this.status = 200
        this.type = 'application/xml'
        this.body = xml
    }
    uploadMaterial(type,material,permanent={}){
        const that = this
        const form = {}
        let uploadUrl = api.temporary.upload
        if(permanent){
            uploadUrl = api.permanent.upload
            _.extend(form,permanent)
        }
        if(type === 'pic'){
            uploadUrl = api.permanent.uploadNewsPic
        }
        if(type === 'news'){
            uploadUrl = api.permanent.uploadNews
            form = material
        }else{
            form.media = fs.createReadStream(material)
        }
        return new Promise((resolve, reject) => {
            that.fetchAccessToken()
            .then(data=>{
                console.log(data.access_token)
                var url = uploadUrl + '&access_token='+data.access_token
                if(!permanent){
                    url += '&type=' + type 
                }else{
                    form.access_token = data.access_token
                }
                var options = {
                    method: 'POST',
                    url:url,
                    json:true
                }
                if(type === 'news'){
                    options.body = form
                }else{
                    options.formData = form
                }
                request(options)
                .then(function(response){
                    let _data = response.body
                    console.log(_data)
                    if(_data){
                        resolve(_data)
                    }else{
                        throw new Error('Upload material failed')
                    }
                })
                .catch(err=>{
                    reject(err)
                })
            })
        })
    }
    fetchAccessToken(){
        var that = this
        return this.getAccessToken()
        .then(function(data){
            try{
                data = JSON.parse(data)
            }catch(e){
                return that.updateAccessToken()
            }
            if(that.isValidAccessToken(data)){
                return Promise.resolve(data)
            }else{
                return that.updateAccessToken()
            }
        })
        .then(function(data){
            that.access_token = data.access_token
            that.expires_in = data.expires_in
            that.saveAccessToken(data)
            return Promise.resolve(data)
        })
    }
}
module.exports = Wechat