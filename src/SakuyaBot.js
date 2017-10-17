

'use strict'

const SakuyaBot = class {
  constructor (client, db) {
    this.client = client
    this.db = db

    this.teaSelector = require('./Teapot.js')
  }
  
  start () {
    console.log(`Hello World!`)
    this.client.openUserStream({
      data: this.read,
      error: (error) => console.log(error),
      event: this.receive
    })
  }

  read (tweet) {
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
    }
  }

  receive (event) {
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