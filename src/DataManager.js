'use strict'


/**
 * データストアとの中間層として機能するデータ管理クラスです。
 * SakuyaBotが保持するユーザデータの管理を行い、バックエンドでデータストアとの同期を実行します。
 */
const DataManager = class {
  /**
   * 生成時、バックエンドのデータストアからデータを取得します。
   */
  constructor () {
    
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
const mysql = require('mysql')
const connection = mysql.createConnection({
  host : 'localhost',
  user : 'sakuya',
  password: 'sakuyabot',
  database: 'sakuyabot'
})


// 接続
connection.connect()

// userdataの設定
connection.query('INSERT into users (id) value (?) ;', ['0000'], function (err, rows, fields) {
  if (err) { console.log('err: ' + err) } 
  else {console.log(rows,fields)}
  /*
   * OkPacket {
   *   fieldCount: 0,
   *   affectedRows: 1,
   *   insertId: 0,
   *   serverStatus: 2,
   *   warningCount: 0,
   *   message: '',
   *   protocol41: true,
   *   changedRows: 0 }
   */
})


// userdataの設定
connection.query('SELECT * from users;', function (err, rows, fields) {
  if (err) { console.log('err: ' + err) } 
  else {console.log(rows,fields)}
  /**
   * RowDataPacket {
   *   id: '0000',
   *   nickname: ':NAME:さん',
   *   birth_m: null,
   *   birth_d: null,
   *   lovelity: 5 } ] [ FieldPacket {
   *   catalog: 'def',
   *   db: 'sakuyabot',
   *   table: 'users',
   *   orgTable: 'users',
   *   name: 'id',
   *   orgName: 'id',
   *   charsetNr: 33,
   *   length: 192,
   *   type: 253,
   *   flags: 20483,
   *   decimals: 0,
   *   default: undefined,
   *   zeroFill: false,
   *   protocol41: true }
   */
})

/*
 * create table users ( id nvarchar(64) primary key, nickname nvarchar(32) default ':NAME:さん', birth_m int, birth_d int, lovelity int default 5 );
 * create table donates (id int primary key auto_increment, donatedAt datetime not null, userId nvarchar(64) not null, amount int not null)
 */