
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

  createUser (user) {
    let collection = this.db.collection('users')
    collection.insertOne({
      '_id': user.id_str,
      'name': user.name,
      'nickname': ':NAME:さん',
      'lovelity': 5
    })
  }

  _updateUser (id, data) {
    let collection = this.db.collection('users')
    collection.findOneAndUpdate({
      '_id': id
    }, data)
  }

  setNickname (id, nickname) {
    return this._updateUser(id,
      {$set:{ 'nickname': nickname}}
    )
  }

  incraseLovelity (id, incremental) {
    return this._updateUser(id, 
      {$inc:{ 'lovelity': incremental}}
    )
  }
}

module.exports = SakuyaDb
