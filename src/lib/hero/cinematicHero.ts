import * as THREE from "three";
import type { HeroRenderer, HeroState } from "./states";

type PremiumTier = "A" | "B" | "C";

interface ProceduralCoutureOptions {
  root: HTMLElement;
  mount: HTMLElement;
  signal: AbortSignal;
  portrait: boolean;
  tier: PremiumTier;
  onStateChange(state: HeroState): void;
  onReady(): void;
  onFailure(): void;
  onIneligible(): void;
  onPointerOwnershipChange?(owned: boolean): void;
}

interface SceneQuality {
  garmentX: number;
  garmentY: number;
  ribbonSegments: number;
  particleCount: number;
  embroideryMotifs: number;
  dpr: number;
  panelCount: number;
}

const QUALITY: Record<PremiumTier, SceneQuality> = {
  A: {
    garmentX: 64,
    garmentY: 80,
    ribbonSegments: 64,
    particleCount: 1120,
    embroideryMotifs: 18,
    dpr: 1.5,
    panelCount: 6,
  },
  B: {
    garmentX: 48,
    garmentY: 62,
    ribbonSegments: 46,
    particleCount: 640,
    embroideryMotifs: 14,
    dpr: 1.25,
    panelCount: 6,
  },
  C: {
    garmentX: 34,
    garmentY: 48,
    ribbonSegments: 34,
    particleCount: 360,
    embroideryMotifs: 11,
    dpr: 1.2,
    panelCount: 5,
  },
};

const garmentVertex = /* glsl */ `
  uniform float uTime;
  uniform float uCoverage;
  uniform float uExit;
  uniform float uPortrait;
  uniform vec2 uPointer;
  attribute float aPanel;
  varying vec2 vUv;
  varying float vPanel;
  varying float vFold;
  varying vec3 vWorld;

  float garmentWidth(float y) {
    float hemToHip = mix(1.42, 0.59, smoothstep(0.02, 0.47, y));
    float hipToWaist = mix(0.59, 0.335, smoothstep(0.47, 0.61, y));
    float waistToBust = mix(0.335, 0.53, smoothstep(0.61, 0.83, y));
    float bustToTop = mix(0.53, 0.365, smoothstep(0.83, 1.0, y));
    return y < 0.47 ? hemToHip :
      y < 0.61 ? hipToWaist :
      y < 0.83 ? waistToBust : bustToTop;
  }

  void main() {
    vUv = uv;
    vPanel = aPanel;
    float nx = position.x;
    float y = uv.y;
    float portraitScale = mix(1.0, 0.68, uPortrait);
    float panel = aPanel;
    float width = garmentWidth(y);

    vec3 shaped = vec3(
      nx * width * 1.78 * portraitScale,
      (y - 0.5) * mix(4.92, 5.12, uPortrait) - 0.1,
      0.0
    );

    float neckline = smoothstep(0.88, 1.0, y) *
      (1.0 - pow(clamp(abs(nx), 0.0, 1.0), 0.7));
    shaped.y -= neckline * 0.36;

    float time = uTime * 0.055;
    float broadFold =
      sin(nx * (5.1 + panel * 0.67) + y * (1.2 + panel * 0.19) + panel * 1.37) *
        (0.075 + mod(panel, 2.0) * 0.018) +
      sin(nx * (2.25 + panel * 0.31) - y * (2.15 + panel * 0.23) - panel * 0.81) *
        (0.052 + mod(panel + 1.0, 2.0) * 0.014);
    float diagonal =
      sin((nx * 1.4 + y * (2.6 + panel * 0.21)) * 2.4 + panel * 0.9) * 0.024;
    float lower = 1.0 - smoothstep(0.48, 0.8, y);
    float breathing = sin(time + panel * 1.1 + y * 2.0) * 0.012;

    float panelDepth = 0.0;
    if (panel < 0.5) panelDepth = -0.34;
    else if (panel < 1.5) panelDepth = -0.08;
    else if (panel < 2.5) panelDepth = 0.08;
    else if (panel < 3.5) panelDepth = 0.15;
    else if (panel < 4.5) panelDepth = 0.12;
    else panelDepth = 0.19;

    shaped.z = panelDepth + (broadFold + diagonal) * (0.36 + lower * 1.28);
    shaped.z += breathing * (0.35 + lower);
    shaped.x += sin(y * 3.2 + panel * 1.6) * 0.035 * lower;
    shaped.x += uPointer.x * (0.016 + lower * 0.026) * (panel + 1.0) / 6.0;
    shaped.z += uPointer.y * 0.018 * lower;

    float unravel = smoothstep(0.05, 1.0, uExit) * lower;
    shaped.x += sign(nx + 0.001) * unravel * (0.08 + panel * 0.012);
    shaped.y -= unravel * 0.13;
    shaped.z -= unravel * 0.09;

    vFold = broadFold + diagonal;
    vec4 world = modelMatrix * vec4(shaped, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const garmentFragment = /* glsl */ `
  uniform float uTime;
  uniform float uCoverage;
  uniform float uExit;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying float vPanel;
  varying float vFold;
  varying vec3 vWorld;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float garmentWidth(float y) {
    float hemToHip = mix(1.42, 0.59, smoothstep(0.02, 0.47, y));
    float hipToWaist = mix(0.59, 0.335, smoothstep(0.47, 0.61, y));
    float waistToBust = mix(0.335, 0.53, smoothstep(0.61, 0.83, y));
    float bustToTop = mix(0.53, 0.365, smoothstep(0.83, 1.0, y));
    return y < 0.47 ? hemToHip :
      y < 0.61 ? hipToWaist :
      y < 0.83 ? waistToBust : bustToTop;
  }

  void main() {
    float y = vUv.y;
    float nx = vUv.x * 2.0 - 1.0;
    float lower = 1.0 - smoothstep(0.42, 0.72, y);

    float panelMask = 1.0;
    if (vPanel < 0.5) panelMask = lower * 0.72;
    else if (vPanel < 1.5) {
      panelMask = smoothstep(0.01, 0.22, y) *
        (1.0 - smoothstep(0.58, 0.84, y)) * 0.66;
    } else if (vPanel < 2.5) panelMask = 0.84;
    else if (vPanel < 3.5) {
      panelMask = (1.0 - smoothstep(0.54, 0.9, vUv.x)) * lower * 0.72;
    } else if (vPanel < 4.5) {
      panelMask = smoothstep(0.1, 0.48, vUv.x) * lower * 0.7;
    } else {
      panelMask = smoothstep(0.47, 0.59, y) *
        (1.0 - smoothstep(0.94, 1.0, y)) * 0.92;
    }

    float frontA = y * 0.78 + abs(nx) * 0.14;
    float frontB = y * 0.46 + (nx * 0.5 + 0.5) * 0.24;
    float irregular = (hash21(floor(vUv * vec2(34.0, 48.0))) - 0.5) * 0.065;
    float revealA = smoothstep(frontA - 0.1, frontA + 0.055, uCoverage + irregular);
    float revealB = smoothstep(frontB - 0.15, frontB + 0.06, uCoverage - 0.17);
    float coverage = max(revealA, revealB * 0.78);

    vec3 dx = dFdx(vWorld);
    vec3 dy = dFdy(vWorld);
    vec3 normal = normalize(cross(dx, dy));
    if (!gl_FrontFacing) normal = -normal;
    vec3 viewDirection = normalize(cameraPosition - vWorld);
    vec3 keyLight = normalize(vec3(-0.32 + uPointer.x * 0.16, 0.58, 0.78));
    vec3 rimLight = normalize(vec3(0.72, 0.2, 0.54));
    vec3 halfDirection = normalize(keyLight + viewDirection);

    float diffuse = max(dot(normal, keyLight), 0.0);
    float rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.25);
    float broadSheen = pow(max(dot(normal, halfDirection), 0.0), 4.2);
    float silkSheen = pow(max(dot(normal, halfDirection), 0.0), 18.0);
    float sideSheen = pow(max(dot(normal, normalize(rimLight + viewDirection)), 0.0), 11.0);

    float warp = abs(sin((vUv.x * 520.0 + sin(vUv.y * 19.0) * 0.45) * 3.14159));
    float weft = abs(sin((vUv.y * 330.0 + sin(vUv.x * 13.0) * 0.32) * 3.14159));
    float warpWidth = max(fwidth(warp) * 1.25, 0.018);
    float weftWidth = max(fwidth(weft) * 1.25, 0.018);
    float weave = smoothstep(0.88 - warpWidth, 0.88 + warpWidth, warp) * 0.7 +
      smoothstep(0.9 - weftWidth, 0.9 + weftWidth, weft) * 0.3;
    float weaveDistanceFade = smoothstep(3.5, 1.4, length(cameraPosition - vWorld));

    vec3 black = vec3(0.013, 0.01, 0.008);
    vec3 warmBlack = vec3(0.075, 0.038, 0.023);
    vec3 cocoa = vec3(0.16, 0.077, 0.043);
    vec3 highlight = vec3(0.39, 0.205, 0.105);
    vec3 gold = vec3(0.56, 0.37, 0.17);

    float valley = smoothstep(0.018, 0.085, abs(vFold));
    float pleat = pow(
      0.5 + 0.5 * sin(nx * (17.0 + vPanel * 1.7) + y * 3.2),
      7.0
    ) * lower;
    vec3 color = vec3(0.045, 0.022, 0.013);
    color += mix(black, warmBlack, 0.18 + diffuse * 0.44 + broadSheen * 0.58);
    color += cocoa * (diffuse * 0.12 + broadSheen * 0.58);
    color += highlight * silkSheen * 0.46;
    color += gold * sideSheen * rim * 0.25;
    color += mix(cocoa, highlight, pleat) * pleat * (0.26 + broadSheen * 0.38);
    color *= 0.8 + valley * 0.2;
    color += vec3(0.25, 0.19, 0.14) * weave * weaveDistanceFade * (0.012 + silkSheen * 0.03);

    float edge = smoothstep(0.0, 0.035, vUv.x) *
      (1.0 - smoothstep(0.965, 1.0, vUv.x));
    float verticalEdge = smoothstep(0.0, 0.022, y) *
      (1.0 - smoothstep(0.978, 1.0, y));
    float release = 1.0 - smoothstep(0.2, 1.0, uExit) * lower * 0.88;
    float alpha = coverage * panelMask * edge * verticalEdge * release;
    alpha *= 0.9 + broadSheen * 0.1;
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const ribbonVertex = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uExit;
  uniform float uPortrait;
  uniform vec2 uPointer;
  attribute float aRibbon;
  varying vec2 vUv;
  varying float vRibbon;
  varying vec3 vWorld;
  varying float vTension;

  void main() {
    vUv = uv;
    vRibbon = aRibbon;
    vec3 shaped = position;
    float phase = aRibbon * 1.73;
    float travel = uTime * (0.035 + aRibbon * 0.004);
    float longitudinal = uv.x;
    float across = uv.y * 2.0 - 1.0;
    float drift =
      sin(longitudinal * (4.2 + aRibbon * 0.37) + phase + travel) * 0.035 +
      sin(longitudinal * 2.15 - phase * 0.7 - travel * 0.52) * 0.022;
    shaped.z += drift * (0.4 + abs(across) * 0.6);
    shaped.y += sin(longitudinal * 3.1 + phase + travel * 0.6) * 0.018;
    shaped.x += uPointer.x * (0.018 + longitudinal * 0.026) * (1.0 - uPortrait * 0.8);
    shaped.z += uPointer.y * 0.014 * (1.0 - uPortrait * 0.65);
    float side = sign(position.x + 0.001);
    shaped.x += side * uExit * (0.12 + longitudinal * 0.22);
    shaped.z -= uExit * 0.18;
    vTension = drift;
    vec4 world = modelMatrix * vec4(shaped, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const ribbonFragment = /* glsl */ `
  uniform float uReveal;
  uniform float uExit;
  varying vec2 vUv;
  varying float vRibbon;
  varying vec3 vWorld;
  varying float vTension;

  void main() {
    vec3 dx = dFdx(vWorld);
    vec3 dy = dFdy(vWorld);
    vec3 normal = normalize(cross(dx, dy));
    if (!gl_FrontFacing) normal = -normal;
    vec3 viewDirection = normalize(cameraPosition - vWorld);
    vec3 lightDirection = normalize(vec3(-0.22, 0.48, 0.84));
    vec3 halfDirection = normalize(viewDirection + lightDirection);
    float sheen = pow(max(dot(normal, halfDirection), 0.0), 10.0);
    float grazing = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.1);
    float edge = pow(abs(vUv.y * 2.0 - 1.0), 7.0);
    float longitudinalFade = smoothstep(0.0, 0.08, vUv.x) *
      (1.0 - smoothstep(0.84, 1.0, vUv.x));
    float reveal = smoothstep(0.38 + vRibbon * 0.035, 0.68 + vRibbon * 0.025, uReveal);
    vec3 black = vec3(0.004);
    vec3 cocoa = vec3(0.09, 0.043, 0.026);
    vec3 gold = vec3(0.34, 0.2, 0.09);
    vec3 color = mix(black, cocoa, 0.2 + sheen * 0.62);
    color += gold * (grazing * 0.2 + edge * sheen * 0.38);
    float alpha = longitudinalFade * reveal * (0.055 + sheen * 0.13 + edge * 0.075);
    alpha *= 1.0 - uExit * 0.82;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const lineVertex = /* glsl */ `
  uniform float uProgress;
  uniform float uExit;
  attribute float aKind;
  attribute float aOrder;
  varying float vAlpha;
  varying float vKind;

  void main() {
    vKind = aKind;
    float guideIn = smoothstep(aOrder - 0.09, aOrder + 0.035, uProgress);
    float guideOut = 1.0 - smoothstep(0.72, 0.9, uProgress);
    float embroidery = smoothstep(0.68 + aOrder * 0.22, 0.76 + aOrder * 0.22, uProgress);
    vAlpha = mix(guideIn * guideOut, embroidery, aKind) * (1.0 - uExit * 0.9);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lineFragment = /* glsl */ `
  varying float vAlpha;
  varying float vKind;
  void main() {
    vec3 guide = vec3(0.48, 0.31, 0.16);
    vec3 zari = vec3(0.72, 0.49, 0.24);
    vec3 color = mix(guide, zari, vKind);
    float alpha = vAlpha * mix(0.42, 0.78, vKind);
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const pointVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uExit;
  uniform float uDpr;
  attribute float aSize;
  attribute float aPhase;
  attribute float aStrength;
  attribute float aKind;
  varying float vAlpha;
  varying float vRare;
  varying float vKind;

  void main() {
    vKind = aKind;
    float pulse = pow(max(0.0, sin(uTime * (0.16 + aStrength * 0.1) + aPhase)), 18.0);
    float atmosphere = smoothstep(0.48, 0.82, uProgress);
    float bead = smoothstep(0.7 + aStrength * 0.13, 0.9, uProgress);
    float visibility = mix(atmosphere, bead, aKind);
    vAlpha = visibility * (0.09 + pulse * 0.91) * (1.0 - uExit * 0.95);
    vRare = step(0.965, aStrength);
    vec3 point = position;
    if (aKind < 0.5) {
      point.y += sin(uTime * 0.025 + aPhase) * 0.014 * aStrength;
    }
    vec4 view = modelViewMatrix * vec4(point, 1.0);
    gl_PointSize = (aSize + pulse * vRare * 3.1) * uDpr;
    gl_Position = projectionMatrix * view;
  }
`;

const pointFragment = /* glsl */ `
  varying float vAlpha;
  varying float vRare;
  varying float vKind;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float distanceToCenter = length(p);
    float pin = 1.0 - smoothstep(0.05, 0.5, distanceToCenter);
    float horizontal = exp(-abs(p.x) * 34.0) * exp(-abs(p.y) * 5.2);
    float vertical = exp(-abs(p.y) * 34.0) * exp(-abs(p.x) * 5.2);
    float flare = (horizontal + vertical) * vRare;
    vec3 dust = vec3(0.72, 0.48, 0.23);
    vec3 pearl = vec3(0.86, 0.75, 0.59);
    vec3 color = mix(dust, pearl, vKind);
    float alpha = (pin + flare * 0.42) * vAlpha * mix(0.56, 0.78, vKind);
    if (alpha < 0.012) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

class ProceduralCoutureRenderer implements HeroRenderer {
  #options: ProceduralCoutureOptions;
  #quality: SceneQuality;
  #renderer?: THREE.WebGLRenderer;
  #scene?: THREE.Scene;
  #camera?: THREE.PerspectiveCamera;
  #garment?: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  #ribbons?: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  #lines?: THREE.LineSegments<THREE.BufferGeometry, THREE.ShaderMaterial>;
  #points?: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  #events = new AbortController();
  #resizeObserver?: ResizeObserver;
  #frame = 0;
  #lastRender = 0;
  #startTime = 0;
  #scrollTarget = 0;
  #scrollCurrent = 0;
  #pointerTarget = new THREE.Vector2();
  #pointerCurrent = new THREE.Vector2();
  #state: HeroState;
  #paused = false;
  #disposed = false;
  #ready = false;

  constructor(options: ProceduralCoutureOptions) {
    this.#options = options;
    this.#quality = QUALITY[options.tier];
    this.#state = options.portrait ? "THREAD_READY" : "FALLBACK_READY";
    options.signal.addEventListener("abort", () => this.dispose(), { once: true });
  }

  mount() {
    if (
      this.#options.portrait !==
      matchMedia("(orientation: portrait)").matches
    ) {
      this.#options.onIneligible();
      return;
    }

    try {
      this.#scene = new THREE.Scene();
      this.#camera = new THREE.PerspectiveCamera(
        this.#options.portrait ? 32 : 34,
        1,
        0.1,
        30,
      );
      this.#camera.position.set(0, this.#options.portrait ? 0.08 : 0.05, 9.1);
      this.#renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: this.#options.tier === "A" ? "high-performance" : "default",
        failIfMajorPerformanceCaveat: false,
      });
      this.#renderer.setClearColor(0x000000, 0);
      this.#renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.#renderer.domElement.setAttribute("aria-hidden", "true");
      this.#renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
      this.#options.mount.replaceChildren(this.#renderer.domElement);
      this.#createScene();
      this.#bindEvents();
      this.#measure();
      this.#renderer.compile(this.#scene, this.#camera);
      this.#startTime = performance.now();
      this.#onScroll();
      this.resume();
    } catch {
      this.#options.onFailure();
    }
  }

  pause() {
    this.#paused = true;
    cancelAnimationFrame(this.#frame);
    this.#frame = 0;
  }

  resume() {
    if (this.#disposed || !this.#renderer) return;
    this.#paused = false;
    this.#schedule();
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    this.pause();
    this.#events.abort();
    this.#resizeObserver?.disconnect();
    this.#options.onPointerOwnershipChange?.(false);
    for (const object of [this.#garment, this.#ribbons, this.#lines, this.#points]) {
      object?.geometry.dispose();
      object?.material.dispose();
    }
    this.#renderer?.dispose();
    this.#renderer?.forceContextLoss();
    this.#renderer?.domElement.remove();
    this.#scene?.clear();
  }

  #createScene() {
    if (!this.#scene) return;
    const shared = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uCoverage: { value: 0 },
      uReveal: { value: 0 },
      uExit: { value: 0 },
      uPortrait: { value: this.#options.portrait ? 1 : 0 },
      uPointer: { value: this.#pointerCurrent },
      uDpr: { value: 1 },
    };

    this.#garment = new THREE.Mesh(
      this.#buildGarmentGeometry(),
      new THREE.ShaderMaterial({
        vertexShader: garmentVertex,
        fragmentShader: garmentFragment,
        uniforms: shared,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    this.#garment.renderOrder = 2;

    this.#ribbons = new THREE.Mesh(
      this.#buildRibbonGeometry(),
      new THREE.ShaderMaterial({
        vertexShader: ribbonVertex,
        fragmentShader: ribbonFragment,
        uniforms: shared,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    this.#ribbons.renderOrder = 1;

    this.#lines = new THREE.LineSegments(
      this.#buildLineGeometry(),
      new THREE.ShaderMaterial({
        vertexShader: lineVertex,
        fragmentShader: lineFragment,
        uniforms: shared,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.#lines.renderOrder = 3;

    this.#points = new THREE.Points(
      this.#buildPointGeometry(),
      new THREE.ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        uniforms: shared,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.#points.renderOrder = 4;
    this.#scene.add(this.#ribbons, this.#garment, this.#lines, this.#points);
  }

  #buildGarmentGeometry() {
    const positions: number[] = [];
    const uvs: number[] = [];
    const panels: number[] = [];
    const indices: number[] = [];
    const sx = this.#quality.garmentX;
    const sy = this.#quality.garmentY;
    const panelOrder =
      this.#quality.panelCount === 5 ? [0, 1, 2, 3, 5] : [0, 1, 3, 4, 2, 5];

    for (const panel of panelOrder) {
      const offset = positions.length / 3;
      for (let y = 0; y <= sy; y += 1) {
        for (let x = 0; x <= sx; x += 1) {
          positions.push((x / sx) * 2 - 1, (y / sy) * 2 - 1, 0);
          uvs.push(x / sx, y / sy);
          panels.push(panel);
        }
      }
      for (let y = 0; y < sy; y += 1) {
        for (let x = 0; x < sx; x += 1) {
          const a = offset + y * (sx + 1) + x;
          const b = a + 1;
          const c = a + sx + 1;
          const d = c + 1;
          indices.push(a, c, b, b, c, d);
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setAttribute("aPanel", new THREE.Float32BufferAttribute(panels, 1));
    geometry.setIndex(indices);
    geometry.computeBoundingSphere();
    return geometry;
  }

  #buildRibbonGeometry() {
    const paths = this.#options.portrait
      ? [
          [
            [-0.35, -0.65, -0.38],
            [-1.15, -0.25, -0.42],
            [-1.65, 0.55, -0.62],
            [-2.35, 0.15, -0.75],
          ],
          [
            [0.42, -0.48, -0.46],
            [1.05, 0.05, -0.34],
            [1.6, -0.35, -0.54],
            [2.25, 0.32, -0.72],
          ],
        ]
      : [
          [
            [-0.48, -0.55, -0.34],
            [-1.75, -1.05, -0.08],
            [-3.25, -0.3, 0.05],
            [-5.7, -1.02, -0.42],
          ],
          [
            [-0.35, -0.05, -0.58],
            [-1.75, 0.82, -0.72],
            [-3.75, 0.12, -0.35],
            [-6.15, 0.84, -0.76],
          ],
          [
            [0.46, -0.62, -0.28],
            [1.72, -0.9, 0.08],
            [3.35, -0.15, -0.12],
            [5.8, -0.78, -0.5],
          ],
          [
            [0.34, -0.06, -0.64],
            [1.68, 0.68, -0.46],
            [3.6, 0.02, -0.24],
            [6.18, 0.66, -0.82],
          ],
        ];

    const positions: number[] = [];
    const uvs: number[] = [];
    const ribbons: number[] = [];
    const indices: number[] = [];
    const segments = this.#quality.ribbonSegments;

    paths.forEach((controlPoints, ribbonIndex) => {
      const points = controlPoints.map(
        ([x, y, z]) => new THREE.Vector3(x, y, z),
      );
      const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
      const offset = positions.length / 3;
      for (let segment = 0; segment <= segments; segment += 1) {
        const t = segment / segments;
        const point = curve.getPoint(t);
        const tangent = curve.getTangent(t).normalize();
        const cross = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
        const baseWidth = this.#options.portrait ? 0.34 : 0.48;
        const width =
          baseWidth *
          (0.62 + Math.sin(Math.PI * t) * 0.75) *
          (1 + ribbonIndex * 0.055);
        for (const side of [-1, 1]) {
          const vertex = point.clone().addScaledVector(cross, width * side);
          positions.push(vertex.x, vertex.y, vertex.z);
          uvs.push(t, side < 0 ? 0 : 1);
          ribbons.push(ribbonIndex);
        }
      }
      for (let segment = 0; segment < segments; segment += 1) {
        const a = offset + segment * 2;
        indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setAttribute("aRibbon", new THREE.Float32BufferAttribute(ribbons, 1));
    geometry.setIndex(indices);
    geometry.computeBoundingSphere();
    return geometry;
  }

  #buildLineGeometry() {
    const positions: number[] = [];
    const kinds: number[] = [];
    const orders: number[] = [];
    const addSegment = (
      a: THREE.Vector3,
      b: THREE.Vector3,
      kind: number,
      order: number,
    ) => {
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      kinds.push(kind, kind);
      orders.push(order, order);
    };
    const addPath = (path: THREE.Vector3[], kind: number, order: number) => {
      for (let index = 1; index < path.length; index += 1) {
        addSegment(path[index - 1]!, path[index]!, kind, order);
      }
    };

    const scaleX = this.#options.portrait ? 0.68 : 1;
    const silhouette = (side: -1 | 1) =>
      Array.from({ length: 34 }, (_, index) => {
        const y = 0.12 + (index / 33) * 0.83;
        return new THREE.Vector3(
          side * this.#garmentWidth(y) * 1.75 * scaleX,
          (y - 0.5) * (this.#options.portrait ? 5.12 : 4.92) - 0.1,
          0.31,
        );
      });
    addPath(silhouette(-1), 0, 0.13);
    addPath(silhouette(1), 0, 0.13);
    addPath(
      [
        new THREE.Vector3(-0.22 * scaleX, 1.72, 0.32),
        new THREE.Vector3(0, 1.42, 0.34),
        new THREE.Vector3(0.24 * scaleX, 1.72, 0.32),
      ],
      0,
      0.02,
    );
    addPath(
      [
        new THREE.Vector3(-0.56 * scaleX, 0.45, 0.32),
        new THREE.Vector3(0, 0.24, 0.34),
        new THREE.Vector3(0.58 * scaleX, 0.45, 0.32),
      ],
      0,
      0.21,
    );
    addPath(
      [
        new THREE.Vector3(-0.52 * scaleX, 1.05, 0.33),
        new THREE.Vector3(0.48 * scaleX, -1.45, 0.35),
      ],
      0,
      0.3,
    );
    addPath(
      [
        new THREE.Vector3(0.52 * scaleX, 1.05, 0.33),
        new THREE.Vector3(-0.44 * scaleX, -1.55, 0.35),
      ],
      0,
      0.34,
    );

    const motifCount = this.#quality.embroideryMotifs;
    for (let motif = 0; motif < motifCount; motif += 1) {
      const seed = this.#seed(motif + 17);
      const side = motif % 3 === 0 ? -1 : motif % 3 === 1 ? 1 : seed - 0.5;
      const baseY = -2.05 + seed * 2.25;
      const baseX =
        side *
        (0.16 + this.#seed(motif * 7 + 3) * (1.1 - (baseY + 2.05) * 0.22)) *
        scaleX;
      const height = 0.28 + this.#seed(motif * 11 + 5) * 0.32;
      const vine: THREE.Vector3[] = [];
      for (let step = 0; step <= 12; step += 1) {
        const t = step / 12;
        vine.push(
          new THREE.Vector3(
            baseX + Math.sin(t * Math.PI * 1.6 + motif) * 0.07 * scaleX,
            baseY + t * height,
            0.37,
          ),
        );
      }
      const order = motif / Math.max(1, motifCount - 1);
      addPath(vine, 1, order);
      for (let leaf = 3; leaf <= 10; leaf += 3) {
        const anchor = vine[leaf]!;
        const direction = (leaf + motif) % 2 === 0 ? -1 : 1;
        const length = 0.1 + this.#seed(motif * 19 + leaf) * 0.07;
        addPath(
          [
            anchor,
            new THREE.Vector3(
              anchor.x + direction * length * scaleX,
              anchor.y + 0.055,
              0.375,
            ),
            new THREE.Vector3(
              anchor.x + direction * length * 0.45 * scaleX,
              anchor.y + 0.105,
              0.372,
            ),
            anchor,
          ],
          1,
          order,
        );
      }
      const top = vine[vine.length - 1]!;
      for (let petal = 0; petal < 5; petal += 1) {
        const angle = (petal / 5) * Math.PI * 2;
        addPath(
          [
            top,
            new THREE.Vector3(
              top.x + Math.cos(angle) * 0.07 * scaleX,
              top.y + Math.sin(angle) * 0.07,
              0.38,
            ),
            new THREE.Vector3(
              top.x + Math.cos(angle + 0.42) * 0.035 * scaleX,
              top.y + Math.sin(angle + 0.42) * 0.035,
              0.38,
            ),
            top,
          ],
          1,
          order,
        );
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aKind", new THREE.Float32BufferAttribute(kinds, 1));
    geometry.setAttribute("aOrder", new THREE.Float32BufferAttribute(orders, 1));
    geometry.computeBoundingSphere();
    return geometry;
  }

  #buildPointGeometry() {
    const positions: number[] = [];
    const sizes: number[] = [];
    const phases: number[] = [];
    const strengths: number[] = [];
    const kinds: number[] = [];
    const portrait = this.#options.portrait;

    for (let index = 0; index < this.#quality.particleCount; index += 1) {
      const xSeed = this.#seed(index * 5 + 1);
      const ySeed = this.#seed(index * 7 + 2);
      const side = index % 2 === 0 ? -1 : 1;
      const clustered = index % 5 !== 0;
      const xRange = portrait ? 2.15 : 5.75;
      const radial = clustered
        ? (portrait ? 0.64 : 1.15) + xSeed * (portrait ? 1.15 : 2.55)
        : (portrait ? 0.3 : 0.8) + xSeed * xRange;
      const x = side * radial + Math.sin(index * 1.73) * 0.12;
      const y = -2.15 + ySeed * 4.35;
      const quiet = Math.abs(x) < (portrait ? 0.7 : 1.25) && y > -0.7 && y < 1.2;
      positions.push(x, y, -0.18 - (index % 5) * 0.09);
      sizes.push((quiet ? 0.6 : 1) * (0.72 + this.#seed(index * 13) * 1.35));
      phases.push(this.#seed(index * 17) * Math.PI * 2);
      strengths.push(this.#seed(index * 23));
      kinds.push(0);
    }

    const beadCount = portrait ? 76 : 148;
    const scaleX = portrait ? 0.68 : 1;
    for (let index = 0; index < beadCount; index += 1) {
      const seed = this.#seed(index * 29 + 9);
      const y = 0.08 + seed * 0.44;
      const side = index % 3 === 0 ? -1 : index % 3 === 1 ? 1 : 0.18;
      const x =
        side *
        this.#garmentWidth(y) *
        (0.18 + this.#seed(index * 31) * 0.62) *
        1.55 *
        scaleX;
      positions.push(
        x + Math.sin(index * 2.1) * 0.045,
        (y - 0.5) * (portrait ? 5.12 : 4.92) - 0.1,
        0.41,
      );
      sizes.push(1.05 + this.#seed(index * 37) * 1.1);
      phases.push(this.#seed(index * 41) * Math.PI * 2);
      strengths.push(this.#seed(index * 43));
      kinds.push(1);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
    geometry.setAttribute("aStrength", new THREE.Float32BufferAttribute(strengths, 1));
    geometry.setAttribute("aKind", new THREE.Float32BufferAttribute(kinds, 1));
    geometry.computeBoundingSphere();
    return geometry;
  }

  #garmentWidth(y: number) {
    const smooth = (start: number, end: number, value: number) => {
      const n = Math.max(0, Math.min(1, (value - start) / (end - start)));
      return n * n * (3 - 2 * n);
    };
    if (y < 0.47) return THREE.MathUtils.lerp(1.42, 0.59, smooth(0.02, 0.47, y));
    if (y < 0.61) return THREE.MathUtils.lerp(0.59, 0.335, smooth(0.47, 0.61, y));
    if (y < 0.83) return THREE.MathUtils.lerp(0.335, 0.53, smooth(0.61, 0.83, y));
    return THREE.MathUtils.lerp(0.53, 0.365, smooth(0.83, 1, y));
  }

  #seed(value: number) {
    const sine = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
    return sine - Math.floor(sine);
  }

  #bindEvents() {
    const signal = this.#events.signal;
    window.addEventListener("scroll", this.#onScroll, { passive: true, signal });
    window.addEventListener(
      "pointermove",
      (event) => {
        if (this.#options.portrait) return;
        this.#pointerTarget.set(
          event.clientX / Math.max(1, innerWidth) - 0.5,
          event.clientY / Math.max(1, innerHeight) - 0.5,
        );
        this.#options.onPointerOwnershipChange?.(true);
        this.#schedule();
      },
      { passive: true, signal },
    );
    window.addEventListener("pointerleave", () => {
      this.#pointerTarget.set(0, 0);
      this.#options.onPointerOwnershipChange?.(false);
    }, { signal });
    window.addEventListener("orientationchange", this.#onOrientation, { signal });
    this.#renderer?.domElement.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        this.#options.onFailure();
      },
      { signal },
    );
    this.#resizeObserver = new ResizeObserver(() => this.#measure());
    this.#resizeObserver.observe(this.#options.mount);
  }

  #onOrientation = () => {
    if (
      this.#options.portrait !==
      matchMedia("(orientation: portrait)").matches
    ) {
      this.#options.onIneligible();
    }
  };

  #onScroll = () => {
    const rect = this.#options.root.getBoundingClientRect();
    const travel = Math.max(1, this.#options.root.offsetHeight - innerHeight);
    this.#scrollTarget = THREE.MathUtils.clamp(-rect.top / travel, 0, 1);
    this.#schedule();
  };

  #measure() {
    if (!this.#renderer || !this.#camera) return;
    const width = Math.max(1, this.#options.mount.clientWidth);
    const height = Math.max(1, this.#options.mount.clientHeight);
    const dpr = Math.min(devicePixelRatio || 1, this.#quality.dpr);
    this.#renderer.setPixelRatio(dpr);
    this.#renderer.setSize(width, height, false);
    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    if (this.#points) this.#points.material.uniforms.uDpr.value = dpr;
    this.#schedule();
  }

  #schedule() {
    if (this.#paused || this.#disposed || this.#frame) return;
    this.#frame = requestAnimationFrame(this.#render);
  }

  #render = (now: number) => {
    this.#frame = 0;
    if (
      this.#paused ||
      this.#disposed ||
      !this.#renderer ||
      !this.#scene ||
      !this.#camera ||
      !this.#garment ||
      !this.#ribbons ||
      !this.#lines ||
      !this.#points
    ) {
      return;
    }

    const elapsed = (now - this.#startTime) / 1000;
    const intro = THREE.MathUtils.clamp(elapsed / 2.1, 0, 1);
    this.#scrollCurrent += (this.#scrollTarget - this.#scrollCurrent) * 0.085;
    this.#pointerCurrent.lerp(this.#pointerTarget, 0.045);
    const progress = this.#options.portrait
      ? this.#scrollCurrent
      : Math.max(intro * 0.9, this.#scrollCurrent);
    const exit = this.#smoothRange(0.94, 0.995, this.#scrollCurrent);
    const coverage = this.#smoothRange(0.26, 0.68, progress);

    for (const object of [this.#garment, this.#ribbons, this.#lines, this.#points]) {
      const uniforms = object.material.uniforms;
      if (uniforms.uTime) uniforms.uTime.value = elapsed;
      if (uniforms.uProgress) uniforms.uProgress.value = progress;
      if (uniforms.uCoverage) uniforms.uCoverage.value = coverage;
      if (uniforms.uReveal) uniforms.uReveal.value = progress;
      if (uniforms.uExit) uniforms.uExit.value = exit;
    }

    if (now - this.#lastRender >= 32 || !this.#ready) {
      this.#renderer.render(this.#scene, this.#camera);
      this.#lastRender = now;
      if (!this.#ready) {
        this.#ready = true;
        this.#options.onReady();
      }
    }

    this.#updateState(progress, exit);
    const smoothing =
      Math.abs(this.#scrollTarget - this.#scrollCurrent) > 0.001 ||
      this.#pointerCurrent.distanceToSquared(this.#pointerTarget) > 0.00001;
    if (intro < 1 || smoothing || (progress > 0.48 && exit < 0.995)) {
      this.#schedule();
    }
  };

  #updateState(progress: number, exit: number) {
    let next: HeroState;
    if (exit > 0.64) next = "SECTION_HANDOFF";
    else if (exit > 0.02) next = "UNRAVEL";
    else if (progress >= 0.88) next = "IDLE_BREATH";
    else if (progress >= 0.72) next = "MOTIF_EMERGE";
    else if (progress >= 0.42) next = "COUTURE_FORM";
    else if (progress >= 0.12) next = "WEAVE_FORM";
    else next = "THREADS_ENTER";
    if (next === this.#state) return;
    this.#state = next;
    this.#options.onStateChange(next);
  }

  #smoothRange(start: number, end: number, value: number) {
    const n = THREE.MathUtils.clamp(
      (value - start) / Math.max(0.0001, end - start),
      0,
      1,
    );
    return n * n * (3 - 2 * n);
  }
}

export function createProceduralCouture(
  options: ProceduralCoutureOptions,
): HeroRenderer {
  return new ProceduralCoutureRenderer(options);
}
