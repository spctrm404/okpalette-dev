export function clamp(val: number, boundA: number, boundB: number): number;
export function clamp(
  val: number[],
  boundA: number[],
  boundB: number[]
): number[];
export function clamp(
  val: number | number[],
  boundA: number | number[],
  boundB: number | number[]
): number | number[] {
  const map = (val: number, boundA: number, boundB: number) => {
    const _min = Math.min(boundA, boundB);
    const _max = Math.max(boundA, boundB);
    return Math.max(_min, Math.min(_max, val));
  };
  if (
    Array.isArray(val) &&
    Array.isArray(boundA) &&
    Array.isArray(boundB) &&
    val.length === boundA.length &&
    val.length === boundB.length
  ) {
    return val.map((v, i) => map(v, boundA[i], boundB[i]));
  } else if (
    typeof val === 'number' &&
    typeof boundA === 'number' &&
    typeof boundB === 'number'
  ) {
    return map(val, boundA, boundB);
  }
  throw new Error(
    `clamp: invalid arguments\nval: ${JSON.stringify(
      val
    )}\nboundA: ${JSON.stringify(boundA)}\nboundB: ${JSON.stringify(boundB)}`
  );
}
