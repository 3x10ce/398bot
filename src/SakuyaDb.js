
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
}

module.exports = SakuyaDb

let MongoDb = require('mongodb').Db
let MongoServer = require('mongodb').Server

let server = new MongoServer('localhost', 27017)
let db = new MongoDb('SakuyaBot', server, {safe: true})

let sdb = new SakuyaDb(db)

setTimeout( () => {
  // sdb.createUser({id_str: '0000000', name: 'test'})
  // sdb.modifyUser('0000000', {id: '0000000', name: 'test2'})  
  sdb.setNickname('0000000', ':NAME_ORG:さん')
},1000)
