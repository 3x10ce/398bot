
/* 各種モジュールのrequire */
let SakuyaBot = require('./src/SakuyaBot')
let DataManager = require('./src/DataManager')
let Twitter = require('twitter')
let FollowCrawler = require('./src/FollowingCrawler')
let MySQL = require('mysql')
let Scheduler = require('node-schedule')

let rand = require('./src/Randomizer')

let sakuyaReplies = require('./src/SakuyaReplies')

// 環境変数よみこみ
require('dotenv').config()

// ローカル検証時はTwitterをモックに差し替える
let TwitterClient = process.env.is_local ? require('./src/TwitterClient.local') : require('./src/TwitterClient')


// Twitter クライアントのinstance生成
console.log(Twitter)
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
const connection = MySQL.createConnection({
  host : process.env.mysql_server,
  user : process.env.mysql_user,
  password: process.env.mysql_password,
  database: process.env.mysql_database
})
connection.connect()
let dataManager = new DataManager(connection)

let sakuyaBot = new SakuyaBot(client, dataManager, logger, rand)
sakuyaBot.addReactionPlugin(sakuyaReplies)

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
const PROFILE_DUMP_INTERVAL = 60000
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
