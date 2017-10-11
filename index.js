
let SakuyaBot = require('./src/SakuyaBot')
let SakuyaDb = require('./src/SakuyaDb')
let Twitter = require('twitter')
let TwitterClient = require('./src/TwitterClient')
let FollowCrawler = require('./src/FollowingCrawler')
let MongoDb = require('mongodb').Db
let MongoServer = require('mongodb').Server

// 環境変数よみこみ
require('dotenv').config()

// Twitter クライアントのinstance生成
let twitter = new Twitter ({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
})
let client = new TwitterClient(twitter)

// DB instance生成
let server = new MongoServer('localhost', 27017)
let db = new MongoDb('SakuyaBot', server, {safe: true})

let sdb = new SakuyaDb(db)

let sakuyaBot = new SakuyaBot(client, sdb)
sakuyaBot.start()

let autoRemove = new FollowCrawler(client)
autoRemove.start(5)

