
/**
 * TwitterClient.js
 * Twitterをbotが利用しやすいようにwrapしたもの
 */

const TwitterClient = class {
  constructor (twitter) {
    this.twitter = twitter
  }

  /**
   * UserStreamのlistenを開始する
   * @param {object} on コールバック関数を格納したオブジェクト
   */
  openUserStream (on) {
    this.twitter.stream('user', (stream) => {
      stream.on('data', on.data)
      stream.on('error', on.error)
      stream.on('event', on.event)
    })
  }
}

module.exports = TwitterClient
