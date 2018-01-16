/* eslint-disable no-undef */
let sinon = require('sinon')
//let sinonStubPromise = require('sinon-stub-promise')
//sinonStubPromise(sinon)

let SakuyaBot = require('../src/SakuyaBot')

let mockPromise = (value) => Promise.resolve(value)

// 各種mock
let twitter = require('./mock/Twitter.mock')
let db = require('./mock/Database.mock')
let utils = require('./mock/Utils.mock')
let client = require('./mock/TwitterClient.mock')
let rand = require('./mock/Randomizer.mock')

let sakuyaBot = new SakuyaBot(client, db, utils.logger, rand)
sakuyaBot.teaSelector = () => ({name: '(紅茶名)', language_of: '(花言葉)', rarity: 1})
sakuyaBot.today = { month: 6, day: 15 }

// リアクションプラグインのmockを流し込む
sakuyaBot.addReactionPlugin( (tweet) => {
  return tweet.text.match(/テスト/)
    ? { "reply_patterns": ["テスト返信"] }
    : undefined
})

/* SakuyaBot test*/

describe('口上反応テスト', () => {
  let client_mock
  beforeEach( () => {
    client_mock = sinon.mock(client)
  })
  afterEach( () => {
    client_mock.restore()
  })

  it('反応しない', () => {
    let tweet = twitter.tweetMock()

    tweet.text = '@398Bot ignored tweet'
    // ツイートを返さないことを期待
    client_mock.expects('tweet').never()

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })
  it('リアクションプラグイン', () => {
    let tweet = twitter.tweetMock()
    tweet.text = '@398Bot テスト'
    // リアクションプラグインからリプライ文が生成されることを期待
    client_mock.expects('tweet').once().withArgs('テスト返信', tweet)

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })
  it('紅茶を入れる', () => {
    let tweet = twitter.tweetMock()
    tweet.text = '@398Bot 紅茶'

    // テスト返信を期待
    client_mock.expects('tweet').once().withArgs(
      'はい、(紅茶名)を淹れてみましたわ。花言葉は(花言葉)ね。召し上がれ。', tweet
    )

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })
  it('誕生日1', () => {
    let tweet = twitter.tweetMock()
    tweet.text = '@398Bot 誕生日は10月15日'

    // テスト返信を期待
    client_mock.expects('tweet').once().withArgs(
      'あなたの誕生日は10月15日なのね。覚えたわ。', tweet
    )

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })
  it('誕生日2', () => {
    let tweet = twitter.tweetMock()
    tweet.text = '@398Bot 誕生日は1月31日'

    // テスト返信を期待
    client_mock.expects('tweet').once().withArgs(
      'あなたの誕生日は1月31日なのね。覚えたわ。', tweet
    )

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })
  it('誕生日3', () => {
    let tweet = twitter.tweetMock()
    tweet.text = '@398Bot 誕生日は12月1日'

    // テスト返信を期待
    client_mock.expects('tweet').once().withArgs(
      'あなたの誕生日は12月1日なのね。覚えたわ。', tweet
    )

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())

  })
  it('誕生日4', () => {
    let tweet = twitter.tweetMock()
    tweet.text = '@398Bot 誕生日は2月29日'

    // テスト返信を期待
    client_mock.expects('tweet').once().withArgs(
      'あなたの誕生日は2月29日なのね。覚えたわ。', tweet
    )

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())

  })
  it('不正な誕生日のガード', () => {
    let tweet = []
    for(let i = 0; i < 5; i++) tweet.push(twitter.tweetMock())
    
    tweet[0].text = '@398Bot 誕生日は0月14日'
    tweet[1].text = '@398Bot 誕生日は13月20日'
    tweet[2].text = '@398Bot 誕生日は9月0日'
    tweet[3].text = '@398Bot 誕生日は9月32日'
    tweet[4].text = '@398Bot 誕生日は2月30日'

    // なにも返信しないことを期待
    client_mock.expects('tweet').never()
    return Promise.all(tweet.map((v) => sakuyaBot.read(v))) 
      .then(() => client_mock.verify())

  })
  it('誕生日お祝い', () => {
    let tweet = twitter.tweetMock()
    tweet.text = 'テスト'
    let todayTmp = sakuyaBot.today
    sakuyaBot.today = { month: 1, day: 1}

    // お祝いしてくれることを期待
    client_mock.expects('tweet').once().withArgs(
      'そういえば、今日がお誕生日らしいわね。おめでとう、Annonymousさん。', tweet
    )

    return sakuyaBot.read(tweet)
      .then(() => {
        client_mock.verify()
        sakuyaBot.today = todayTmp
      })
  })
  it('献血', () => {
    let tweet = twitter.tweetMock()
    tweet.text = '@398Bot 献血'

    // テスト返信を期待
    client_mock.expects('tweet').once().withArgs(
      'あなたの血を 200 mL頂いたわ。お嬢様もきっと喜ぶと思うわ。どうもありがとう。', tweet
    )

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })

  it('すでに献血済み', () => {
    let tweet = twitter.tweetMock()
    let db_stub = sinon.stub(db, 'userIsDonated')
    db_stub.returns(mockPromise(true))
    tweet.text = '@398Bot 献血'

    // テスト返信を期待
    client_mock.expects('tweet').once().withArgs(
      '献血は1日1回までよ。', tweet
    )

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })

  it('呼び名設定', () => {
    let tweet = twitter.tweetMock()
    tweet.text = '@398Bot 「:NAME:君」って呼んで'

    // テスト返信を期待
    client_mock.expects('tweet').once().withArgs(
      'Annonymous君…って呼べばいいのね。', tweet
    )

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })

  it('好感度チェック', () => {
    let tweet = twitter.tweetMock()

    tweet.text = '@398Bot 私のことどう思う？'
    
    // 好感度に応じたリプライがされることを期待
    client_mock.expects('tweet').once().withArgs('あなたへの好感度: 1.00', tweet)

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })

  it('リプライでないツイートには反応しない', () => {
    let tweet = twitter.tweetMock()
    tweet.text = 'テスト'

    // テスト返信しないことを期待
    client_mock.expects('tweet').never()

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())

  })
  it('他の人あてのリプライには反応しない', () => {
    let tweet = twitter.tweetMock()
    tweet.text = '@3x10ce テスト'

    // テスト返信しないことを期待
    client_mock.expects('tweet').never()

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())

  })
  it('自分以外へのリプライが混ざっている場合は反応しない', () => {
    let tweet = twitter.tweetMock()
    tweet.text = '@398Bot @3x10ce テスト'

    // テスト返信しないことを期待
    client_mock.expects('tweet').never()

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })
  it('自分以外へのリプライが混ざっている場合は反応しない', () => {
    let tweet = twitter.tweetMock()
    tweet.text = '@398Bot @3x10ce テスト'

    // テスト返信しないことを期待
    client_mock.expects('tweet').never()

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })
  it('ツイート途中に自分の@が混ざっている場合は反応しない', () => {
    let tweet = twitter.tweetMock()
    tweet.text = 'これは @398Bot テスト'

    // テスト返信しないことを期待
    client_mock.expects('tweet').never()

    return sakuyaBot.read(tweet)
      .then(() => client_mock.verify())
  })
})

describe('日付変更時ついーと', () => {

  let client_mock
  beforeEach( () => {
    client_mock = sinon.mock(client)
  })
  afterEach( () => {
    client_mock.restore()
  })

  it('日付変更', () => {

    // 日付変更ツイートを期待
    client_mock.expects('tweet').once().withArgs(
      '7月 15日になったわね。 先日は 1000 ml の献血をいただきましたわ。'
    )

    return sakuyaBot.daily_work(new Date(2017, 6, 15, 0, 0, 0, 0))
      .then(() => client_mock.verify())
  })
  it('イベント発生がちょっとずれた', () => {

    // 日付変更ツイートを期待
    client_mock.expects('tweet').once().withArgs(
      '7月 15日になったわね。 先日は 1000 ml の献血をいただきましたわ。'
    )

    return sakuyaBot.daily_work(new Date(2017, 6, 14, 23, 59, 55, 0))
      .then(() => client_mock.verify())
  })
})


describe('フォローチェックテスト', () => {
  let client_mock
  beforeEach( () => {
    client_mock = sinon.mock(client)
  })
  afterEach( () => {
    client_mock.restore()
  })

  it('通常のフォロー返しフロー', () => {
    let event = {
      event: 'follow',
      target: twitter.userMock(),
      source: twitter.userMock()
    }
    // F/F比100%
    event.source.followers_count = 100
    event.source.friends_count = 100

     
    // フォローを返すことを期待
    client_mock.expects('follow').once().withArgs('12345')

    return sakuyaBot.receive(event)
      .then(() => client_mock.verify())
  })

  it('スパムのフォロー返しフロー', () => {
    let event = {
      event: 'follow',
      target: twitter.userMock(),
      source: twitter.userMock()
    }
    // F/F比10%
    event.source.followers_count = 10
    event.source.friends_count = 100

    // フォローを返さないことを期待
    client_mock.expects('follow').never()

    return sakuyaBot.receive(event)
      .then(() => client_mock.verify())
  })

  it('作成直後のアカウント(フォロワー0人', () => {
    let event = {
      event: 'follow',
      target: twitter.userMock(),
      source: twitter.userMock()
    }
    // F/F比0%
    event.source.followers_count = 0
    event.source.friends_count = 1

    // フォローを返さないことを期待
    client_mock.expects('follow').never()

    return sakuyaBot.receive(event)
      .then(() => client_mock.verify())
  })
})