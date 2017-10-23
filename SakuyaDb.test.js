

let MongoDb = require('mongodb').Db
let MongoServer = require('mongodb').Server
let SakuyaDb = require('./src/SakuyaDb')

let server = new MongoServer('localhost', 27017)
let db = new MongoDb('SakuyaBot', server, {safe: true})

let sdb = new SakuyaDb(db)

setTimeout( () => {
  // sdb.createUser({id_str: '0000000', name: 'test'})
  // sdb.modifyUser('0000000', {id: '0000000', name: 'test2'})  
  // sdb.setNickname('0000000', ':NAME_ORG:さん')
  sdb.setBirthday('0000001', 2, 55)
    .then ((r) => console.dir(r))
    .catch((r) => console.dir(r))
},1000)