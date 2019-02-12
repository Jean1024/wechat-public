const Koa = require('koa');
const wechat = require('./wechat/g')
const config = {
    wechat: {
        token:"qiuzhilin",
        appID:"wx073a992a88e1356a",
        appScrect:"72fba66ce0195f15075451c775712496",
    }
}

const app = new Koa()

app.use(wechat(config.wechat))

app.listen(80, () => {
    console.log('App listening on port 80!');
});