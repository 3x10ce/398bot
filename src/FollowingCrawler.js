'use strict'

/**
 * 5分周期でフォロー一覧をクロールし、フォローしていないユーザを自動リムーブする
 * @param {Twitter} client 
 */
const FollowingCrawler = class {
  constructor (client) {
    this.client = client
    this.intervalId = null
    this.next_cursor = null
  }
  
  /**
   * フォロー一覧のクロールを開始する
   * @param interval_sec {number} (optional) クロール間隔(秒) (default: 300)
   */
  start (interval_sec) {
    if (this.intervalId !== null) return
    if (!interval_sec) interval_sec = 300

    this.intervalId = setInterval( () => {
      // フォロー一覧から100件取得
      this.client.getIds(10, this.next_cursor)
        .then( (following_users) => {
          // 次のカーソルを設定
          this.next_cursor = following_users.next_cursor
          
          // 各ユーザのフォロー関係を調べる
          let ids = following_users.ids
          console.log( "crawl: " + ids.join(','))
          return this.client.getFriendships(ids)
        }).then( (friendship_status) => {

          // フォローしていないユーザを絞り出す
          let notFollowed = 
            friendship_status.filter( (v) => {
              !v.connections.includes('followed_by')
            }).map( (v) => v.id_str )
          console.log(notFollowed)
          
          // リムーブする
          notFollowed.forEach((v) => {
            this.client.remove(v)
              .then( (res) => console.log(res))
              .catch( (err) => console.error(err))
          })
          
        }).catch( (err) => console.error(err))
    }, interval_sec * 1000)
  }

  /**
   * クロールを中止します
   */
  stop () {
    if (this.intervalId === null) return
    clearInterval(this.intervalId)
    this.intervalId = null
  }
}

module.exports = FollowingCrawler