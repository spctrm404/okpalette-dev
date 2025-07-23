#version 300 es
precision highp float;

out vec4 outColor;

uniform vec2 u_resolution;

uniform mat3 u_OKLAB_TO_NON_LINEAR_LMS;
uniform mat3 u_LINEAR_LMS_TO_XYZ;
uniform mat3 u_XYZ_TO_LINEAR_SRGB;
uniform mat3 u_XYZ_TO_LINEAR_DISPLAY_P3;

// l, c, h 각각의 source(0:x, 1:y, 2:const), min, max, constValue
uniform int u_lSource;
uniform float u_lMin;
uniform float u_lMax;
uniform float u_lConst;
uniform int u_lMappingType; // 0: linear, 1: pow, 2: bezier
uniform float u_lPowValue;
uniform vec2 u_lBezierP1;
uniform vec2 u_lBezierP2;

uniform int u_cSource;
uniform float u_cMin;
uniform float u_cMax;
uniform float u_cConst;
uniform int u_cMappingType;
uniform float u_cPowValue;
uniform vec2 u_cBezierP1;
uniform vec2 u_cBezierP2;

uniform int u_hSource;
uniform float u_hMin;
uniform float u_hMax;
uniform float u_hConst;
uniform int u_hMappingType;
uniform float u_hPowValue;
uniform vec2 u_hBezierP1;
uniform vec2 u_hBezierP2;

const float PI = 3.1415927;
const float DEGREES_TO_RADIANS = PI / 180.0;
const float GAMUT_DISPLAY_P3 = 1.0;

//cylindrical to cartesian coordinates
vec3 lchToLab(vec3 lch) {
  return vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z));
}

// lab -> non-linear lms -> linaer lms -> xyz
vec3 oklabToXyz(vec3 oklab) {
  vec3 nonLinearLms = u_OKLAB_TO_NON_LINEAR_LMS * oklab;
  vec3 linearLms = pow(abs(nonLinearLms), vec3(3.0)) * sign(nonLinearLms);
  return u_LINEAR_LMS_TO_XYZ * linearLms;
}

vec3 xyzToLinearSRgb(vec3 xyz) {
  return u_XYZ_TO_LINEAR_SRGB * xyz;
}
vec3 xyzToLinearDisplayP3(vec3 xyz) {
  return u_XYZ_TO_LINEAR_DISPLAY_P3 * xyz;
}

vec3 toNonLinearRgb(vec3 rgb) {
  vec3 sign = sign(rgb);
  vec3 abs = abs(rgb);
  vec3 nonlinear = sign * (1.055 * pow(abs, vec3(1.0 / 2.4)) - 0.055);
  vec3 linear = 12.92 * rgb;
  return mix(linear, nonlinear, step(0.0031308, abs));
}

float isInColorSpace(vec3 v) {
  // if both are 1.0, v is in [0, 1]
  vec3 check =
    // step(0.0, v) returns 1.0 if v >= 0.0, 0.0 if v < 0.0
    step(vec3(0.0), v) *
    // step(v, 1.0) returns 1.0 if v <= 1.0, 0.0 if v > 1.0
    step(v, vec3(1.0));
  return check.x * check.y * check.z;
}

// Cubic Bezier (0,0)-(p1.x,p1.y)-(p2.x,p2.y)-(1,1)
// Returns (x, y) at parameter t
vec2 cubicBezierPoint(float t, vec2 p1, vec2 p2) {
  float u = 1.0 - t;
  float tt = t * t;
  float uu = u * u;
  float uuu = uu * u;
  float ttt = tt * t;
  float x = 3.0 * uu * t * p1.x + 3.0 * u * tt * p2.x + ttt;
  float y = 3.0 * uu * t * p1.y + 3.0 * u * tt * p2.y + ttt;
  return vec2(x, y);
}

// Easing: for given x in [0,1], find y on Bezier curve with binary search
float cubicBezierEasing(float x, vec2 p1, vec2 p2) {
  float t = x;
  float lower = 0.0;
  float upper = 1.0;
  for (int i = 0; i < 8; ++i) {
    float xt = cubicBezierPoint(t, p1, p2).x;
    float diff = xt - x;
    if (abs(diff) < 1e-4) break;
    if (diff > 0.0) upper = t;
    else lower = t;
    t = 0.5 * (lower + upper);
  }
  return cubicBezierPoint(t, p1, p2).y;
}

// mappingType: 0=linear, 1=pow, 2=bezier
float getChannel(
  int source, float minV, float maxV, float constV, vec2 norm,
  int mappingType, float powValue, vec2 bezierP1, vec2 bezierP2
) {
  vec2 mapped = norm;
  mapped = mix(
    mapped, 
    pow(norm, vec2(powValue)), 
    float(mappingType == 1)
  );
  mapped = mix(
    mapped, 
    vec2(
      cubicBezierEasing(norm.x, bezierP1, bezierP2), 
      cubicBezierEasing(norm.y, bezierP1, bezierP2)
    ), 
    float(mappingType == 2)
  );
  vec2 val = mix(vec2(minV), vec2(maxV), mapped);
  return float(source == 0) * val.x + float(source == 1) * val.y + float(source == 2) * constV;
}

void main() {
  vec2 norm = gl_FragCoord.xy / u_resolution;
  float l = getChannel(
    u_lSource, u_lMin, u_lMax, u_lConst, norm,
    u_lMappingType, u_lPowValue, u_lBezierP1, u_lBezierP2
  );
  float c = getChannel(
    u_cSource, u_cMin, u_cMax, u_cConst, norm,
    u_cMappingType, u_cPowValue, u_cBezierP1, u_cBezierP2
  );
  float h = getChannel(
    u_hSource, u_hMin, u_hMax, u_hConst, norm,
    u_hMappingType, u_hPowValue, u_hBezierP1, u_hBezierP2
  );
  vec3 oklch = vec3(l, c, h * DEGREES_TO_RADIANS);
  
  vec3 oklab = lchToLab(oklch);
  vec3 xyz = oklabToXyz(oklab);

  vec3 linearSRgb = xyzToLinearSRgb(xyz);
  vec3 linearDisplayP3 = xyzToLinearDisplayP3(xyz);

  vec3 nonLinearSRgb = toNonLinearRgb(linearSRgb);
  vec3 nonLinearDisplayP3 = toNonLinearRgb(linearDisplayP3);

  float inSRgb = isInColorSpace(linearSRgb);
  float inDisplayP3 = isInColorSpace(linearDisplayP3);

  vec4 sRgbColor = vec4(nonLinearSRgb, inSRgb);
  vec4 displayP3Color = vec4(nonLinearDisplayP3, inDisplayP3);
  
  // outColor = mix(
  //   sRgbColor,
  //   displayP3Color,
  //   0.0
  // );
  outColor = displayP3Color;
}