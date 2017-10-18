
/**
 * TwitterClient.js
 * Twitterをbotが利用しやすいようにwrapしたもの
 */

const TwitterClient = class {
  constructor (twitter) {
    this.twitter = twitter
  }

  /**
   * アカウントの有効状態を確認する
   * @return {promise} 
   */
  verifyCredentials () {
    return this.twitter.get('account/verify_credentials', {})
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
   * ツイートする
   * @param {string} text ツイート内容
   * @param {TweetObject} reply_to (optional) 返信先のツイート
   * @return {Promise} 結果をresolve/rejectするPromiseオブジェクト */
  tweet (text, reply_to) {
    let params = { status: text }
    if (reply_to) {
      params.text = '@' + reply_to.user.screen_name + ' ' + params.text
      params.in_reply_to_status_id = reply_to.id_str
    }
    return this.twitter.post('statuses/update', params)
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

  /** 
   * フォローしているユーザのIDを取得する
   * [hint] すべて取得しきれなかった場合、responseのnext_cursor_str,
   * previous_cursor_strを使って再リクエストすれば続きを取得できる。
   * @param {number} count (optional) 取得するユーザIDの数。未指定の場合は100。
   * @param {string} cursor (optional) ページング取得用のカーソル
   * @return {Promise} 結果をresolve/rejectするPromiseオブジェクト
   */
  getIds (count, cursor) {
    if (!count) count = 100
    let request_parameter = { count: count }
    if (cursor) request_parameter.cursor = cursor

    return this.twitter.get('friends/ids', request_parameter)
  }
  /**
   * 配列で渡されたユーザIDのフォロー状態を確認する
   * @param {[string]} ids ユーザIDの配列
   * @return {Promise} 結果をresolve/rejectするPromiseオブジェクト
   */
  getFriendships (ids) {
    return this.twitter.get('friendships/lookup', {user_id: ids.join(',')})
  }
}

module.exports = TwitterClient
