
/**
 * TwitterClient.mock.js
 * Twitterをbotが利用しやすいようにwrapしたもの
 * ★ローカルの検証用に利用します。
 */
let mockUserData = {
  name: "398Bot",
  screen_name: "398Bot",
  id_str: "00000000"
}

const TwitterClient = class {
  constructor (twitter) {
    this.twitter = twitter
  }

  /**
   * アカウントの有効状態を確認する
   * @return {promise} 
   */
  verifyCredentials () {
    return Promise.resolve(mockUserData)
  }

  /**
   * UserStreamのlistenを開始する
   * @param {object} on コールバック関数を格納したオブジェクト
   */
  openUserStream (on) {

    // 標準入力をツイートデータとして与えられるようにする
    process.stdin.resume()
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', function(chunk) {
      // とりあえずshellからの入力しか想定しないため、chunkをそのままツイートにする
      let tweet = {
        text: chunk,
        user: {
          id_str: process.env.tester_adminUserId, 
          screen_name: process.env.tester_adminUserScreenName,
          name: process.env.tester_adminUserName}
      }
      on.data(tweet)
    })
    process.stdin.on('end', function() {
    })

    // stream.on('error', on.error)
    // stream.on('event', on.event)
  }

  /** 
   * ツイートする
   * @param {string} text ツイート内容
   * @param {TweetObject} reply_to (optional) 返信先のツイート
   * @return {Promise} 結果をresolve/rejectするPromiseオブジェクト */
  tweet (text, reply_to) {
    let params

    // reply_toがある場合は対象ツイートへのリプライを投げる
    if (reply_to) {
      params = {
        status: '@' + reply_to.user.screen_name + ' ' + text,
        in_reply_to_status_id: reply_to.id_str
      }
    } else {
      params = { status: text }
    }
    // ツイートした結果は標準出力に吐く
    process.stdout.write(`[TWEET] ${params.status} [reply_to: ${params.in_reply_to_status_id}]`)
    return Promise.resolve(params)
  }

  /**
   * idで指定したユーザをfollowする
   * @param {string} id 対象のUser ID
   * @return {Promise} 結果をresolve/rejectするPromiseオブジェクト
   */
  follow (id) {
    process.stdout.write(`[FOLLOW] ${id}`)
    return Promise.resolve(id)
  }

  /**
   * idで指定したユーザをremoveする
   * @param {string} id 対象のUser ID
   * @return {Promise} 結果をresolve/rejectするPromiseオブジェクト
   */
  remove (id) {
    process.stdout.write(`[REMOVE] ${id}`)
    return Promise.resolve(id)
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

    process.stdout.write(`[CRAWL] count: ${count}, cursor: ${cursor}`)
    return Promise.resolve({})
  }
  /**
   * 配列で渡されたユーザIDのフォロー状態を確認する
   * @param {[string]} ids ユーザIDの配列
   * @return {Promise} 結果をresolve/rejectするPromiseオブジェクト
   */
  getFriendships (ids) {
    /** @todo FollowingCrawlerもmock化するなら、以下もmockメソッドを実装する。*/
    return Promise.resolve(ids)
  }
}

module.exports = TwitterClient

  
