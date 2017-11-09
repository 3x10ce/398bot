/**
 * Randomizer.js
 * 乱数を生成する関数群です。
 */

module.exports = {
  /**
   * 0 <= x < max の整数乱数を生成します。
   * @param max {number} 生成する乱数の最大値
   * @return 乱数
   */
  genInt: (max) => {
    return (Math.random() * max)|0
  },

  /**
   * 0 <= x < 1 の浮動小数乱数を生成します。
   * @param max {number} 生成する乱数の最大値
   * @return 乱数
   */
  gen: () => {
    return Math.random()
  },

  /**
   * 与えられた配列のうち任意の要素をランダムに選択して返却します。
   * @param list {array} 対象の配列
   * @return {any} 任意に選ばれた1要素
   */
  choice: (list) => {
    return list[ (Math.random() * list.length)|0 ]
  }
}