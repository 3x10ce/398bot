
let SakuyaBot = require('./src/SakuyaBot')
let Twitter = require('twitter')
let TwitterClient = require('./src/TwitterClient')
let FollowCrawler = require('./src/FollowingCrawler')

// 環境変数よみこみ
require('dotenv').config()

let twitter = new Twitter ({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
})
let client = new TwitterClient(twitter)

// let sakuyaBot = new SakuyaBot(client)
// sakuyaBot.start()

// client.getIds(10, '1510396014174031000').then((res) => console.dir(res)).catch((err) => console.dir(err))


let autoRemove = new FollowCrawler(client)
autoRemove.start(5)

