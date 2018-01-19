let twitter = require('./Twitter.mock')

let createUserDBMock = (id) => {
  return {
    id: id,
    nickname: ':NAME:さん',
    birth_m: 1,
    birth_d: 1,
    lovelity: 20,
    celebratedBirthday: false
  }
}

// dbのmock/stub
let db = {
  createUser: (user) => user,
  getUser: (id) => Promise.resolve(createUserDBMock(id)),
  setNickname: (id, nickname) => Promise.resolve([id, nickname]),
  setBirthday: (id, m, d) => Promise.resolve([id, m, d]),
  increaseLovelity: (id, lovelity) => Promise.resolve([id, lovelity]),
  addDonateLog: (name, amount) => Promise.resolve(name, amount),
  userIsDonated: () => Promise.resolve(false),
  sumDonation: () => Promise.resolve(1000),
  stashDonation: () => Promise.resolve(),
  setCelebratedBirthdayFlag: () => Promise.resolve(),
  clearCelebratedBirthdayFlags: () => Promise.resolve()
}

module.exports = db