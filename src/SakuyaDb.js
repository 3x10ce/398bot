
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
      'lovelity': 5
    })
  }

  /** 
   * ユーザデータを取得します。
   * @param {string} user id
   * @return ユーザデータ
   */
  getUser (id) {
    let collection = this.db.collection('users')
    return collection.findOne({ '_id': id})
  }

  /**
   * ユーザのドキュメントを更新します。
   * @param {string} id Twitter の User ID (id_str)
   * @param {object} data 更新するデータのクエリ
   * @return updateの結果
   */
  _updateUser (id, data) {
    let collection = this.db.collection('users')
    return collection.findOneAndUpdate({
      '_id': id
    }, data)
  }

  /**
   * 指定したIDのユーザにニックネームを設定します。
   * @param {string} id Twitter の User ID (id_str)
   * @param {string} nickname ニックネーム
   * @return updateの結果
   */
  setNickname (id, nickname) {
    return this._updateUser(id,
      {$set:{ 'nickname': nickname}}
    )
  }

  /**
   * 指定したIDのユーザの好感度を増減します。
   * @param {string} id Twitter の User ID (id_str)
   * @param {number} incremental 増減量
   * @return updateの結果
   */
  increaseLovelity (id, incremental) {
    return this._updateUser(id, 
      {$inc:{ 'lovelity': incremental}}
    )
  }
}

module.exports = SakuyaDb
