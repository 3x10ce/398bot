'use strict'


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
  }

  /**
   * クエリを発行し、結果をPromiseで返却します。
   * @param query クエリ
   * @param value プレースホルダで置き換えるパラメータ
   * @return 実行結果を返却するPromise
   */
  _query (query, value) {
    return new Promise ((resolve, reject) => {
      connection.query( query, value, (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  /**
   * ユーザのドキュメントを作成します。
   * @param {UserObject} user TwitterのUser Object
   * @return insertの結果
   */
  createUser (user) {
    return this._query(
      'INSERT into users (id, nickname, lovelity) value (?, ?, ?) ;', 
      [user.id_str, ':NAME:さん', 5]
    )
  }

  /** 
   * ユーザデータを取得します。
   * @param {UserObject} user TwitterのUser Object
   * @return ユーザデータ
   */
  getUser (user) {
    return this._query(
      'SELECT * from users WHERE id = ?;',
      [user.id_str]
    ).then( (data) => { return data[0] })
  }

  /**
   * ユーザのドキュメントを更新します。
   * @param {UserObject} user TwitterのUser Object
   * @param {object} data 更新するデータのクエリ
   * @return updateの結果
   */
  _updateUser (user, data) {
    return this._query(
      'UPDATE users set ? WHERE id = ?;',
      [data, user.id_str]
    )
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
const mysql = require('mysql')
require('dotenv').config()
const connection = mysql.createConnection({
  host : process.env.mysql_server,
  user : process.env.mysql_user,
  password: process.env.mysql_password,
  database: process.env.mysql_database
})


// 接続
connection.connect()


let dm = new DataManager(connection)

// createUser
// dm.createUser(
//   {id_str: "00000000"}
// ).then((rows) => { console.log(rows) }
// ).catch((err) => { throw err })

// getUser
// dm.getUser(
//   {id_str: "00000000"}
// ).then((rows) => { console.log(rows) }
// ).catch((err) => { console.error(err) })

// updateUser
// dm._updateUser(
//   {id_str: "00000000"},
//   {lovelity: 10}
// ).then((rows) => { console.log(rows) }
// ).catch((err) => { console.error(err) })
/*
 * create table users ( id nvarchar(64) primary key, nickname nvarchar(32) default ':NAME:さん', birth_m int, birth_d int, lovelity int default 5 );
 * create table donates (id int primary key auto_increment, donatedAt datetime not null, userId nvarchar(64) not null, amount int not null)
 */