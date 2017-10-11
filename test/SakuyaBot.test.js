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

let client_mock = sinon.mock(client)

let sakuyaBot = new SakuyaBot(client)
/* SakuyaBot test*/

describe('口上反応テスト', () => {
  beforeEach(() => {

  })
  it('テスト口上', () => {
    let tweet = createTweetMock()
    tweet.text = 'テスト'
    client_mock.expects('tweet').once().withArgs('テスト返信', tweet.user)

    sakuyaBot.read(tweet)

    client_mock.verify()
  })
})

describe('フォローチェックテスト', () => {
  it('通常のフォロー返しフロー', () => {
    let event = {
      event: 'follow',
      target: createUserMock()
    }
    // F/F比100%
    event.target.followers_count = 100
    event.target.friends_count = 100

    // フォローを返すことを期待
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
    client_mock.expects('follow').never()

    sakuyaBot.receive(event)

    client_mock.verify()
  })
})