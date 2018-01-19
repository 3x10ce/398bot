

'use strict'

const SakuyaBot = class {
  constructor (client, db, logger, rand) {
    this.client = client
    this.db = db
    this.logger = logger
    this.rand = rand
    this.today = {
      month: new Date().getMonth() + 1,
      day:   new Date().getDate()
    }

    // ツイートテキストを引数として、リアクションを返却する関数軍を
    // SakuyaBotに任意に組み込むことができる機能を提供する。
    // これを、リアクションプラグインと呼称し、
    // SakuyaBotの汎用的な口上を組み込む仕組みとして利用する。
    this.reaction_plugins = []
    
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
      event: this.receive.bind(this),
      error: (error) => {
        console.error(error)
        this.logger.error(error)
      }
    })
  }

  /**
   * リアクションプラグインを組み込む
   * @param func リアクションプラグイン
   */
  addReactionPlugin (plugin) {
    this.reaction_plugins.push(plugin)
  }

  // 毎日 0時に実行する
  daily_work (newDay) {
    newDay = new Date(newDay.getTime() + 43200 * 1000)

    this.today = {
      month: newDay.getMonth() + 1,
      day:   newDay.getDate()
    }

    return this.db.sumDonation().then( (amount) => {
      return this.client.tweet(`${this.today.month}月 ${this.today.day}日になったわね。 先日は ${amount} ml の献血をいただきましたわ。`)      
    }).then(() => {
      return this.db.stashDonatedLog()
    }).then(() => {
      return this.db.clearCelebratedBirthdayFlags()
    }).catch((err) => {
      this.logger.error(err)
      this.logger.trace(err.trace)
    })
  }

  read (tweet) {
    this.logger.info(`[${tweet.id_str}] @${tweet.user.screen_name}: ${tweet.text}`)
    let callAs // ユーザへの呼び名

    return new Promise((resolve,reject) => {
      // リツイートは除外
      if (tweet.retweeted_status) reject()

      // リツイートを除外して残るのは、followしている人のタイムラインのみになるはず。
      resolve()

    }).then(() => {
      // ユーザの情報をDBから取得する
      return this.db.getUser(tweet.user)

    // ユーザ情報を作成する
    }).then( (user) => {
      this.logger.debug(user)
      if (user !== undefined) {
        return Promise.resolve(user)
      } else {
        return this.db.createUser(tweet.user)
      }
    }).then( (userdata) => {
      this.logger.debug(userdata)
      // 呼び名設定
      callAs = this._replaceNN(userdata.nickname, tweet.user)
      this.logger.debug('call as : ' + callAs)

      return new Promise((resolve, reject) => {

        // 誕生日お祝いツイートのみ、自身へのリプライでなくても反応する
        if (userdata.birth_m && userdata.birth_d &&
          !userdata.celebratedBirthday &&
          userdata.birth_m === this.today.month &&
          userdata.birth_d === this.today.day) {
          return this.db.setCelebratedBirthdayFlag(tweet.user)
            .then(() => resolve(`そういえば、今日がお誕生日らしいわね。おめでとう、<?CALLAS>。`))
        }

        // 自身以外へのrepliesを除外する
        let replies = (tweet.text.match(/@[0-9a-zA-Z]+/g) || []).filter((u) => u !== `@${this.screen_name}`)
        if (replies.length) reject() 
        
        // 先頭が@でないツイートには反応しない
        if (!tweet.text.startsWith('@')) reject() 
        
        // 返信する
        if (tweet.text.match(/こんにちは/)) {
          resolve(`<?CALLAS>、こんにちは。`)
  
        } else if (tweet.text.match(/紅茶/)) {
          let tea = this.teaSelector(tweet.user)
          let message = this.rand.choice([
            `はい、${tea.name}を淹れてみましたわ。花言葉は${tea.language_of}ね。召し上がれ。`,
            `今日のお茶は${tea.name}よ。花言葉は${tea.language_of}ね。どうぞ召し上がれ。`
          ])
          resolve(message, tweet)
  
        } else if (tweet.text.match(/誕生日は[0-9]+月[0-9]+日/)) {
          let [, m, d] = (tweet.text.match(/誕生日は([12]?[0-9])月([1-3]?[0-9])日/) || [] )
  
          if( m !== undefined && d !== undefined) {
  
            // 不正な日付を与えられた時にガードする
            let dayOfMonth = [31,29,31,30,31,30,31,31,30,31,30,31][Number(m) - 1]
            if ( m > 0 && m <= 12 &&
                 d > 0 && d <= dayOfMonth) {
  
              return this.db.setBirthday(tweet.user, m, d)
                .then(() => {
                  resolve(`あなたの誕生日は${m}月${d}日なのね。覚えたわ。`)
                })
            } else {
              resolve(null)
            }
          }
        } else if (tweet.text.match(/「(.+)」((と|って)呼んで)/)) {
          let newNickname = (tweet.text.match(/「(.+)」/) || [])[1]
          if (newNickname !== undefined) {
            return this.db.setNickname(tweet.user, newNickname)
              .then( () => {
                callAs = this._replaceNN(newNickname, tweet.user)
                resolve(`<?CALLAS>…って呼べばいいのね。`)
              })

          } else {
            resolve(null)
          }
        } else if (tweet.text.match(/献血/)) {
          return this.db.userIsDonated(tweet.user)
            .then( (donated) => {
              if (!donated) {
                // 献血していない場合
                let donateAmount = this.rand.genInt(200) + 200
                return this.db.addDonateLog(tweet.user, donateAmount)
                  .then( () => (resolve(`あなたの血を ${donateAmount} mL頂いたわ。お嬢様もきっと喜ぶと思うわ。どうもありがとう。`) ))
  
              } else {
                // 献血している場合
                resolve(`献血は1日1回までよ。`)
              }
            })
        } else if (tweet.text.match(/(俺|僕|私|(わ|あ)たし)の(こと|事)どう(思|おも)う(？|\?)/)) {
          // 整数値で管理する好感度は、表記上は0.05刻みの少数値として表記する。
          // 現在はひとまず、最小値0.00(0), 最大値5.00(100)としておく。
          let normalized_lovelity = 
            userdata.lovelity > 100 ? 100 :
              userdata.lovelity < 0 ?   0 :
                userdata.lovelity
          let screen_lovelity = normalized_lovelity * 0.05
          
          resolve(`あなたへの好感度: ${screen_lovelity.toFixed(2)}`)

        } else {
          // リアクションプラグインから応答を返せる場合は応答する
          for (let plugin of this.reaction_plugins) {
            let reaction = plugin(tweet, userdata)
            if (reaction) {
              // 応答をランダムに選択
              let reply = this.rand.choice(reaction.reply_patterns)
              
              // 好感度の増減がある場合は増減させる
              return ( reaction.lovelity 
                ? this.db.setLovelity(tweet.user, userdata.lovelity + reaction.lovelity)
                : Promise.resolve(null)
              ).then( () => {
                resolve(reply)
              })
            }
          }

          resolve(null)
        }
      })
      
    }).then((reply) => {
      // ツイートがある場合はツイートする
      if (reply !== null) {
        // パラメータの置き換え
        reply = reply.replace(/<\?CALLAS>/g, callAs)
        
        this.client.tweet(reply, tweet).then((result) => {
          
          // 何か応答を行なった場合はログに残す
          if (result === null) return
          this.logger.debug(`[${result.id_str}]response: ${result.text}`)
          // console.log(result)
        })
      }
    }).catch((err) => {
      if (err !== undefined) {
        this.logger.error(`error! : ${err}`)
        this.logger.trace(err.trace)
      }
    })

  }
    

  receive (event) {

    return new Promise((resolve, reject) => {
      // 自身で発生したイベントは無視する
      if (event.source.screen_name === this.screen_name) reject()
      resolve()
    }).then(() => {
      this.logger.info(`received event @${event.source.screen_name}: ${event.event}.`)
      
      // イベントタイプを調べる
      switch (event.event) {
      case 'follow':
        // フォローイベントがきたらフォロー返しをする
        // (フォロー返し条件: Follower数がFollow数の15%以上)
        if (event.source.friends_count * 0.15 < event.source.followers_count) 
          return this.client.follow(event.source.id_str)
        else return null

      default:
        return null
      }
    }).then((result) => {
      switch (event.event) {
      case 'follow':
        this.logger.info(`re-follow: @${event.source.screen_name}`)
        break
        
      }

      return result
    })
  }

  /******** 以降はprivate methodとして運用 ********/

  /**
   * 与えられた文字列をニックネームとして文字置換する
   * @param nickname {string} ニックネーム文字列
   * @param user {UserObject} ユーザオブジェクト
   * @return 置換後のニックネーム文字列
   */
  _replaceNN (nickname, user) {
    return nickname
      .replace(':NAME:', user.name.split(/[@＠]/)[0])
      .replace(':NAME_ORG:', user.name.replace(/[@＠]/, ' at '))
      .replace('[a-z]+://', '[url]')
  }
}

module.exports = SakuyaBot