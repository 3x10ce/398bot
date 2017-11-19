/* eslint-disable no-undef */

/**
 * reactions.test.js
 * reactions.jsonの書式をチェックします。
 */
'use strict'

const reactions = require('./reactions.json')
const assert = require('chai').assert

describe('check reactions.json', () => {
  it('トップレベルドメインのフォーマット', () => {
    assert.strictEqual(typeof reactions, 'object') 
  })
})

describe('check each reaction format', () => {
  reactions.forEach( (reaction) => {
    let trigger = reaction.trigger_word
    describe(trigger, () => {
      it('マッチパターンの正規表現チェック', () => {
        assert.strictEqual((new RegExp(trigger)) instanceof RegExp, true)
      })

      it('リプライパターンがStringの配列', () => {
        assert.strictEqual(reaction.reply_patterns instanceof Array, true)
        for (let p of reaction.reply_patterns)
          assert.strictEqual(typeof p, 'string')
      })

      it('好感度増減値が整数値', () => {
        if (reaction.lovelity) {
          assert.strictEqual(typeof reaction.lovelity, 'number')
          assert.strictEqual(Number.isInteger(reaction.lovelity), true)
        }
      })

      it ('必要条件がある場合は各条件もチェックする', () => {
        if (reaction.requires) {
          assert.strictEqual(typeof reaction.requires, 'object')

          // 使用可能なtype値
          let available_types = [
            {id: 'date_m', type: 'number'},
            {id: 'date_d', type: 'number'},
            {id: 'min_lovelity', type: 'number'}
          ]
          Object.keys(reaction.requires).forEach( (t) => {
            let type_scheme_index = available_types.findIndex( (e) => e.id === t)
            assert.notStrictEqual(type_scheme_index, -1)

            let type_scheme = available_types[type_scheme_index]
            assert.strictEqual(typeof reaction.requires[t], type_scheme.type, t)
          })
        }
      })
    })
  })
})