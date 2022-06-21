/**
 * 配列を分割して返す
 * @param array 分割対象の配列
 * @param size 何個の配列に分割するか
 */
const arrayChunk = <T extends any[]>(array: T, size: number): T[] => {
  return array.reduce((newArray, _, i) => (i % size ? newArray : [...newArray, array.slice(i, i + size)]), []);
};

export default arrayChunk;
