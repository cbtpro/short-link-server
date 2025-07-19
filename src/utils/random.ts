/**
 * 生成安全随机数
 * @param {*} min 最小值（包含）
 * @param {*} max 最大值（包含）
 * @param {*} isFloat 是否带小数
 * @returns {number} 范围内随机数
 */
export const randomNatural = (min = 0, max = 100, isFloat = false) => {
  const array = new Uint32Array(1);
  const maxUint = 0xffffffff;
  const randomNumber = crypto.getRandomValues(array)[0] / maxUint;
  const randomRangeValue = (max - min + 1) * randomNumber + min;
  return isFloat ? randomRangeValue : Math.floor(randomRangeValue);
};
