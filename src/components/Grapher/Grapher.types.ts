export type Vec2 = [number, number];
export type Mat2 = [Vec2, Vec2];
export type Order = 'first' | 'middle' | 'last';

export type PathType = 'linear' | 'bezier' | 'pow';
export type PathBase = {
  type: PathType;
  begin: Vec2;
  end: Vec2;
};
export type PathLinear = PathBase & {
  type: 'linear';
};
export type PathPow = PathBase & {
  type: 'pow';
  exponent: number;
};
export type PathBezier = PathBase & {
  type: 'bezier';
  control1: Vec2;
  control2: Vec2;
};
export type Path = PathLinear | PathPow | PathBezier;
export type Paths = Path[];
