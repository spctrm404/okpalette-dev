import { useEffect, useRef } from 'react';
import {
  OKLAB_TO_NON_LINEAR_LMS,
  LINEAR_LMS_TO_XYZ,
  XYZ_TO_LINEAR_SRGB,
  XYZ_TO_LINEAR_DISPLAY_P3,
  mat3ToGlslMat3,
} from '../../utils/colour';
import vertexSource from './vertex.glsl';
import fragmentSource from './fragment.glsl';

type ChannelMappingConfig = {
  source: 'x' | 'y' | 'const';
  min: number;
  max: number;
  fnType?: 'linear' | 'pow' | 'bezier';
  constVal?: number;
  powVal?: number;
  bezierNormCp1?: [number, number];
  bezierNormCp2?: [number, number];
};

type GradientGlProps = {
  l: ChannelMappingConfig;
  c: ChannelMappingConfig;
  h: ChannelMappingConfig;
};

const GradientGl = ({ l, c, h }: GradientGlProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    glRef.current = gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!success) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    const u_OKLAB_TO_NON_LINEAR_LMS = gl.getUniformLocation(
      program,
      'u_OKLAB_TO_NON_LINEAR_LMS'
    );
    const u_LINEAR_LMS_TO_XYZ = gl.getUniformLocation(
      program,
      'u_LINEAR_LMS_TO_XYZ'
    );
    const u_XYZ_TO_LINEAR_SRGB = gl.getUniformLocation(
      program,
      'u_XYZ_TO_LINEAR_SRGB'
    );
    const u_XYZ_TO_LINEAR_DISPLAY_P3 = gl.getUniformLocation(
      program,
      'u_XYZ_TO_LINEAR_DISPLAY_P3'
    );

    if (u_OKLAB_TO_NON_LINEAR_LMS)
      gl.uniformMatrix3fv(
        u_OKLAB_TO_NON_LINEAR_LMS,
        false,
        mat3ToGlslMat3(OKLAB_TO_NON_LINEAR_LMS)
      );
    if (u_LINEAR_LMS_TO_XYZ)
      gl.uniformMatrix3fv(
        u_LINEAR_LMS_TO_XYZ,
        false,
        mat3ToGlslMat3(LINEAR_LMS_TO_XYZ)
      );
    if (u_XYZ_TO_LINEAR_SRGB)
      gl.uniformMatrix3fv(
        u_XYZ_TO_LINEAR_SRGB,
        false,
        mat3ToGlslMat3(XYZ_TO_LINEAR_SRGB)
      );
    if (u_XYZ_TO_LINEAR_DISPLAY_P3)
      gl.uniformMatrix3fv(
        u_XYZ_TO_LINEAR_DISPLAY_P3,
        false,
        mat3ToGlslMat3(XYZ_TO_LINEAR_DISPLAY_P3)
      );

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let animationFrameId: number | null = null;

    const handleResize = () => {
      if (!canvas || !gl || !program) return;
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = Math.round(canvas.clientWidth * dpr);
      const displayHeight = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
      gl.viewport(0, 0, displayWidth, displayHeight);
      const u_resolution = gl.getUniformLocation(program, 'u_resolution');
      if (u_resolution) gl.uniform2f(u_resolution, displayWidth, displayHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const resizeObserver = new window.ResizeObserver(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleResize);
    });
    resizeObserver.observe(canvas);
    handleResize();

    return () => {
      resizeObserver.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    gl.useProgram(program);

    const setChannelUniforms = (
      prefix: string,
      mapping: ChannelMappingConfig
    ) => {
      const u_source = gl.getUniformLocation(program, `u_${prefix}Source`);
      const u_min = gl.getUniformLocation(program, `u_${prefix}Min`);
      const u_max = gl.getUniformLocation(program, `u_${prefix}Max`);
      const u_const = gl.getUniformLocation(program, `u_${prefix}Const`);
      const u_mappingType = gl.getUniformLocation(
        program,
        `u_${prefix}MappingType`
      );
      const u_powValue = gl.getUniformLocation(program, `u_${prefix}PowValue`);
      const u_bezierP1 = gl.getUniformLocation(program, `u_${prefix}BezierP1`);
      const u_bezierP2 = gl.getUniformLocation(program, `u_${prefix}BezierP2`);

      const sourceInt =
        mapping.source === 'x' ? 0 : mapping.source === 'y' ? 1 : 2;
      if (u_source) gl.uniform1i(u_source, sourceInt);
      if (u_min) gl.uniform1f(u_min, mapping.min);
      if (u_max) gl.uniform1f(u_max, mapping.max);
      if (
        u_const &&
        mapping.source === 'const' &&
        mapping.constVal !== undefined
      )
        gl.uniform1f(u_const, mapping.constVal);

      const mappingType =
        mapping.fnType === undefined ? 'linear' : mapping.fnType;
      const mappingTypeInt =
        mappingType === 'linear' ? 0 : mappingType === 'pow' ? 1 : 2;
      if (u_mappingType) gl.uniform1i(u_mappingType, mappingTypeInt);
      if (
        u_powValue &&
        mapping.fnType === 'pow' &&
        mapping.powVal !== undefined
      )
        gl.uniform1f(u_powValue, mapping.powVal);
      if (u_bezierP1 && mapping.fnType === 'bezier' && mapping.bezierNormCp1)
        gl.uniform2f(
          u_bezierP1,
          mapping.bezierNormCp1[0],
          mapping.bezierNormCp1[1]
        );
      if (u_bezierP2 && mapping.fnType === 'bezier' && mapping.bezierNormCp2)
        gl.uniform2f(
          u_bezierP2,
          mapping.bezierNormCp2[0],
          mapping.bezierNormCp2[1]
        );
    };

    setChannelUniforms('l', l);
    setChannelUniforms('c', c);
    setChannelUniforms('h', h);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, [l, c, h]);

  return <canvas ref={canvasRef} width={200} height={200} />;
};

export default GradientGl;
