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
  getUser: (id) => ({then: () => sinon.stub().returns(createUserDataMock(id))}),
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
  verifyCredentials: () => 
    new Promise((r) => {r({id_str:'0000', name: 'SakuyaTest', screen_name: '398Bot'})}),
  tweet: (text) => text,
  follow: (id) => id
}

let sakuyaBot = new SakuyaBot(client, db)
sakuyaBot.teaSelector = () => ({name: '(紅茶名)', language_of: '(花言葉)', rarity: 1})
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
  it('紅茶を入れる', () => {
    let tweet = createTweetMock()
    tweet.text = '紅茶'

    // テスト返信を期待
    let client_mock = sinon.mock(client)
    client_mock.expects('tweet').once().withArgs(
      'はい、(紅茶名)を淹れてみましたわ。花言葉は(花言葉)ね。召し上がれ。', tweet.user
    )

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