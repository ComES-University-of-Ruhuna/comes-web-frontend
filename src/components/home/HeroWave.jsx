/**
 *
 * Props:
 *   variant       – "desktop" | "mobile"  (auto-detected if omitted)
 *   scrollSpeed   – 0–1, wave scroll reactivity  (default 0.15)
 *   className     – extra CSS class for the wrapper
 *   style         – extra inline styles for the wrapper
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ================================================================== *
 *  GLSL – Simplex noise library (shared by vertex & fragment)        *
 * ================================================================== */

const NOISE_GLSL = /* glsl */ `
float rand_v2(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float remap(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u  = fract(p);
  u = u * u * (3.0 - 2.0 * u);
  float res = mix(
    mix(rand_v2(ip), rand_v2(ip + vec2(1.0, 0.0)), u.x),
    mix(rand_v2(ip + vec2(0.0, 1.0)), rand_v2(ip + vec2(1.0, 1.0)), u.x),
    u.y
  );
  return res * res;
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187, 0.366025403784439,
   -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

/* ================================================================== *
 *  GLSL – Wave vertex pars (uniforms + varyings)                     *
 *  NOTE: vUv is NOT declared here – USE_UV define lets Three.js      *
 *        declare attribute vec2 uv & varying vec2 vUv automatically  *
 * ================================================================== */

const WAVE_VERT_PARS = /* glsl */ `
uniform float uWavesX;
uniform float uWavesY;
uniform float uDisplacementHeight;
uniform float uTime;
uniform float uConstantTime;
uniform float uSpeedX;
uniform float uSpeedY;
uniform vec3  uPrimaryColor;
uniform vec3  uValleyColor;
uniform vec3  uPeakColor;
varying vec3  vColor;
varying float vTime;
varying float vConstantTime;
varying float vDisplaceNoise;
`;

/* ================================================================== *
 *  GLSL – Wave fragment pars                                         *
 * ================================================================== */

const WAVE_FRAG_PARS = /* glsl */ `
varying vec3  vColor;
varying float vTime;
varying float vConstantTime;
varying float vDisplaceNoise;
uniform float uTextureScaleX;
uniform float uTextureScaleY;
uniform vec3  uTextureColor;
uniform float uIridescenceWidth;
uniform float uIridescenceSpeed;
uniform float uIridescenceExponent;
uniform float uVisibleBand;
uniform float uVisibleFade;
uniform vec3  uFlowPeakColor;
uniform float uFlowPeakSpeed;
uniform vec3  uFlowValleyColor;
uniform float uFlowValleySpeed;
uniform float uFlowMixAmount;
`;

/* ================================================================== *
 *  GLSL – Vertex displacement (replaces #include <displacementmap_vertex>) *
 * ================================================================== */

const DISPLACE_AND_COLOR_VERT = /* glsl */ `
// Re-assign vUv from raw attribute (bypass any uvTransform)
vUv = uv;

vec2 waveUv = vec2(
  (uv.x + uTime * uSpeedX) * uWavesX,
  (uv.y + uTime * uSpeedY) * uWavesY
);
float noiseValue = snoise(waveUv);
transformed += normalize(objectNormal) * noiseValue * uDisplacementHeight;
vTime          = uTime;
vConstantTime  = uConstantTime;
vDisplaceNoise = noiseValue;

// Per-vertex coloring from noise
float remapedNoise = remap(noiseValue, -1.0, 1.0, 0.0, 1.0);
vColor = uPrimaryColor;
vColor = mix(uPeakColor, vColor, smoothstep(0.0, 0.5, remapedNoise));
vColor = mix(vColor, uValleyColor, smoothstep(0.5, 1.0, remapedNoise));
`;

/* ================================================================== *
 *  GLSL – Fragment: #include <color_fragment> replacement            *
 * ================================================================== */

const COLOR_FRAG = /* glsl */ `
float noiseValue = snoise(vec2(vUv.x * uTextureScaleX, vUv.y * uTextureScaleY));
diffuseColor.rgb = vColor - (uTextureColor * abs(noiseValue));

float flow_ft  = fract(vConstantTime / uFlowPeakSpeed);
float flow_w   = 0.5;
float flow_t   = remap(flow_ft, 0.0, 1.0, -0.5 - flow_w, 0.5 + flow_w);
float flow_mix = smoothstep(0.5 - flow_w + flow_t, 0.5 + flow_t, vUv.x)
               - smoothstep(0.5 + flow_t, 0.5 + flow_w + flow_t, vUv.x);

float flow_ft2  = fract(vConstantTime / uFlowValleySpeed);
float flow_w2   = 0.2;
float flow_t2   = remap(flow_ft2, 0.0, 1.0, -0.5 - flow_w2, 0.5 + flow_w2);
float flow_mix2 = smoothstep(0.5 - flow_w2 + flow_t2, 0.5 + flow_t2, vUv.y)
                - smoothstep(0.5 + flow_t2, 0.5 + flow_w2 + flow_t2, vUv.y);

diffuseColor.rgb = mix(diffuseColor.rgb, uFlowPeakColor,   flow_mix  * uFlowMixAmount);
diffuseColor.rgb = mix(diffuseColor.rgb, uFlowValleyColor, flow_mix2 * vDisplaceNoise * uFlowMixAmount);
`;

/* ================================================================== *
 *  GLSL – Fragment: #include <lights_physical_fragment> replacement  *
 * ================================================================== */

const LIGHTS_FRAG = /* glsl */ `
#include <lights_physical_fragment>
float iri_ft = fract(vConstantTime / uIridescenceSpeed);
float iri_w  = uIridescenceWidth;
float iri_t  = remap(iri_ft, 0.0, 1.0, -0.5 - iri_w, 0.5 + iri_w);
material.iridescence *= smoothstep(0.5 - iri_w + iri_t, 0.5 + iri_t, vUv.x)
                      - smoothstep(0.5 + iri_t, 0.5 + iri_w + iri_t, vUv.x);
material.iridescence *= abs(pow(noiseValue, uIridescenceExponent));
`;

/* ================================================================== *
 *  GLSL – Fragment: #include <dithering_fragment> replacement        *
 * ================================================================== */

const DITHERING_FRAG = /* glsl */ `
#include <dithering_fragment>
float visibleBandY = 1.0 - smoothstep(uVisibleBand, uVisibleBand + uVisibleFade, 1.0 - vUv.y);
gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), visibleBandY);
`;

/* ================================================================== *
 *  GLSL – Background gradient quad                                   *
 * ================================================================== */

const BG_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const BG_FRAG = /* glsl */ `
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform float uColorExpo1;
uniform float uColorExpo2;
uniform float uColorExpo3;
varying vec2  vUv;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec3 dithering(vec3 color) {
  float g = rand(gl_FragCoord.xy);
  vec3 shift = vec3(0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0);
  shift = mix(2.0 * shift, -2.0 * shift, g);
  return color + shift;
}

void main() {
  vec3 c = mix(
    mix(uColor1, uColor2, pow(vUv.y, uColorExpo1)),
    mix(uColor3, uColor4, pow(vUv.y, uColorExpo2)),
    pow(vUv.x, uColorExpo3)
  );
  gl_FragColor = vec4(dithering(c), 1.0);
}
`;

/* ================================================================== *
 *  Configs – exact values from production JS bundle         *
 * ================================================================== */

const BREAKPOINT = 700;

const HERO_DESKTOP = {
  gui: {
    Scene: {
      color1: '#040a12', color2: '#252751', color3: '#040a12', color4: '#040a12',
      colorExpo1: 0.27, colorExpo2: 3.09, colorExpo3: 0.91,
      fogColor: '#24264e', density: 0,
    },
    Geometry: {
      width: 15, height: 40, subdivisionsX: 148, subdivisionsY: 148,
      twistX: 0.09, twistY: 0.29,
    },
    Topology: { wavesX: 3, wavesY: 3, speedX: -0.1, speedY: 0.17, height: 1.3 },
    Material: {
      primaryColor: '#635bff', valleyColor: '#635bff', peakColor: '#635bff',
      sheenColor: '#635bff', sheenAmount: 0.33, metalness: 0.33, roughness: 0.68,
    },
    Texture: {
      textureColor: '#061728', textureScaleX: 180, textureScaleY: 0,
      iridescence: 0.25, iridescenceIOR: 6.51, iridescenceThick: 78.9,
      iridescenceWidth: 0.5, iridescenceSpeed: 9000, iridescenceExpo: 3,
    },
    Lights: {
      ambientLight: '#ffffff', ambientLightIntensity: 0.2,
      pointLight0: '#fab700', pl0X: 7.59,  pl0Y: 8.03,  pl0Z: 0.09,  pl0I: 7.43,
      pointLight1: '#5cb0ff', pl1X: -6.96, pl1Y: 6.71,  pl1Z: 3.4,   pl1I: 5.59,
      pointLight2: '#ff5996', pl2X: -4.98, pl2Y: 7.81,  pl2Z: -12,   pl2I: 5.41,
    },
  },
  cam: {
    pos: { x: 0.8445158695913522, y: 10.199201513166413, z: -15.227922852706573 },
    lookAt: { x: 6.55345703346005, y: -1.029010250189948, z: -7.035503049726665 },
  },
};

const HERO_MOBILE = {
  gui: {
    ...HERO_DESKTOP.gui,
    Lights: {
      ambientLight: '#ffffff', ambientLightIntensity: 0.2,
      pointLight0: '#fab700', pl0X: 7.59,  pl0Y: 8.03,  pl0Z: 0.09,  pl0I: 7.43,
      pointLight1: '#5cb0ff', pl1X: -6.96, pl1Y: 6.71,  pl1Z: -6.3,  pl1I: 1.92,
      pointLight2: '#ff5996', pl2X: -4.98, pl2Y: 7.81,  pl2Z: -12,   pl2I: 5.41,
    },
  },
  cam: {
    pos: { x: 0.9037371102139865, y: 7.891543408123248, z: 4.000896618785959 },
    lookAt: { x: -0.204971167274043, y: 6.366132827181147, z: 2.172081841052219 },
  },
};

/* ================================================================== *
 *  Helper – twist a PlaneGeometry along its surface                  *
 * ================================================================== */

function twistGeometry(geometry, twistX, twistY) {
  const q    = new THREE.Quaternion();
  const axis = new THREE.Vector3(0, -1, 0);
  const pos  = geometry.attributes.position;
  const ox   = 1 - twistX;  // 0.91
  const oy   = 1 - twistY;  // 0.71

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const v = new THREE.Vector3(x, y, z);
    q.setFromAxisAngle(axis, (Math.PI / 180) * (y / oy + x / ox));
    v.applyQuaternion(q);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geometry.computeVertexNormals();
  pos.needsUpdate = true;
  geometry.attributes.normal.needsUpdate = true;
}

/* ================================================================== *
 *  React component                                                   *
 * ================================================================== */

export default function HeroWave({
  variant,
  scrollSpeed: scrollSpeedProp,
  className,
  style,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const width  = el.clientWidth;
    const height = el.clientHeight;
    if (width === 0 || height === 0) return;

    /* ── pick config ─────────────────────────────────────────── */
    const isDesktop =
      variant === 'desktop' ||
      (variant !== 'mobile' && window.innerWidth > BREAKPOINT);
    const config      = isDesktop ? HERO_DESKTOP : HERO_MOBILE;
    const scrollSpeed =
      scrollSpeedProp !== undefined ? scrollSpeedProp : 0.15;
    const S = config.gui.Scene;
    const G = config.gui.Geometry;
    const T = config.gui.Topology;
    const M = config.gui.Material;
    const X = config.gui.Texture;
    const L = config.gui.Lights;

    /* ── renderer ────────────────────────────────────────────── */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping  = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.autoClear = false;                // we clear manually
    renderer.setClearColor(new THREE.Color(S.color1));
    renderer.domElement.style.display = 'block';
    el.appendChild(renderer.domElement);

    /* ── background scene (gradient quad) ────────────────────── */
    const bgScene  = new THREE.Scene();
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const bgMat    = new THREE.ShaderMaterial({
      vertexShader:   BG_VERT,
      fragmentShader: BG_FRAG,
      depthWrite: false,
      toneMapped: false,   // preserve raw gradient colors
      uniforms: {
        uColor1:    { value: new THREE.Color(S.color1) },
        uColor2:    { value: new THREE.Color(S.color2) },
        uColor3:    { value: new THREE.Color(S.color3) },
        uColor4:    { value: new THREE.Color(S.color4) },
        uColorExpo1:{ value: S.colorExpo1 },
        uColorExpo2:{ value: S.colorExpo2 },
        uColorExpo3:{ value: S.colorExpo3 },
      },
    });
    bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat));

    /* ── wave uniforms (shared objects mutated in anim loop) ─── */
    const waveU = {
      uWavesX:             { value: T.wavesX },
      uWavesY:             { value: T.wavesY },
      uDisplacementHeight: { value: T.height },
      uSpeedX:             { value: T.speedX / 10000 },
      uSpeedY:             { value: T.speedY / 10000 },
      uTime:               { value: 0 },
      uConstantTime:       { value: 0 },
      uPrimaryColor:       { value: new THREE.Color(M.primaryColor) },
      uValleyColor:        { value: new THREE.Color(M.valleyColor) },
      uPeakColor:          { value: new THREE.Color(M.peakColor) },
      uTextureScaleX:      { value: X.textureScaleX },
      uTextureScaleY:      { value: X.textureScaleY },
      uTextureColor:       { value: new THREE.Color(X.textureColor) },
      uIridescenceWidth:   { value: X.iridescenceWidth },
      uIridescenceSpeed:   { value: X.iridescenceSpeed },
      uIridescenceExponent:{ value: X.iridescenceExpo },
      uVisibleBand:        { value: 0 },
      uVisibleFade:        { value: 0 },
      uFlowPeakColor:      { value: new THREE.Color(M.primaryColor) },
      uFlowPeakSpeed:      { value: 6000 },
      uFlowValleyColor:    { value: new THREE.Color(M.primaryColor) },
      uFlowValleySpeed:    { value: 7000 },
      uFlowMixAmount:      { value: 0 },
    };

    /* ── wave material (MeshPhysicalMaterial + custom shaders) ─ */
    const waveMat = new THREE.MeshPhysicalMaterial({
      metalness:  M.metalness,
      color:      0x000000,
      roughness:  M.roughness,
      sheen:      M.sheenAmount,
      sheenColor: new THREE.Color(M.sheenColor),
      side:       THREE.DoubleSide,   // Ensures visible from camera angle
      dithering:  true,
      iridescence:   X.iridescence,
      iridescenceIOR: X.iridescenceIOR,
      iridescenceThicknessRange: [1, X.iridescenceThick],
    });

    // Force Three.js to declare `attribute vec2 uv` + `varying vec2 vUv`
    waveMat.defines = waveMat.defines || {};
    waveMat.defines['USE_UV'] = '';

    waveMat.onBeforeCompile = (shader) => {
      // Merge custom uniforms into the Three.js shader
      for (const [key, val] of Object.entries(waveU)) {
        shader.uniforms[key] = val;
      }

      /* ── Vertex shader patches ─────────────────────────────── */
      shader.vertexShader =
        WAVE_VERT_PARS + '\n' +
        NOISE_GLSL      + '\n' +
        shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <displacementmap_vertex>',
        DISPLACE_AND_COLOR_VERT
      );

      /* ── Fragment shader patches ───────────────────────────── */
      shader.fragmentShader =
        WAVE_FRAG_PARS + '\n' +
        NOISE_GLSL      + '\n' +
        shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        COLOR_FRAG
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <lights_physical_fragment>',
        LIGHTS_FRAG
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        DITHERING_FRAG
      );

      waveMat.userData.shader = shader;
    };

    /* ── wave geometry (twisted plane) ───────────────────────── */
    const waveGeo = new THREE.PlaneGeometry(
      G.width, G.height, G.subdivisionsX, G.subdivisionsY
    );
    twistGeometry(waveGeo, G.twistX, G.twistY);

    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.rotateX(-Math.PI / 2);  // Face normals towards the camera

    /* ── main scene ──────────────────────────────────────────── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(new THREE.Color(S.fogColor), S.density);
    scene.add(waveMesh);

    /* ── lights ──────────────────────────────────────────────── */
    //
    // intensity values were tuned for legacy PointLight behaviour.
    // Three.js r155+ uses physically-correct lighting (decay=2 → 1/d²).
    //
    // We use decay=1 (linear 1/d falloff) so each colored light dominates
    // the surface area nearest to it, creating the amber / blue / pink zones
    // visible in the original. The intensity is scaled up to compensate for
    // the per-distance division.
    //
    const DECAY = 1;
    const DIST  = 20;       // matches source: new PointLight('#fff', 1, 20)
    const LIGHT_SCALE = 20; // compensate for physically-correct normalization in r171

    if (L.ambientLightIntensity > 0) {
      scene.add(new THREE.AmbientLight(L.ambientLight, L.ambientLightIntensity));
    }

    const pl0 = new THREE.PointLight(L.pointLight0, L.pl0I * LIGHT_SCALE, DIST, DECAY);
    pl0.position.set(L.pl0X, L.pl0Y, L.pl0Z);
    scene.add(pl0);

    const pl1 = new THREE.PointLight(L.pointLight1, L.pl1I * LIGHT_SCALE, DIST, DECAY);
    pl1.position.set(L.pl1X, L.pl1Y, L.pl1Z);
    scene.add(pl1);

    const pl2 = new THREE.PointLight(L.pointLight2, L.pl2I * LIGHT_SCALE, DIST, DECAY);
    pl2.position.set(L.pl2X, L.pl2Y, L.pl2Z);
    scene.add(pl2);

    /* ── camera ──────────────────────────────────────────────── */
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(config.cam.pos.x, config.cam.pos.y, config.cam.pos.z);
    camera.lookAt(config.cam.lookAt.x, config.cam.lookAt.y, config.cam.lookAt.z);

    /* ── force shader compilation before first frame ─────────── */
    renderer.compile(bgScene, bgCamera);
    renderer.compile(scene, camera);

    /* ── scroll tracking ─────────────────────────────────────── */
    let extraTime       = 0;
    let extraTimeTarget = 0;
    let lastScrollY     = window.scrollY;

    const onScroll = () => {
      const dy = window.scrollY - lastScrollY;
      extraTimeTarget += dy * 150;
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── resize ──────────────────────────────────────────────── */
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    /* ── animation loop (render directly to screen) ──────────── */
    let raf;
    const animate = (time) => {
      raf = requestAnimationFrame(animate);

      // Scroll-driven time shift
      extraTime += (extraTimeTarget - extraTime) * scrollSpeed;

      // Update wave uniforms
      if (waveMat.userData.shader) {
        waveMat.userData.shader.uniforms.uTime.value         = time + extraTime;
        waveMat.userData.shader.uniforms.uConstantTime.value = time;
      }

      // Render: background first, then wave scene on top
      renderer.clear(true, true, true);
      renderer.render(bgScene, bgCamera);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    /* ── cleanup ─────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      bgMat.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [variant, scrollSpeedProp]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        ...style,
      }}
    />
  );
}
