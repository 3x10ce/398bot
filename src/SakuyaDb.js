
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
      'id': user.id_str,
      'name': user.name
    })
  }

  updateUser (user, data) {
    let collection = this.db.collection('users')
    collection.findOneAndUpdate({
      'id': user.id_str      
    }, data)

  }
}

module.exports = SakuyaDb
