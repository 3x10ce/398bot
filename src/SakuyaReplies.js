'use strict'
const reactions = require('./res/reactions.json')

/**
 * リプライパターン定義
 * あとあと、外部ファイルから読み込ませるようにするが、
 * reactionsデータのリファレンスとして、以下はコメントアウトで残しておく。
 */
/*
const reactions = [
  {
    trigger_word: "(?:メリー)?クリスマス"
    reply_patterns: [       // 返答するメッセージの配列。Botでこのパターンからランダムに1つ選択する。
      "リプライ1",
      "リプライ2",
      "リプライ3"
    ],
    requires: {             // 反応する際の条件をここに記載する。
      date_m: 12,           // 特定の日付限定のリアクションはdate_mとdate_dにその日付を設定する。
      date_d: 25,
      min_lovelity: 20      // 必要な好感度の値(最小値)を設定する。
    },
    lovelity: 2             // 反応した際に上昇する好感度の数値を設定する。
  },
  {
    trigger_word: "(?:メリー)?クリスマス",
    ...
    // 同じtrigger_wordを持つreaction patternを設定することもできる。
    // その場合は、先に指定したtrigger_wordの条件を満たさなかった時の
    // フォールバックとして機能する。

  },  
  { ... },
  ...
]
 */

/**
 * ツイートを元にリプライを生成する
 * @param tweet ツイートオブジェクト
 * @param user データベース上のユーザデータ
 */
module.exports = function(tweet, user) {
  let now = new Date()
  for ( let reaction of reactions) {

    // リアクションデータ
    // マッチパターンに一致するかチェック 一致しなければ終了
    let matcher = new RegExp(reaction.trigger_word)
    if (!matcher.test(tweet.text)) continue
    // 条件判定
    // requiresパラメータがある場合は、そこに記載される
    // 条件をすべてpassしているかチェックする。
    if (reaction.requires) {

      // すべての条件についてreduceをつかってANDをとっていく
      let passed = Object.keys(reaction.requires).reduce((reduced, type) => {
        let value = reaction.requires[type]
        let evaluated = false
        switch (type) {
        case 'date_m':
          evaluated = (now.getMonth() + 1 === value); break
        case 'date_d':
          evaluated = (now.getDate() === value); break
        case 'min_lovelity':
          evaluated = (user.lovelity >= value); break
        case 'max_lovelity':
          evaluated = (user.lovelity <= value); break
        }
        console.log(`${type}: ${value} -> ${evaluated}` )

        return reduced && evaluated
      }, true)

      if (!passed) continue
    }

    // リアクションデータを返却する
    return reaction
  }
  return null
}