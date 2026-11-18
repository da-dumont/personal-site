/*
  GLSL for the particle field. The ribbon is a grid of points (u along its length, v across it)
  wrapped around a moving centerline and twisted, so rows of points read as fiber strands.
*/

export const ribbonVertex = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uAmp;
  uniform float uFreq;
  uniform float uTwist;
  uniform float uWidth;
  uniform float uPhase;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uWarmColor;
  uniform float uWarm;

  attribute vec2 aGrid;
  attribute float aRandom;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float u = aGrid.x;
    float v = aGrid.y;
    float t = uTime + uPhase;
    float x = u * 9.0;

    // Centerline: two slow waves, so the ribbon never repeats visibly.
    float y = sin(x * uFreq + t) * uAmp + sin(x * uFreq * 0.47 - t * 0.6) * uAmp * 0.6;
    float z = cos(x * uFreq * 0.33 + t * 0.4) * uAmp * 0.8;

    // Cross-section: width breathes along the length and the ribbon twists.
    float angle = uTwist * sin(x * 0.35 + t * 0.3) + x * 0.08;
    float w = v * uWidth * (0.75 + 0.25 * sin(x * 0.5 - t * 0.5));
    vec3 pos = vec3(x, y + cos(angle) * w, z + sin(angle) * w);
    pos += vec3(0.0, sin(t * 2.0 + aRandom * 40.0), cos(t * 1.7 + aRandom * 30.0)) * 0.012;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // The pointer gently parts the strands, in screen space.
    vec2 d = gl_Position.xy / gl_Position.w - uPointer;
    float push = exp(-dot(d, d) * 18.0) * uPointerStrength;
    gl_Position.xy += normalize(d + 1e-4) * push * 0.045 * gl_Position.w;

    // Light travels along the strands; the core is brighter than the edges.
    float light = 0.55 + 0.45 * sin(x * 0.6 - t * 1.3 + v * 1.5);
    light *= 1.0 - abs(v) * 0.45;

    vec3 color = mix(uColorA, uColorB, 0.5 + 0.5 * sin(x * 0.25 + t * 0.2));
    color = mix(color, uColorC, smoothstep(0.35, 1.0, abs(v)) * 0.7);
    color = mix(color, uWarmColor, uWarm * smoothstep(0.25, 0.95, sin(x * 0.4 + t * 0.5)));
    vColor = color * (0.45 + light);

    // Emerges from the middle outward on load, and fades at both ends.
    float reveal = 1.0 - smoothstep(uReveal * 1.25 - 0.25, uReveal * 1.25, abs(u));
    float ends = smoothstep(1.0, 0.65, abs(u));
    vAlpha = reveal * ends * uOpacity * (0.35 + 0.65 * aRandom);

    gl_PointSize = uSize * uPixelRatio * (0.6 + aRandom * 0.8) * (0.8 + light * 0.4) / -mv.z;
  }
`;

export const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform vec3 uColor;

  attribute float aRandom;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    pos.y += sin(uTime * 0.15 + aRandom * 50.0) * 0.35;
    pos.x += cos(uTime * 0.1 + aRandom * 20.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.5 + 0.5 * sin(uTime * (0.6 + aRandom) + aRandom * 80.0);
    vColor = uColor;
    vAlpha = uOpacity * twinkle * (0.2 + 0.8 * aRandom);
    gl_PointSize = uSize * uPixelRatio * (0.5 + aRandom) / -mv.z;
  }
`;

export const pointFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }
`;
