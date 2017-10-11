'use strict'

const SakuyaBot = class {
  constructor (client) {
    this.client = client
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
    // 返信する
    if (tweet.text.match(/テスト/)) {
      this.client.tweet('テスト返信', tweet.user)
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