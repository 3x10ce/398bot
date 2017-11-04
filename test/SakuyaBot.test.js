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

let mockPromise = (value) => Promise.resolve(value)

// 適当なuser data を生成する
let createUserDataMock = () => ({
  _id: '0',
  name: 'Masashi',
  nickname: ':NAME:さん',
  lovelity: 20
})
// dbのmock/stub
let db = {
  createUser: (user) => user,
  getUser: (id) => mockPromise(createUserDataMock(id)),
  setNickname: (id, nickname) => mockPromise([id, nickname]),
  setBirthday: (id, m, d) => mockPromise([id, m, d]),
  increaseLovelity: (id, lovelity) => mockPromise([id, lovelity]),
  addDonateLog: (name, amount) => mockPromise(name, amount),
  sumDonation: () => mockPromise(1000),
  stashDonation: () => mockPromise()
}
// logのmock
let logger = {
  trace: (l) => l,
  debug: (l) => l,
  info: (l) => l,
  warn: (l) => l,
  error: (l) => l,
  fatal: (l) => l
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
  verifyCredentials: () => mockPromise({id_str:'0000', name: 'SakuyaTest', screen_name: '398Bot'}),
  tweet: (text) => mockPromise(text),
  follow: (id) => id
}

let rand = {
  genInt: () => (0),
  gen: () => (0.0)
}

let sakuyaBot = new SakuyaBot(client, db, logger, rand)
sakuyaBot.teaSelector = () => ({name: '(紅茶名)', language_of: '(花言葉)', rarity: 1})
/* SakuyaBot test*/

describe('口上反応テスト', () => {
  let client_mock
  beforeEach( () => {
    client_mock = sinon.mock(client, 'tweet', (tweet, user) => Promise.resolve([tweet, user]))
  })
  afterEach( () => {
    client_mock.restore()
  })

  it('反応しない', () => {
    let tweet = createTweetMock()

    tweet.text = '@398Bot ignored tweet'
    // ツイートを返さないことを期待
    client_mock.expects('tweet').never()

    sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
      .catch((err) => { throw err })
  })
  it('紅茶を入れる', () => {
    let tweet = createTweetMock()
    tweet.text = '@398Bot 紅茶'

    // テスト返信を期待
    client_mock.expects('tweet').once().withArgs(
      'はい、(紅茶名)を淹れてみましたわ。花言葉は(花言葉)ね。召し上がれ。', tweet
    )

    sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
      .catch((err) => { throw err })
  })
  it('誕生日', () => {
    let tweet = createTweetMock()
    tweet.text = '@398Bot 誕生日は10月15日'

    // テスト返信を期待
    client_mock.expects('tweet').once().withArgs(
      'あなたの誕生日は10月15日なのね。', tweet
    )

    sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
      .catch((err) => { throw err })
  })
  it('献血', () => {
    let tweet = createTweetMock()
    tweet.text = '@398Bot 献血'

    // テスト返信を期待
    client_mock.expects('tweet').once().withArgs(
      'あなたの血を 200 mL頂いたわ。お嬢様もきっと喜ぶと思うわ。どうもありがとう。', tweet
    )

    sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
      .catch((err) => { throw err })
  })
  it('リプライでないツイートには反応しない', () => {
    let tweet = createTweetMock()
    tweet.text = 'テスト'

    // テスト返信しないことを期待
    client_mock.expects('tweet').never()

    sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
      .catch((err) => { throw err })

  })
  it('他の人あてのリプライには反応しない', () => {
    let tweet = createTweetMock()
    tweet.text = '@3x10ce テスト'

    // テスト返信しないことを期待
    client_mock.expects('tweet').never()

    sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
      .catch((err) => { throw err })

  })
  it('自分以外へのリプライが混ざっている場合は反応しない', () => {
    let tweet = createTweetMock()
    tweet.text = '@398Bot @3x10ce テスト'

    // テスト返信しないことを期待
    client_mock.expects('tweet').never()

    sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
      .catch((err) => { throw err })
  })
  it('自分以外へのリプライが混ざっている場合は反応しない', () => {
    let tweet = createTweetMock()
    tweet.text = '@398Bot @3x10ce テスト'

    // テスト返信しないことを期待
    client_mock.expects('tweet').never()

    sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
      .catch((err) => { throw err })
  })
  it('ツイート途中に自分の@が混ざっている場合は反応しない', () => {
    let tweet = createTweetMock()
    tweet.text = 'これは @398Bot テスト'

    // テスト返信しないことを期待
    client_mock.expects('tweet').never()

    sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
      .catch((err) => { throw err })
  })
})

describe('日付変更時ついーと', () => {
  it('日付変更', () => {

    // 日付変更ツイートを期待
    let client_mock = sinon.mock(client)
    client_mock.expects('tweet').once().withArgs(
      '7月 15日になったわね。 先日は 1000 ml の献血をいただきましたわ。'
    )

    sakuyaBot.daily_work(new Date(2017, 6, 15, 0, 0, 0, 0))
      .then(() => client_mock.verify())
      .catch((err) => { throw err })
  })
  it('イベント発生がちょっとずれた', () => {

    // 日付変更ツイートを期待
    let client_mock = sinon.mock(client)
    client_mock.expects('tweet').once().withArgs(
      '7月 15日になったわね。 先日は 1000 ml の献血をいただきましたわ。'
    )

    sakuyaBot.daily_work(new Date(2017, 6, 14, 23, 59, 55, 0))
      .then(() => client_mock.verify())
      .catch((err) => { throw err })
  })
})


describe('フォローチェックテスト', () => {
  beforeEach( () => {
    sakuyaBot = new SakuyaBot(client, db, logger)
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
    // F/F比0%
    event.target.followers_count = 0
    event.target.friends_count = 1

    // フォローを返さないことを期待
    let client_mock = sinon.mock(client)
    client_mock.expects('follow').never()

    sakuyaBot.receive(event)

    client_mock.verify()
  })
})