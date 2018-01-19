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
      this.db.query( query, value, (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  /**
   * トランザクションを生成します。
   * @param transaction トランザクション内で実行する処理(Promise)
   */
  _transaction (transaction) {
    return new Promise ( (resolve, reject) => {
      // トランザクション開始
      this.db.beginTransaction( (err) => {
        if (err) throw err
        else {
          // トランザクション処理
          transaction()
            .then ( (data) => this.db.commit( (err) => err ? reject(err) : resolve(data) ))
            .catch( (err) => this.db.rollback( () => { throw err }) ) 
        }
      })
    })
  }

  /**
   * ユーザのドキュメントを作成します。
   * @param {UserObject} user TwitterのUser Object
   * @return 作成されたユーザドキュメント
   */
  createUser (user) {
    return this._transaction( () => {
      return this._query(
        'INSERT into users (id, nickname, lovelity) value (?, ?, ?) ;', 
        [user.id_str, ':NAME:さん', 5]
      ).then( () => this.getUser(user))
    })
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
    return this._updateUser(user, {nickname: nickname})
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
    return this._updateUser(user, {birth_m: month, birth_d: day})
  }

  /**
   * 指定したIDのユーザの好感度を設定します。。
   * @param {UserObject} user TwitterのUser Object
   * @param {number} lovelity 好感度値
   * @return updateの結果
   */
  setLovelity (user, lovelity) {
    return this._updateUser(user, {lovelity: lovelity})
  }

  /**
   * 指定したIDのユーザの献血履歴を残します。
   * @param {UserObject} user 
   * @param {number} 献血量
   * @return updateの結果
   */
  addDonateLog(user, amount) {
    return this._query(
      'INSERT into donates (userId, donatedAt, amount) value (?, NOW(), ?);',
      [user.id_str, amount]
    )
  }

  /**
   * 指定したユーザが献血していたかどうかを調べます。
   * @param {UserObject} user
   * @return 献血している場合はtrue, それ以外はfalse
   */
  userIsDonated(user) {
    return this._query(
      'SELECT count(*) as DC from donates WHERE userId = ? and donatedAt BETWEEN concat(CURDATE(), " 00:00:00") and concat(CURDATE(), " 23:59:59");',
      [user.id_str]
    ).then( (data) => data[0].DC > 0 )
  }

  /**
   * 献血履歴テーブルから合計量を集計します。
   * @return {number} 献血量
   */
  sumDonation () {
    return this._query(
      'SELECT sum(amount) as Total from donates;'
    ).then( (data) => ( data[0].Total || 0 ) )
  }

  /**
   * 合計献血量を日別献血履歴に退避し、
   * 献血履歴テーブルをクリアします。
   * @return delete結果
   */
  stashDonatedLog () {
    return this._transaction( () => {
      return this.sumDonation()
        .then( (sum) => {
          // 合計量を昨日の分として donatesByDate に挿入
          let yesterday = new Date(Date.now() - 86400 * 1000).toISOString().slice(0,10)
          return this._query( 'INSERT into donatesByDate (donatedAtDate, amount) value (?, ?)', [yesterday, sum] )
        }).then( () => 
          this._query( 'DELETE from donates;')
        )
    })
  }
  
  /** 
   * 指定したユーザの誕生日お祝いフラグを設定します。
   * @param {UserObject} user
   * @return update結果
   */
  setCelebratedBirthdayFlag (user) {
    return this._query(
      'UPDATE users set celebratedBirthday = true where id = ?;',[user.id_str])
  }
  /** 
   * 誕生日お祝いフラグを初期化します。
   * @return update結果
   */
  clearCelebratedBirthdayFlags () {
    return this._query(
      'UPDATE users set celebratedBirthday = false where celebratedBirthday = true;')
  }
}

module.exports = DataManager

// let MySQL = require('mysql')
// require('dotenv').config()

// const connection = MySQL.createConnection({
//   host : process.env.mysql_server,
//   user : process.env.mysql_user,
//   password: process.env.mysql_password,
//   database: process.env.mysql_database
// })
// connection.connect()

// let dm = new DataManager(connection)
// dm.sumDonation()
//   .then((rows) => { console.log(rows) })
//   .catch((err) => { throw err })

// 献血テーブルに履歴を大量投入する
// let loop = function (i) {
//   return dm._query(
//     'INSERT into donates (userId, donatedAt, amount) value (?, from_unixtime(?), ?);',
//     [
//       "00000000".concat().slice(-8), 
//       (new Date(Date.now()).getTime()) / 1000 - Math.floor(Math.random() * 40000),
//       Math.floor(Math.random() * 200)
//     ]
//   ).then( () => { i%1000 || console.log(i); i >= 100 || loop(i+1)} )
// }
// loop(0)

// createUser
// dm.userIsDonated(
//   {id_str: "00000000"}
// ).then((rows) => { console.log(rows) }
// ).catch((err) => { throw err })


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



/** 
 * @todo 以下のメモ書きは後ほど実装に利用する。
 * 
 * table の create
 * create table users ( id nvarchar(64) primary key, nickname nvarchar(32) default ':NAME:さん', birth_m int, birth_d int, lovelity int default 5, celebratedBirthday bool);
 * create table donates (id int primary key auto_increment, donatedAt datetime not null, userId nvarchar(64) not null, amount int not null);
 * create table donatesByDate ( donatedAtDate date primary key, amount int not null );
 * create table cerebrateUsers ( id nvarchar(64) primary key ) 
 * 今日の献血量合計を取得
 * select sum(amount), date(donatedAt) as donatedAtDate from donates where donatedAt >= CURDATE() group by donatedAtDate;
 * 
 * 昨日の献血量合計を取得
 * select sum(amount), date(donatedAt) as donatedAtDate from donates where donatedAt < CURDATE() and donatedAt >= DATE_SUB( CURDATE(), INTERVAL 1 day ) groupby donatedAtDate;
 * 
 * 直近5日の合計を取得
 * select sum(amount), date(donatedAt) as donatedAtDate from donates where donatedAt >= DATE_SUB( CURDATE(), INTERVAL 4 day ) group by donatedAtDate;
 * 
 */

