
let chai = require('chai')
let sinon = require('sinon')
let TwitterClient = require('../src/TwitterClient')
let SakuyaBot = require('../src/SakuyaBot')
let expect = chai.expect

// 適当なtweetのmockを作成する
let createTweetMock = () => {
  return {
    id: 0,
    id_str: 0,
    text: 'none',
    user: {
      id: 0,
      id_str: 0,
      name: 'Annonymous',
      screen_name: 'null'
    }
  }
}

// clientのmock
let client = {
  tweet: (text) => text
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
    client_mock.expects('tweet').once().withArgs('テスト返信')

    sakuyaBot.read(tweet)

    client_mock.verify()
  })
})