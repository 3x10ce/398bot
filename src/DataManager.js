'use strict'

let AWS = require('aws-sdk')
let S3 = new AWS.S3()
/**
 * データストアとの中間層として機能するデータ管理クラスです。
 * SakuyaBotが保持するユーザデータの管理を行い、バックエンドでデータストアとの同期を実行します。
 */
const DataManager = class {
  /**
   * 生成時、バックエンドのデータストアからデータを取得します。
   */
  constructor (db) {
    
    this.db = db
    this.users = {}
    this.donates = {}
    this.readyToAccess = false

    // S3からデータを取得する
    Promise.all([
      S3.getObject({
        Bucket: 'sakuyabot-users',
        Key: 'users.json',
      }).promise(),
      S3.getObject({
        Bucket: 'sakuyabot-users',
        Key: 'donates.json',
      }).promise()
    ]).then( (results) => {
      // 取得完了時の処理
      this.users = results[0].Body.toString('utf-8')
      this.donates = results[1].Body.toString('utf-8')
      this.readyToAccess = true

    }).catch( (e) => {
      // 失敗時はエラーをスローする
      throw e
    })
  }

  /**
   * バックエンドのデータストアにクエリを発行します。
   * @param query クエリ文
   */
  _executeQuery (query) {
    /** @todo データストアにデータを格納する */
    return query
  }

  /**
   * ユーザのドキュメントを作成します。
   * @param {UserObject} user TwitterのUser Object
   * @return insertの結果
   */
  createUser (user) {
    /** @todo 関数の実装 */
    return user
  }

  /** 
   * ユーザデータを取得します。
   * @param {UserObject} user TwitterのUser Object
   * @return ユーザデータ
   */
  getUser (user) {
    /** @todo 関数の実装 */
    return user
  }

  /**
   * ユーザのドキュメントを更新します。
   * @param {UserObject} user TwitterのUser Object
   * @param {object} data 更新するデータのクエリ
   * @return updateの結果
   */
  _updateUser (user, data) {
    /** @todo 関数の実装 */
    return [user, data]
  }

  /**
   * 指定したIDのユーザにニックネームを設定します。
   * @param {UserObject} user TwitterのUser Object
   * @param {string} nickname ニックネーム
   * @return updateの結果
   */
  setNickname (user, nickname) {
    /** @todo 関数の実装 */
    return [user, nickname]
  }


  /**
   * 指定したIDのユーザの誕生日を設定します。
   * @param {UserObject} user TwitterのUser Object
   * @param {number} month 誕生月
   * @param {number} day 誕生日
   * @return updateの結果
   * [hint]月と日のみで管理する。Date.yearは2000でMASKする。
   */
  setBirthday (user, month, day) {
    /** @todo 関数の実装 */
    return [user, month, day]
  }

  /**
   * 指定したIDのユーザの好感度を増減します。
   * @param {UserObject} user TwitterのUser Object
   * @param {number} incremental 増減量
   * @return updateの結果
   */
  increaseLovelity (user, incremental) {
    /** @todo 関数の実装 */
    return [user, incremental]
  }

  /**
   * 指定したIDのユーザの献血履歴を残します。
   * @param {UserObject} user 
   * @param {number} 献血量
   * @return updateの結果
   */
  addDonateLog(user, amount) {
    /** @todo 関数の実装 */
    return [user, amount]
  }

  /**
   * 指定したユーザが献血していたかどうかを調べます。
   * @param {UserObject} user
   * @return 献血している場合はtrue, それ以外はfalse
   */
  userIsDonated(user) {
    /** @todo 関数の実装 */
    return user
  }

  /**
   * 献血履歴テーブルから合計量を集計します。
   * @return {number} 献血量
   */
  sumDonation () {
    /** @todo 関数の実装 */
    return false
  }

  /**
   * 合計献血量を日別献血履歴に退避し、
   * 献血履歴テーブルをクリアします。
   * @return delete結果
   */
  stashDonatedLog () {
    /** @todo 関数の実装 */
    return false
  }
}

module.exports = DataManager


// test
require('dotenv').config()

// get object
/*
S3.getObject({
  Bucket: 'sakuyabot-users',
  Key: 'users.json',
}).promise()
  .then(function (data) {console.log(data.Body.toString('utf-8'))})
  .catch(function (err) {console.error(err)})
*/


// put object
/*
S3.putObject({
  Bucket: 'sakuyabot-users',
  Key: 'donates.json',
  ContentType: 'application/json',
  Body: '{}'
}, function (err, data) {
  if( err ) console.error(err)
  else console.log(data)
})
*/