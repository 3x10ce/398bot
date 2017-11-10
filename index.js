
let SakuyaBot = require('./src/SakuyaBot')
let SakuyaDb = require('./src/SakuyaDb')
let Twitter = require('twitter')
let TwitterClient = require('./src/TwitterClient')
let FollowCrawler = require('./src/FollowingCrawler')
let MongoDb = require('mongodb').Db
let MongoServer = require('mongodb').Server
let Scheduler = require('node-schedule')

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
Scheduler.scheduleJob({
  hour: 0,
  minute: 0
}, () => {
  sakuyaBot.daily_work(new Date())
})

let autoRemove = new FollowCrawler(client)
autoRemove.start()


// heap log dump
const PROFILE_DUMP_INTERVAL = 10000
setInterval( (() => {
  let cpuInfoPrev = process.cpuUsage()
  let prevDate = new Date()
  return () => {
    let now = new Date()
    let elapsed = ( now - prevDate ) * 1000
    let cpuInfo = process.cpuUsage()
    let cpuUserPer = (cpuInfo.user - cpuInfoPrev.user) * 100 / elapsed
    let cpuSystemPer = (cpuInfo.system - cpuInfoPrev.system) * 100 / elapsed
    logger.info(`CPU user: ${cpuUserPer.toFixed(2)}% system: ${cpuSystemPer.toFixed(2)}%`)

    let memoryInfo = process.memoryUsage()
    logger.info(`MEMORY app_used: ${memoryInfo.rss} v8_total: ${memoryInfo.heapTotal} v8_used: ${memoryInfo.heapUsed}`)
    
    cpuInfoPrev = cpuInfo
    prevDate = now
  }
})(), PROFILE_DUMP_INTERVAL)
