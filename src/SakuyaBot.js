

'use strict'

const SakuyaBot = class {
  constructor (client, db, logger) {
    this.client = client
    this.db = db
    this.logger = logger

    this.teaSelector = require('./Teapot.js')
    
    // 起動時にアカウントの有効性を確認する
    this.client.verifyCredentials().then(
      (res) => {
        this.logger.info('Account verification succeed.')
        this.name = res.name
        this.screen_name = res.screen_name
        this.id = res.id_str
      }
    ).catch(
      () => {
        this.logger.fatal('Account verification failed.')
      }
    )
  }
  
  start () {
    this.logger.info('SakuyaBot started.')
    this.client.openUserStream({
      data: this.read,
      error: (error) => console.log(error),
      event: this.receive
    })
  }

  read (tweet) {
    this.logger.info(`reading tweet @${tweet.user.screen_name}: ${tweet.text}`)

    // 自身以外へのrepliesを除外する
    let replies = (tweet.text.match(/@[0-9a-zA-Z]+/g) || []).filter((u) => u !== `@${this.screen_name}`)
    if (replies.length) return
    
    // 先頭が@でないツイートには反応しない
    if (!tweet.text.startsWith('@')) return
    
    // ユーザの情報をDBから取得する
    let userdata
    this.db.getUser(tweet.user.id).then( (user) => {
      userdata = user
    })
    if (userdata === null) {
      this.db.createUser(tweet.user).then( (user) => {
        userdata = user
      })
    }

    // 返信する
    if (tweet.text.match(/テスト/)) {
      this.client.tweet('テスト返信', tweet.user)

    } else if (tweet.text.match(/こんにちは/)) {
      this.client.tweet(`${userdata.nickname}さん、こんにちは。`, tweet.user)

    } else if (tweet.text.match(/紅茶/)) {
      let tea = this.teaSelector()
      this.client.tweet(`はい、${tea.name}を淹れてみましたわ。花言葉は${tea.language_of}ね。召し上がれ。`, tweet.user)

    } else if (tweet.text.match(/誕生日/)) {
      let [, m, d] = (tweet.text.match(/誕生日は([12][0-9])月([1-3][0-9])日/) || [] )

      if( m !== undefined && d !== undefined) {
        this.client.tweet(`あなたの誕生日は${m}月${d}日なのね。`, tweet.user)
        this.db.setBirthday(tweet.user, m, d)
      }
    }
  }

  receive (event) {
    this.logger.info(`received event @${event.target.screen_name}: ${event.event}.`)

    // フォローイベント
    if (event.event === 'follow') {
      // Follower数がFollow数の15%以上であればフォローする
      if (event.target.friends_count * 0.15 < event.target.followers_count) {
        this.client.follow(event.target.id_str)
      }
    }
  }
}

module.exports = SakuyaBot