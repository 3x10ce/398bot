let twitter = require('./Twitter.mock')

// dbのmock/stub
let db = {
  createUser: (user) => user,
  getUser: (id) => Promise.resolve(twitter.userMock(id)),
  setNickname: (id, nickname) => Promise.resolve([id, nickname]),
  setBirthday: (id, m, d) => Promise.resolve([id, m, d]),
  increaseLovelity: (id, lovelity) => Promise.resolve([id, lovelity]),
  addDonateLog: (name, amount) => Promise.resolve(name, amount),
  userIsDonated: () => Promise.resolve(false),
  sumDonation: () => Promise.resolve(1000),
  stashDonation: () => Promise.resolve()
}

module.exports = db