'use strict'
const path = require('path')
const config = require('./config')
const Wechat = require('./wechat/wechat')
const wechatApi = new Wechat(config.wechat)
// 微信接受消息分类
exports.reply = function *(next){
    const message = this.weixin
    if(message.MsgType === 'event'){
        if(message.Event === 'subscribe') {
            if(message.EventKey){
                console.log('扫码进来：' + message.EventKey + ' ' + message.ticket)
            }
            this.body = '你订阅了\r\n' + '消息ID' + message.MsgId
        }else if(message.Event === 'unsubscribe'){
            console.log('无情取关')
            this.body = ''
        }else if(message.Event === 'LOCATION'){
            this.body = '您上报的位置是： ' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
        }else if(message.Event === 'CLICK'){
            this.body = '你点击了菜单： ' + message.EventKey
        }else if(message.Event === 'SCAN'){
           console.log( '关注后扫码' + message.EventKey + ' ' + message.Ticket)
           this.body = '看到你扫了一下'
        }else if(message.Event === 'VIEW'){
            this.body = '您点击了菜单中的连接： ' + message.EventKey
        }
    }else if(message.MsgType === 'text'){
        var content = message.Content
        var reply = '额，你说的 ' + message.Content + ' 太复杂了'
        if(content === '1'){
            reply = '天下第一吃大米'
        }else if(content === '2'){
            reply = '天下第二吃豆腐'
        }else if(content === '3'){
            reply = '天下第三吃咸蛋'
        }else if(content === '4'){
            reply = [{
                title: '技术改变世界',
                description: '只是个描述而已',
                picUrl: 'http://b.hiphotos.baidu.com/image/pic/item/1f178a82b9014a90e7c1956da4773912b21bee67.jpg',
                url: 'https://github.com/'
              },{
                title: 'Nodejs 开发微信',
                description: '爽到爆',
                picUrl: 'http://h.hiphotos.baidu.com/image/pic/item/ca1349540923dd54e1964cb2dc09b3de9d824807.jpg',
                url: 'https://nodejs.org/'
              }]
        }else if(content === '5'){
            var data = yield wechatApi.uploadMaterial('image',__dirname + '/2.jpg')
            reply={
                type: 'image',
                media_id: data.media_id
            }
        }else if(content === '6'){
            var data = yield wechatApi.uploadMaterial('video', path.join(__dirname, '/6.mp4'))
            reply = {
                type: 'video',
                title: '回复视频内容',
                description: '打个篮球玩玩',
                media_id: data.media_id
            }
        }else if(content === '7'){
            var data = yield wechatApi.uploadMaterial('image',__dirname + '/2.jpg')
            reply = {
                type: 'music',
                title: '回复音乐内容',
                description: 'play music',
                media_id: data.media_id,
                MUSIC_Url: 'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3',
                HQ_MUSIC_Url: 'http://mpge.5nd.com/2015/2015-9-12/66325/1.mp3'
            }
        }else if(content === '8'){
            var data = yield wechatApi.uploadMaterial('image',__dirname + '/2.jpg',{type:'image'})
            reply={
                type: 'image',
                media_id: data.media_id
            }
        }else if(content === '9'){
            var data = yield wechatApi.uploadMaterial('video', path.join(__dirname, '/6.mp4'),{type:'video',description:'{"title":"jheolloe","introduction":"never give up"}'})
            reply = {
                type: 'video',
                title: '回复视频内容',
                description: '打个篮球玩玩',
                media_id: data.media_id
            }
        }
        this.body = reply
    }
    yield next
}   