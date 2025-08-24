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
  throw new Error(
    `map: invalid arguments\nval: ${JSON.stringify(
      val
    )}\nfromMin: ${JSON.stringify(fromMin)}\nfromMax: ${JSON.stringify(
      fromMax
    )}\ntoMin: ${JSON.stringify(toMin)}\ntoMax: ${JSON.stringify(toMax)}`
  );
}
