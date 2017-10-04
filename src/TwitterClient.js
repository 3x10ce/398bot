
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

  /**
   * idで指定したユーザをfollowする
   * @param {string} id 対象のUser ID
   * @return {Promise} 結果をresolve/rejectするPromiseオブジェクト
   */
  follow (id) {
    return this.twitter.post('friendships/create', {id: id})
  }

  /**
   * idで指定したユーザをremoveする
   * @param {string} id 対象のUser ID
   * @return {Promise} 結果をresolve/rejectするPromiseオブジェクト
   */
  remove (id) {
    return this.twitter.post('friendships/destroy', {id: id})
  }
}

module.exports = TwitterClient
