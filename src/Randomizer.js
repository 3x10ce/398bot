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
  }
}