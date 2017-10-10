let MongoDb = require('mongodb').Db
let MongoServer = require('mongodb').Server

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
    let collection = db.collection('users')
    collection.insertOne({
      'id': user.id_str,
      'name': user.name
    })
  }
}
