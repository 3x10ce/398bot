'use strict'


/**
 * リプライパターン定義
 * あとあと、外部ファイルから読み込ませるようにするが、
 * reactionsデータのリファレンスとして、以下はコメントアウトで残しておく。
 */
const reactions = {
  "お(かえ|帰)り": {
    reply_patterns: [
      "ただいま。心配かけたわね。"
    ],
    requires: {
      min_lovelity: 10
    },
    lovelity: 1
  }, 
}

/**
 * ツイートを元にリプライを生成する
 * @param tweet ツイートオブジェクト
 * @param user データベース上のユーザデータ
 */
module.exports = function(tweet, user) {
  let now = new Date()
  for ( let pattern of Object.keys(reactions)) {

    // リアクションデータ
    let reaction = reactions[pattern]
    // マッチパターンに一致するかチェック 一致しなければ終了
    let matcher = new RegExp(pattern)
    if (!matcher.test(tweet.text)) continue

    // 条件判定
    // requiresパラメータがある場合は、そこに記載される
    // 条件をすべてpassしているかチェックする。
    if (reaction.requires) {

      // すべての条件についてreduceをつかってANDをとっていく
      console.log(reaction.requires)
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
