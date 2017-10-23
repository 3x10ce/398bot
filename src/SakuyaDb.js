
let SakuyaDb = class {
  constructor (db) {
    this.db = db
    this.isOpen = false
    this.db.open( (err) => {
      if (err) {
        console.error(err)
        return
      }

      this.isOpen = true
      console.log('MongoDB Open.')
    })
  }

  /**
   * ユーザのドキュメントを作成します。
   * @param {UserObject} user TwitterのUser Object
   * @return insertの結果
   */
  createUser (user) {
    let collection = this.db.collection('users')
    return collection.insertOne({
      '_id': user.id_str,
      'name': user.name,
      'nickname': ':NAME:さん',
      'birthday': null,
      'lovelity': 5
    })
  }

  /** 
   * ユーザデータを取得します。
   * @param {UserObject} user TwitterのUser Object
   * @return ユーザデータ
   */
  getUser (user) {
    let collection = this.db.collection('users')
    return collection.findOne({ '_id': user.id_str})
  }

  /**
   * ユーザのドキュメントを更新します。
   * @param {UserObject} user TwitterのUser Object
   * @param {object} data 更新するデータのクエリ
   * @return updateの結果
   */
  _updateUser (user, data) {
    let collection = this.db.collection('users')
    return collection.findOneAndUpdate({
      '_id': user.id_str
    }, data)
  }

  /**
   * 指定したIDのユーザにニックネームを設定します。
   * @param {UserObject} user TwitterのUser Object
   * @param {string} nickname ニックネーム
   * @return updateの結果
   */
  setNickname (user, nickname) {
    return this._updateUser(user,
      {$set:{ 'nickname': nickname}}
    )
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
    return this._updateUser(user,
      {$set:{ 'birthday': new Date(2000, month-1, day, 9)}}
    )
  }

  /**
   * 指定したIDのユーザの好感度を増減します。
   * @param {UserObject} user TwitterのUser Object
   * @param {number} incremental 増減量
   * @return updateの結果
   */
  increaseLovelity (user, incremental) {
    return this._updateUser(user, 
      {$inc:{ 'lovelity': incremental}}
    )
  }
}

module.exports = SakuyaDb
