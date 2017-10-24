
let SakuyaBot = require('./src/SakuyaBot')
let SakuyaDb = require('./src/SakuyaDb')
let Twitter = require('twitter')
let TwitterClient = require('./src/TwitterClient')
let FollowCrawler = require('./src/FollowingCrawler')
let MongoDb = require('mongodb').Db
let MongoServer = require('mongodb').Server

let rand = require('./src/Randomizer')

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

// Logger
let log4js = require('log4js')
log4js.configure('log4js.conf', { reloadSecs: 600 })

let logger = log4js.getLogger('system')


// DB instance生成
let server = new MongoServer(process.env.mongo_server, process.env.mongo_port)
let db = new MongoDb(process.env.mongo_database, server, {safe: true})

let sdb = new SakuyaDb(db)

let sakuyaBot = new SakuyaBot(client, sdb, logger, rand)
sakuyaBot.start()

let autoRemove = new FollowCrawler(client)
autoRemove.start()

