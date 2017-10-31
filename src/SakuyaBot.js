

'use strict'

const SakuyaBot = class {
  constructor (client, db, logger, rand) {
    this.client = client
    this.db = db
    this.logger = logger
    this.rand = rand
    

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
      data: this.read.bind(this),
      error: (error) => console.log(error),
      event: this.receive.bind(this)
    })
  }

  // 毎日 0時に実行する
  daily_work (today) {
    // 秒単位のずれで日付が前後することを防ぐため 12時間分加算する
    today = new Date(today.getTime() + 43200)

    let m = today.getMonth() + 1
    let d = today.getDate()
    this.client.tweet(`${m}月 ${d}日になったわね。`)
  }

  read (tweet) {
    this.logger.info(`reading tweet @${tweet.user.screen_name}: ${tweet.text}`)
    return new Promise((resolve,reject) => {

      // 自身以外へのrepliesを除外する
      let replies = (tweet.text.match(/@[0-9a-zA-Z]+/g) || []).filter((u) => u !== `@${this.screen_name}`)
      if (replies.length) reject() 
      
      // 先頭が@でないツイートには反応しない
      if (!tweet.text.startsWith('@')) reject() 
      
      resolve()
    }).then(() => {
      // ユーザの情報をDBから取得する
      return this.db.getUser(tweet.user)

    // ユーザ情報を作成する
    }).then( (user) => {
      if (user !== null) {
        return new Promise((resolve) => {
          resolve(user)
        })
      } else {
        return this.db.createUser(tweet.user)
      }
    }).then( (userdata) => {
      // createしていた場合は初期値のuser情報を設定
      if( userdata.ops !== undefined) userdata = userdata.ops[0]
      return new Promise(() => {
        
        // 返信する
        if (tweet.text.match(/テスト/)) {
          return this.client.tweet('テスト返信', tweet)

        } else if (tweet.text.match(/こんにちは/)) {
          return this.client.tweet(`${userdata.nickname}さん、こんにちは。`, tweet)

        } else if (tweet.text.match(/紅茶/)) {
          let tea = this.teaSelector(tweet.user)
          return this.client.tweet(`はい、${tea.name}を淹れてみましたわ。花言葉は${tea.language_of}ね。召し上がれ。`, tweet)

        } else if (tweet.text.match(/誕生日/)) {
          let [, m, d] = (tweet.text.match(/誕生日は([12][0-9])月([1-3][0-9])日/) || [] )

          if( m !== undefined && d !== undefined) {
            return this.db.setBirthday(tweet.user, m, d)
              .then(() => {
                return this.client.tweet(`あなたの誕生日は${m}月${d}日なのね。`, tweet)
              })
          }
        } else if (tweet.text.match(/献血/)) {
          let donated = this.rand.genInt(200) + 200
          return this.db.addDonateLog(tweet.user, donated)
            .then( () => {
              return this.client.tweet(`あなたの血を ${donated} mL頂いたわ。お嬢様もきっと喜ぶと思うわ。どうもありがとう。`, tweet)
            })
        }

      })
    }).catch((err) => {
      if (err !== undefined) {
        this.logger.error(`error! : ${err}`)
        this.logger.trace(err.trace)
      }
    })

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