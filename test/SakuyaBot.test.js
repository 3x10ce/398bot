/* eslint-disable no-undef */
let sinon = require('sinon')
let SakuyaBot = require('../src/SakuyaBot')

// 適当なtweetのmockを作成する
let createTweetMock = () => ({
  id: 0,
  id_str: 0,
  text: 'none',
  user: createUserMock()
})

// 適当なuser data を生成する
let createUserDataMock = () => ({
  _id: '0',
  name: 'Masashi',
  nickname: 'Massie',
  lovelity: 20
})
// dbのmock/stub
let db = {
  createUser: (user) => user,
  getUser: (id) => sinon.stub().returns(createUserDataMock()),
  setNickname: (id, nickname) => [id, nickname],
  increaseLovelity: (id, lovelity) => [id, lovelity]
}

// 適当なUserのmockを作成する
let createUserMock = () => ({
  id: 0,
  id_str: '0',
  name: 'Annonymous',
  screen_name: 'null'
})

// clientのmock
let client = {
  tweet: (text) => text,
  follow: (id) => id
}

let sakuyaBot = new SakuyaBot(client, db)

/* SakuyaBot test*/

describe('口上反応テスト', () => {
  afterEach( () => {

  })
  it('反応しない', () => {
    let tweet = createTweetMock()

    tweet.text = 'ignored tweet'
    // ツイートを返さないことを期待
    let client_mock = sinon.mock(client)
    client_mock.expects('tweet').never()
    sakuyaBot.read(tweet)

    client_mock.verify()
    
  })
  it('テスト口上', () => {
    let tweet = createTweetMock()
    tweet.text = 'テスト'
    // テスト返信を期待
    let client_mock = sinon.mock(client)
    client_mock.expects('tweet').once().withArgs('テスト返信', tweet.user)
    
    sakuyaBot.read(tweet)

    client_mock.verify()
  })
})

describe('フォローチェックテスト', () => {
  beforeEach( () => {
    sakuyaBot = new SakuyaBot(client, db)
  })
  it('通常のフォロー返しフロー', () => {
    let event = {
      event: 'follow',
      target: createUserMock()
    }
    // F/F比100%
    event.target.followers_count = 100
    event.target.friends_count = 100

    // フォローを返すことを期待
    let client_mock = sinon.mock(client)
    client_mock.expects('follow').once().withArgs('0')

    sakuyaBot.receive(event)

    client_mock.verify()
  })

  it('スパムのフォロー返しフロー', () => {
    let event = {
      event: 'follow',
      target: createUserMock()
    }
    // F/F比10%
    event.target.followers_count = 10
    event.target.friends_count = 100

    // フォローを返さないことを期待
    let client_mock = sinon.mock(client)
    client_mock.expects('follow').never()

    sakuyaBot.receive(event)

    client_mock.verify()
  })

  it('作成直後のアカウント(フォロワー0人', () => {
    let event = {
      event: 'follow',
      target: createUserMock()
    }
    // F/F比10%
    event.target.followers_count = 0
    event.target.friends_count = 1

    // フォローを返さないことを期待
    let client_mock = sinon.mock(client)
    client_mock.expects('follow').never()

    sakuyaBot.receive(event)

    client_mock.verify()
  })
})