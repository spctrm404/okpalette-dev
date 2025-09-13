export function clamp(val: number, bound1: number, bound2: number): number;
export function clamp(
  val: number[],
  bound1: number[],
  bound2: number[]
): number[];
export function clamp(
  val: number | number[],
  bound1: number | number[],
  bound2: number | number[]
): number | number[] {
  const map = (val: number, bound1: number, bound2: number) => {
    const min = Math.min(bound1, bound2);
    const max = Math.max(bound1, bound2);
    return Math.max(min, Math.min(max, val));
  };
  if (
    Array.isArray(val) &&
    Array.isArray(bound1) &&
    Array.isArray(bound2) &&
    val.length === bound1.length &&
    val.length === bound2.length
  ) {
    return val.map((v, i) => map(v, bound1[i], bound2[i]));
  } else if (
    typeof val === 'number' &&
    typeof bound1 === 'number' &&
    typeof bound2 === 'number'
  ) {
    return map(val, bound1, bound2);
  }
  throw new Error(
    `clamp: invalid arguments\nval: ${JSON.stringify(
      val
    )}\nbound1: ${JSON.stringify(bound1)}\nbound2: ${JSON.stringify(bound2)}`
  );
}
