// clientのmock
let client = {
  verifyCredentials: () => Promise.resolve({id_str:'0000', name: 'SakuyaTest', screen_name: '398Bot'}),
  tweet: (text) => Promise.resolve(text),
  follow: (id) => Promise.resolve(id)
}

module.exports = client