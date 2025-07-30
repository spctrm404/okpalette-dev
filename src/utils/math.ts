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
