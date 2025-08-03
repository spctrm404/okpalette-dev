export function clamp(val: number, min: number, max: number): number;
export function clamp(val: number[], min: number[], max: number[]): number[];
export function clamp(
  val: number | number[],
  min: number | number[],
  max: number | number[]
): number | number[] {
  if (
    Array.isArray(val) &&
    Array.isArray(min) &&
    Array.isArray(max) &&
    val.length === min.length &&
    val.length === max.length
  ) {
    return val.map((v, i) => {
      const _min = Math.min(min[i], max[i]);
      const _max = Math.max(min[i], max[i]);
      return Math.max(_min, Math.min(_max, v));
    });
  } else if (
    typeof val === 'number' &&
    typeof min === 'number' &&
    typeof max === 'number'
  ) {
    const _min = Math.min(min, max);
    const _max = Math.max(min, max);
    return Math.max(_min, Math.min(_max, val));
  }
  throw new Error('clamp: invalid arguments');
}

export function map(
  val: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number;
export function map(
  val: number[],
  fromMin: number[],
  fromMax: number[],
  toMin: number[],
  toMax: number[]
): number[];
export function map(
  val: number | number[],
  fromMin: number | number[],
  fromMax: number | number[],
  toMin: number | number[],
  toMax: number | number[]
): number | number[] {
  const map = (
    val: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number
  ) => {
    if (fromMin === fromMax) return toMin;
    const normalizedVal = (val - fromMin) / (fromMax - fromMin);
    const convertedVal = toMin + normalizedVal * (toMax - toMin);
    return convertedVal;
  };
  if (
    Array.isArray(val) &&
    Array.isArray(fromMin) &&
    Array.isArray(fromMax) &&
    Array.isArray(toMin) &&
    Array.isArray(toMax) &&
    val.length === fromMin.length &&
    val.length === fromMax.length &&
    val.length === toMin.length &&
    val.length === toMax.length
  ) {
    return val.map((v, i) =>
      map(v, fromMin[i], fromMax[i], toMin[i], toMax[i])
    );
  } else if (
    typeof val === 'number' &&
    typeof fromMin === 'number' &&
    typeof fromMax === 'number' &&
    typeof toMin === 'number' &&
    typeof toMax === 'number'
  ) {
    return map(val, fromMin, fromMax, toMin, toMax);
  }
  throw new Error('map: invalid arguments');
}
