// 適当なUserのmockを作成する
let createUserMock = () => ({
  id: 12345,
  id_str: '12345',
  name: 'Annonymous',
  screen_name: 'null'
})

// 適当なtweetのmockを作成する
let createTweetMock = () => ({
  id: 0,
  id_str: 0,
  text: 'none',
  user: createUserMock()
})
  
module.exports = {
  tweetMock: createTweetMock,
  userMock: createUserMock
}