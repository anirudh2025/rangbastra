import * as THREE from "three";
import type { HeroRenderer, HeroState } from "./states";

type PremiumTier = "A" | "B" | "C";

interface CoutureSceneOptions {
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
  garmentLayers: number;
  drapeSegments: number;
  drapeBands: number;
  handworkClusters: number;
  particles: number;
  beads: number;
  dpr: number;
}

const QUALITY: Record<PremiumTier, SceneQuality> = {
  A: {
    garmentX: 58,
    garmentY: 74,
    garmentLayers: 5,
    drapeSegments: 64,
    drapeBands: 6,
    handworkClusters: 18,
    particles: 1080,
    beads: 150,
    dpr: 1.5,
  },
  B: {
    garmentX: 44,
    garmentY: 58,
    garmentLayers: 5,
    drapeSegments: 48,
    drapeBands: 5,
    handworkClusters: 13,
    particles: 630,
    beads: 100,
    dpr: 1.25,
  },
  C: {
    garmentX: 32,
    garmentY: 46,
    garmentLayers: 4,
    drapeSegments: 34,
    drapeBands: 4,
    handworkClusters: 7,
    particles: 350,
    beads: 64,
    dpr: 1.2,
  },
};

const garmentVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uExit;
  uniform float uPortrait;
  uniform float uScroll;
  uniform vec2 uPointer;
  attribute float aLayer;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vLayer;
  varying float vFold;

  float ease(float value) {
    return value * value * (3.0 - 2.0 * value);
  }

  float coutureWidth(float y) {
    float hem = mix(1.62, 0.76, ease(clamp(y / 0.43, 0.0, 1.0)));
    float hip = mix(0.76, 0.36, ease(clamp((y - 0.43) / 0.18, 0.0, 1.0)));
    float bodice = mix(0.36, 0.57, ease(clamp((y - 0.61) / 0.23, 0.0, 1.0)));
    float top = mix(0.57, 0.39, ease(clamp((y - 0.84) / 0.16, 0.0, 1.0)));
    return y < 0.43 ? hem : y < 0.61 ? hip : y < 0.84 ? bodice : top;
  }

  void main() {
    vUv = uv;
    vLayer = aLayer;
    float y = uv.y;
    float nx = position.x;
    float portraitScale = mix(1.0, 0.7, uPortrait);
    float width = coutureWidth(y);
    float lower = 1.0 - smoothstep(0.48, 0.82, y);

    vec3 shaped = vec3(
      nx * width * 1.72 * portraitScale,
      (y - 0.5) * mix(5.05, 5.36, uPortrait) - 0.12,
      -0.28 + aLayer * 0.13
    );

    float sweetheart = smoothstep(0.87, 1.0, y) *
      (1.0 - pow(abs(nx), 0.58));
    shaped.y -= sweetheart * 0.34;
    shaped.x += lower * (0.05 * sin(y * 7.0 + aLayer * 1.9));
    shaped.x += lower * 0.075 * (1.0 - y) * mix(-0.35, 0.65, aLayer / 4.0);

    float foldA = sin(nx * (7.3 + aLayer * 0.71) + y * 3.1 + aLayer * 1.37);
    float foldB = sin(nx * (3.25 + aLayer * 0.43) - y * 5.2 - aLayer * 0.82);
    float foldC = sin((nx * 1.7 + y * 2.2) * 4.1 + aLayer * 2.17);
    float fold = foldA * 0.068 + foldB * 0.041 + foldC * 0.019;
    shaped.z += fold * (0.28 + lower * 1.35);
    shaped.z += sin(uTime * 0.08 + y * 2.0 + aLayer) * 0.008 * lower;
    shaped.z += uScroll * fold * 0.08;

    float gather = smoothstep(0.05, 0.52, uProgress);
    shaped.x *= mix(0.86, 1.0, gather);
    shaped.z *= mix(0.68, 1.0, gather);
    shaped.y += (1.0 - gather) * lower * 0.08;

    shaped.x += uPointer.x * lower * 0.018 * (1.0 - uPortrait);
    shaped.z += uPointer.y * lower * 0.014 * (1.0 - uPortrait);
    shaped.x += sign(nx + 0.001) * uExit * lower * 0.12;
    shaped.y -= uExit * lower * 0.1;

    vFold = fold;
    vec4 world = modelMatrix * vec4(shaped, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const garmentFragment = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uExit;
  uniform float uPortrait;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vLayer;
  varying float vFold;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    float nx = vUv.x * 2.0 - 1.0;
    float y = vUv.y;
    float lower = 1.0 - smoothstep(0.48, 0.8, y);

    float layerMask = 1.0;
    if (vLayer < 0.5) layerMask = 0.48;
    else if (vLayer < 1.5) layerMask = 1.0 - smoothstep(0.03, 0.24, vUv.x);
    else if (vLayer < 2.5) layerMask = smoothstep(0.76, 0.97, vUv.x);
    else if (vLayer < 3.5) layerMask = 1.0 - smoothstep(0.32, 0.55, abs(nx));
    else layerMask = lower * 0.28;

    float edge = smoothstep(0.0, 0.035, vUv.x) *
      (1.0 - smoothstep(0.965, 1.0, vUv.x));
    float verticalEdge = smoothstep(0.0, 0.025, y) *
      (1.0 - smoothstep(0.982, 1.0, y));

    float frontA = y * 0.72 + abs(nx) * 0.1;
    float frontB = y * 0.43 + (nx * 0.5 + 0.5) * 0.18;
    float variation = (hash21(floor(vUv * vec2(28.0, 42.0))) - 0.5) * 0.045;
    float coverage = max(
      smoothstep(frontA - 0.13, frontA + 0.08, uProgress + variation),
      smoothstep(frontB - 0.2, frontB + 0.08, uProgress - 0.08)
    );

    vec3 normal = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    if (!gl_FrontFacing) normal = -normal;
    vec3 viewDirection = normalize(cameraPosition - vWorld);
    vec3 lightDirection = normalize(vec3(
      -0.28 + uPointer.x * 0.13,
      0.62 + uPointer.y * 0.06,
      0.74
    ));
    vec3 halfDirection = normalize(viewDirection + lightDirection);
    float diffuse = max(dot(normal, lightDirection), 0.0);
    float grazing = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.5);
    float broadSheen = pow(max(dot(normal, halfDirection), 0.0), 4.5);
    float silkSheen = pow(max(dot(normal, halfDirection), 0.0), 21.0);
    float foldLight = pow(0.5 + 0.5 * sin(nx * 19.0 + y * 5.0 + vLayer), 8.0) * lower;

    float warp = abs(sin((vUv.x * 430.0 + sin(vUv.y * 17.0) * 0.35) * 3.14159));
    float weft = abs(sin((vUv.y * 280.0 + sin(vUv.x * 11.0) * 0.28) * 3.14159));
    float weave = smoothstep(0.9 - fwidth(warp), 0.9 + fwidth(warp), warp) * 0.7 +
      smoothstep(0.92 - fwidth(weft), 0.92 + fwidth(weft), weft) * 0.3;

    vec3 black = vec3(0.0035, 0.003, 0.0027);
    vec3 warmBlack = vec3(0.047, 0.023, 0.014);
    vec3 cocoa = vec3(0.17, 0.078, 0.038);
    vec3 litCocoa = vec3(0.34, 0.17, 0.078);
    vec3 antiqueGold = vec3(0.56, 0.36, 0.15);
    float lightArrival = smoothstep(0.18, 0.68, uProgress);

    vec3 color = mix(black, warmBlack, 0.36 + diffuse * 0.34);
    color += cocoa * broadSheen * (0.48 + lightArrival * 0.58);
    color += litCocoa * silkSheen * (0.24 + lightArrival * 0.68);
    color += antiqueGold * grazing * silkSheen * 0.22;
    color += litCocoa * foldLight * (0.09 + lightArrival * 0.2);
    color += vec3(0.19, 0.13, 0.075) * weave * silkSheen * 0.018;
    color *= 0.84 + smoothstep(0.018, 0.09, abs(vFold)) * 0.3;

    float alpha = coverage * layerMask * edge * verticalEdge;
    alpha *= mix(0.78, 1.0, lightArrival) * (1.0 - uExit * 0.68);
    if (alpha < 0.006) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const drapeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uExit;
  uniform float uPortrait;
  uniform float uScroll;
  uniform vec2 uPointer;
  attribute float aDrape;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vDrape;
  varying float vFold;

  void main() {
    vUv = uv;
    vDrape = aDrape;
    float across = uv.y * 2.0 - 1.0;
    float along = uv.x;
    vec3 shaped = position;
    float slow = uTime * (0.024 + aDrape * 0.004);
    float fold =
      sin(across * (4.2 + aDrape * 0.7) + along * 2.3 + slow + aDrape) * 0.045 +
      sin(across * 2.1 - along * 4.4 - slow * 0.7) * 0.024;
    shaped.z += fold * (0.48 + abs(across) * 0.42);
    shaped.y += sin(along * 2.8 + aDrape * 1.4 + slow) * 0.015;
    shaped.z += uScroll * sin(along * 3.14159) * (0.035 + aDrape * 0.012);
    shaped.x += uPointer.x * along * 0.018 * (1.0 - uPortrait);
    shaped.z += uPointer.y * 0.012 * (1.0 - uPortrait);
    shaped.x += sign(position.x + 0.001) * uExit * along * 0.24;
    shaped.z -= uExit * 0.18;
    vFold = fold;
    vec4 world = modelMatrix * vec4(shaped, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const drapeFragment = /* glsl */ `
  uniform float uProgress;
  uniform float uExit;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vDrape;
  varying float vFold;

  void main() {
    vec3 normal = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    if (!gl_FrontFacing) normal = -normal;
    vec3 viewDirection = normalize(cameraPosition - vWorld);
    vec3 lightDirection = normalize(vec3(-0.18, 0.54, 0.82));
    vec3 halfDirection = normalize(viewDirection + lightDirection);
    float sheen = pow(max(dot(normal, halfDirection), 0.0), 12.0);
    float grazing = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.4);
    float edge = pow(abs(vUv.y * 2.0 - 1.0), 7.0);
    float endFade = smoothstep(0.01, 0.09, vUv.x) *
      (1.0 - smoothstep(0.87, 1.0, vUv.x));
    float reveal = smoothstep(0.08 + vDrape * 0.035, 0.5, uProgress);
    float rear = vDrape > 1.5 ? 0.26 : 1.0;

    vec3 black = vec3(0.0025);
    vec3 cocoa = vec3(0.13, 0.059, 0.028);
    vec3 gold = vec3(0.48, 0.29, 0.11);
    vec3 color = mix(black, cocoa, 0.28 + sheen * 0.72);
    color += gold * (grazing * sheen * 0.34 + edge * sheen * 0.34);
    color *= 0.72 + smoothstep(0.012, 0.06, abs(vFold)) * 0.28;

    float alpha = endFade * reveal * rear *
      (0.09 + sheen * 0.24 + edge * 0.1);
    alpha *= 1.0 - uExit * 0.74;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const handworkVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uExit;
  uniform float uScroll;
  attribute float aOrder;
  attribute float aIntensity;
  varying float vAlpha;
  varying float vIntensity;

  void main() {
    float reveal = smoothstep(
      0.61 + aOrder * 0.2,
      0.72 + aOrder * 0.2,
      uProgress
    );
    vAlpha = reveal * (1.0 - uExit * 0.58);
    vIntensity = aIntensity;
    vec3 stitched = position;
    stitched.z += sin(position.x * 4.7 + position.y * 1.8) *
      0.022 * (1.0 + uScroll * 0.18);
    stitched.x += sin(uTime * 0.045 + position.y * 1.3) * 0.002;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(stitched, 1.0);
  }
`;

const handworkFragment = /* glsl */ `
  varying float vAlpha;
  varying float vIntensity;
  void main() {
    vec3 deepZari = vec3(0.38, 0.225, 0.085);
    vec3 brightZari = vec3(0.76, 0.53, 0.245);
    vec3 color = mix(deepZari, brightZari, vIntensity);
    float alpha = vAlpha * (0.28 + vIntensity * 0.48);
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uExit;
  uniform float uDpr;
  uniform float uScroll;
  attribute float aSize;
  attribute float aPhase;
  attribute float aStrength;
  attribute float aKind;
  varying float vAlpha;
  varying float vRare;
  varying float vKind;

  void main() {
    float arrival = smoothstep(0.16 + aStrength * 0.12, 0.76, uProgress);
    float beadArrival = smoothstep(0.65 + aStrength * 0.12, 0.88, uProgress);
    float pulse = pow(
      max(0.0, sin(uTime * (0.12 + aStrength * 0.08) + aPhase)),
      20.0
    );
    vKind = aKind;
    vRare = step(0.972, aStrength);
    vAlpha = mix(arrival, beadArrival, aKind) *
      (0.25 + pulse * 0.75) * (1.0 - uExit * 0.42);
    vec3 point = position;
    point.z += sin(uTime * 0.018 + aPhase) * 0.008 * aStrength;
    point.x += uScroll * (position.z + 1.5) * 0.006;
    vec4 view = modelViewMatrix * vec4(point, 1.0);
    gl_PointSize = (aSize + pulse * vRare * 3.2) * uDpr;
    gl_Position = projectionMatrix * view;
  }
`;

const particleFragment = /* glsl */ `
  varying float vAlpha;
  varying float vRare;
  varying float vKind;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float radius = length(p);
    float pin = 1.0 - smoothstep(0.04, 0.5, radius);
    float horizontal = exp(-abs(p.x) * 36.0) * exp(-abs(p.y) * 5.0);
    float vertical = exp(-abs(p.y) * 36.0) * exp(-abs(p.x) * 5.0);
    float flare = (horizontal + vertical) * vRare;
    vec3 dust = vec3(0.71, 0.43, 0.17);
    vec3 pearl = vec3(0.9, 0.78, 0.58);
    vec3 color = mix(dust, pearl, vKind);
    float alpha = (pin + flare * 0.44) * vAlpha * mix(0.66, 0.86, vKind);
    if (alpha < 0.012) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

class AtelierGravityRenderer implements HeroRenderer {
  #options: CoutureSceneOptions;
  #quality: SceneQuality;
  #renderer?: THREE.WebGLRenderer;
  #scene?: THREE.Scene;
  #camera?: THREE.PerspectiveCamera;
  #garment?: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  #drapes?: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  #handwork?: THREE.LineSegments<THREE.BufferGeometry, THREE.ShaderMaterial>;
  #particles?: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  #events = new AbortController();
  #resizeObserver?: ResizeObserver;
  #frame = 0;
  #lastFrame = 0;
  #startTime = 0;
  #scrollTarget = 0;
  #scrollCurrent = 0;
  #pointerTarget = new THREE.Vector2();
  #pointerCurrent = new THREE.Vector2();
  #state: HeroState;
  #paused = true;
  #disposed = false;
  #ready = false;
  #stableFrames = 0;

  constructor(options: CoutureSceneOptions) {
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
        this.#options.portrait ? 31 : 33,
        1,
        0.1,
        30,
      );
      this.#camera.position.set(0, this.#options.portrait ? 0.02 : 0.06, 9.15);
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
      this.#startTime = performance.now();
      this.#readScroll(false);
      this.#scrollCurrent = this.#scrollTarget;
      this.#primeStateMachine();
      this.#measure();
      this.#renderer.compile(this.#scene, this.#camera);
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
    for (const object of [
      this.#garment,
      this.#drapes,
      this.#handwork,
      this.#particles,
    ]) {
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
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uExit: { value: 0 },
      uPortrait: { value: this.#options.portrait ? 1 : 0 },
      uScroll: { value: 0 },
      uPointer: { value: this.#pointerCurrent },
      uDpr: { value: 1 },
    };

    this.#drapes = new THREE.Mesh(
      this.#buildDrapeGeometry(),
      new THREE.ShaderMaterial({
        vertexShader: drapeVertex,
        fragmentShader: drapeFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    this.#drapes.renderOrder = 1;

    this.#garment = new THREE.Mesh(
      this.#buildGarmentGeometry(),
      new THREE.ShaderMaterial({
        vertexShader: garmentVertex,
        fragmentShader: garmentFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    this.#garment.renderOrder = 2;

    this.#handwork = new THREE.LineSegments(
      this.#buildHandworkGeometry(),
      new THREE.ShaderMaterial({
        vertexShader: handworkVertex,
        fragmentShader: handworkFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.#handwork.renderOrder = 3;

    this.#particles = new THREE.Points(
      this.#buildParticleGeometry(),
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.#particles.renderOrder = 4;

    this.#scene.add(
      this.#drapes,
      this.#garment,
      this.#handwork,
      this.#particles,
    );
  }

  #buildGarmentGeometry() {
    const positions: number[] = [];
    const uvs: number[] = [];
    const layers: number[] = [];
    const indices: number[] = [];
    const sx = this.#quality.garmentX;
    const sy = this.#quality.garmentY;

    for (let layer = 0; layer < this.#quality.garmentLayers; layer += 1) {
      const offset = positions.length / 3;
      for (let y = 0; y <= sy; y += 1) {
        for (let x = 0; x <= sx; x += 1) {
          positions.push((x / sx) * 2 - 1, (y / sy) * 2 - 1, 0);
          uvs.push(x / sx, y / sy);
          layers.push(layer);
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
    geometry.setAttribute("aLayer", new THREE.Float32BufferAttribute(layers, 1));
    geometry.setIndex(indices);
    geometry.computeBoundingSphere();
    return geometry;
  }

  #buildDrapeGeometry() {
    const portrait = this.#options.portrait;
    const paths = portrait
      ? [
          [
            [-0.35, -0.72, -0.42],
            [-1.02, -0.42, -0.36],
            [-1.58, 0.38, -0.58],
            [-2.3, 0.1, -0.9],
          ],
          [
            [0.44, -0.58, -0.34],
            [1.08, -0.08, -0.28],
            [1.56, -0.48, -0.52],
            [2.26, 0.24, -0.86],
          ],
        ]
      : [
          [
            [-0.52, -0.72, -0.22],
            [-1.8, -1.02, 0.08],
            [-3.42, -0.12, -0.12],
            [-6.25, -0.78, -0.62],
          ],
          [
            [0.5, -0.62, -0.16],
            [1.92, -0.88, 0.12],
            [3.62, 0.08, -0.16],
            [6.35, -0.48, -0.58],
          ],
          [
            [-0.08, 0.32, -1.12],
            [-1.45, 1.08, -1.24],
            [1.72, 0.78, -1.38],
            [5.65, 1.14, -1.5],
          ],
        ];

    const positions: number[] = [];
    const uvs: number[] = [];
    const drapes: number[] = [];
    const indices: number[] = [];
    const segments = this.#quality.drapeSegments;
    const bands = this.#quality.drapeBands;

    paths.forEach((controls, drapeIndex) => {
      const curve = new THREE.CatmullRomCurve3(
        controls.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
        false,
        "centripetal",
      );
      const offset = positions.length / 3;
      for (let segment = 0; segment <= segments; segment += 1) {
        const t = segment / segments;
        const point = curve.getPoint(t);
        const tangent = curve.getTangent(t).normalize();
        const cross = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
        const baseWidth = portrait ? 0.38 : 0.58;
        const width =
          baseWidth *
          (0.54 + Math.sin(Math.PI * t) * 0.9) *
          (drapeIndex === 2 ? 1.22 : 1);
        for (let band = 0; band <= bands; band += 1) {
          const across = band / bands;
          const signed = across * 2 - 1;
          const vertex = point.clone().addScaledVector(cross, width * signed);
          vertex.z += Math.cos(signed * Math.PI) * 0.035;
          positions.push(vertex.x, vertex.y, vertex.z);
          uvs.push(t, across);
          drapes.push(drapeIndex);
        }
      }
      for (let segment = 0; segment < segments; segment += 1) {
        for (let band = 0; band < bands; band += 1) {
          const a = offset + segment * (bands + 1) + band;
          const b = a + 1;
          const c = a + bands + 1;
          const d = c + 1;
          indices.push(a, c, b, b, c, d);
        }
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setAttribute("aDrape", new THREE.Float32BufferAttribute(drapes, 1));
    geometry.setIndex(indices);
    geometry.computeBoundingSphere();
    return geometry;
  }

  #buildHandworkGeometry() {
    const positions: number[] = [];
    const orders: number[] = [];
    const intensities: number[] = [];
    const scaleX = this.#options.portrait ? 0.7 : 1;
    const addDash = (
      a: THREE.Vector3,
      b: THREE.Vector3,
      order: number,
      intensity: number,
    ) => {
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      orders.push(order, order);
      intensities.push(intensity, intensity);
    };

    for (let cluster = 0; cluster < this.#quality.handworkClusters; cluster += 1) {
      const seed = this.#seed(cluster * 17 + 5);
      const side = cluster % 2 === 0 ? -1 : 1;
      const y = -2.12 + Math.pow(seed, 1.7) * 1.95;
      const widthAtY = 1.18 - (y + 2.12) * 0.34;
      const x =
        side *
        (0.18 + this.#seed(cluster * 23 + 9) * Math.max(0.18, widthAtY)) *
        scaleX;
      const height = 0.24 + this.#seed(cluster * 29 + 3) * 0.38;
      const lean = (this.#seed(cluster * 31 + 7) - 0.5) * 0.22 * scaleX;
      const curve = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(x, y, 0.42),
          new THREE.Vector3(x - lean * 0.35, y + height * 0.3, 0.43),
          new THREE.Vector3(x + lean * 0.55, y + height * 0.68, 0.425),
          new THREE.Vector3(x + lean, y + height, 0.43),
        ],
        false,
        "centripetal",
      );
      const stitches = 8 + Math.floor(this.#seed(cluster * 37) * 7);
      const order = cluster / Math.max(1, this.#quality.handworkClusters - 1);
      for (let stitch = 0; stitch < stitches; stitch += 1) {
        const t = (stitch + 0.35) / stitches;
        const point = curve.getPoint(t);
        const tangent = curve.getTangent(t).normalize();
        const length =
          (0.018 + this.#seed(cluster * 101 + stitch) * 0.022) * scaleX;
        const lateral = new THREE.Vector3(-tangent.y, tangent.x, 0)
          .normalize()
          .multiplyScalar(
            (this.#seed(cluster * 109 + stitch) - 0.5) * 0.012 * scaleX,
          );
        addDash(
          point.clone().add(lateral).addScaledVector(tangent, -length * 0.5),
          point.clone().add(lateral).addScaledVector(tangent, length * 0.5),
          order + t * 0.08,
          0.24 + this.#seed(cluster * 107 + stitch) * 0.72,
        );
      }

      const branchCount = cluster % 3 === 0 ? 3 : 2;
      for (let branch = 0; branch < branchCount; branch += 1) {
        const t = 0.28 + branch * 0.22;
        const anchor = curve.getPoint(t);
        const tangent = curve.getTangent(t).normalize();
        const direction = (branch + cluster) % 2 === 0 ? -1 : 1;
        const normal = new THREE.Vector3(-tangent.y, tangent.x, 0)
          .normalize()
          .multiplyScalar(direction);
        const tip = anchor
          .clone()
          .addScaledVector(normal, (0.07 + branch * 0.012) * scaleX)
          .addScaledVector(tangent, 0.035);
        const branchCurve = new THREE.QuadraticBezierCurve3(
          anchor,
          anchor
            .clone()
            .lerp(tip, 0.5)
            .addScaledVector(normal, 0.025 * scaleX),
          tip,
        );
        const branchPoints = branchCurve.getPoints(4);
        for (let index = 1; index < branchPoints.length; index += 1) {
          addDash(
            branchPoints[index - 1]!,
            branchPoints[index]!,
            order + 0.1 + branch * 0.02,
            0.3 + this.#seed(cluster * 113 + branch) * 0.5,
          );
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aOrder", new THREE.Float32BufferAttribute(orders, 1));
    geometry.setAttribute(
      "aIntensity",
      new THREE.Float32BufferAttribute(intensities, 1),
    );
    geometry.computeBoundingSphere();
    return geometry;
  }

  #buildParticleGeometry() {
    const positions: number[] = [];
    const sizes: number[] = [];
    const phases: number[] = [];
    const strengths: number[] = [];
    const kinds: number[] = [];
    const portrait = this.#options.portrait;

    for (let index = 0; index < this.#quality.particles; index += 1) {
      const xSeed = this.#seed(index * 7 + 1);
      const ySeed = this.#seed(index * 11 + 2);
      const side = index % 2 === 0 ? -1 : 1;
      const xRange = portrait ? 2.2 : 6.0;
      const clustered = index % 6 !== 0;
      const radius = clustered
        ? (portrait ? 0.62 : 1.2) + xSeed * (portrait ? 1.25 : 2.7)
        : 0.25 + xSeed * xRange;
      const x = side * radius + Math.sin(index * 1.71) * 0.1;
      const y = -2.2 + ySeed * 4.45;
      const quiet = Math.abs(x) < (portrait ? 0.68 : 1.35) && y > -0.7 && y < 1.15;
      positions.push(x, y, -0.22 - (index % 7) * 0.08);
      sizes.push((quiet ? 0.45 : 1) * (0.66 + this.#seed(index * 13) * 1.35));
      phases.push(this.#seed(index * 17) * Math.PI * 2);
      strengths.push(this.#seed(index * 19));
      kinds.push(0);
    }

    const scaleX = portrait ? 0.7 : 1;
    for (let index = 0; index < this.#quality.beads; index += 1) {
      const ySeed = this.#seed(index * 31 + 4);
      const y = -2.05 + Math.pow(ySeed, 1.6) * 2.15;
      const available = Math.max(0.2, 1.22 - (y + 2.05) * 0.35);
      const side = index % 2 === 0 ? -1 : 1;
      const x =
        side *
        (0.12 + this.#seed(index * 37 + 2) * available) *
        scaleX;
      positions.push(x, y, 0.46);
      sizes.push(0.95 + this.#seed(index * 41) * 1.2);
      phases.push(this.#seed(index * 43) * Math.PI * 2);
      strengths.push(this.#seed(index * 47));
      kinds.push(1);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
    geometry.setAttribute(
      "aStrength",
      new THREE.Float32BufferAttribute(strengths, 1),
    );
    geometry.setAttribute("aKind", new THREE.Float32BufferAttribute(kinds, 1));
    geometry.computeBoundingSphere();
    return geometry;
  }

  #seed(value: number) {
    const sine = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
    return sine - Math.floor(sine);
  }

  #bindEvents() {
    const signal = this.#events.signal;
    window.addEventListener("scroll", this.#onScroll, {
      passive: true,
      signal,
    });
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
    window.addEventListener(
      "pointerleave",
      () => {
        this.#pointerTarget.set(0, 0);
        this.#options.onPointerOwnershipChange?.(false);
      },
      { signal },
    );
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

  #readScroll(schedule = true) {
    const rect = this.#options.root.getBoundingClientRect();
    const travel = Math.max(1, this.#options.root.offsetHeight - innerHeight);
    this.#scrollTarget = THREE.MathUtils.clamp(-rect.top / travel, 0, 1);
    if (schedule) this.#schedule();
  }

  #onScroll = () => this.#readScroll();

  #primeStateMachine() {
    this.#options.onStateChange("THREADS_ENTER");
    this.#state = "THREADS_ENTER";
    const initial = 0.14 + this.#scrollCurrent * 0.86;
    if (initial >= 0.2) {
      this.#options.onStateChange("WEAVE_FORM");
      this.#state = "WEAVE_FORM";
    }
  }

  #measure() {
    if (!this.#renderer || !this.#camera) return;
    const width = Math.max(1, this.#options.mount.clientWidth);
    const height = Math.max(1, this.#options.mount.clientHeight);
    const dpr = Math.min(devicePixelRatio || 1, this.#quality.dpr);
    this.#renderer.setPixelRatio(dpr);
    this.#renderer.setSize(width, height, false);
    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    if (this.#particles) this.#particles.material.uniforms.uDpr!.value = dpr;
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
      !this.#drapes ||
      !this.#handwork ||
      !this.#particles
    ) {
      return;
    }

    const deltaSeconds =
      this.#lastFrame === 0
        ? 1 / 60
        : Math.min(0.05, Math.max(0.001, (now - this.#lastFrame) / 1000));
    this.#lastFrame = now;
    const response = 1 - Math.exp(-deltaSeconds * 22);
    this.#scrollCurrent +=
      (this.#scrollTarget - this.#scrollCurrent) * response;
    this.#pointerCurrent.lerp(this.#pointerTarget, 0.05);

    const progress = THREE.MathUtils.clamp(
      0.22 + this.#scrollCurrent * 0.78,
      0,
      1,
    );
    const exit = this.#smoothRange(0.95, 0.998, this.#scrollCurrent);
    const uniforms = this.#garment.material.uniforms;
    uniforms.uTime!.value = (now - this.#startTime) / 1000;
    uniforms.uProgress!.value = progress;
    uniforms.uExit!.value = exit;
    uniforms.uScroll!.value = this.#scrollCurrent;

    this.#renderer.render(this.#scene, this.#camera);
    if (!this.#ready) {
      this.#stableFrames += 1;
      if (this.#stableFrames >= 2) {
        this.#ready = true;
        this.#options.onReady();
      }
    }

    this.#updateState(progress, exit);
    const moving =
      Math.abs(this.#scrollTarget - this.#scrollCurrent) > 0.0008 ||
      this.#pointerCurrent.distanceToSquared(this.#pointerTarget) > 0.00001;
    if (!this.#ready || moving || (progress > 0.18 && exit < 1)) {
      this.#schedule();
    }
  };

  #updateState(progress: number, exit: number) {
    let next: HeroState;
    if (exit > 0.66) next = "SECTION_HANDOFF";
    else if (exit > 0.02) next = "UNRAVEL";
    else if (progress >= 0.86) next = "IDLE_BREATH";
    else if (progress >= 0.68) next = "MOTIF_EMERGE";
    else if (progress >= 0.42) next = "COUTURE_FORM";
    else if (progress >= 0.2) next = "WEAVE_FORM";
    else next = "THREADS_ENTER";
    if (next === this.#state) return;
    this.#state = next;
    this.#options.onStateChange(next);
  }

  #smoothRange(start: number, end: number, value: number) {
    const normalized = THREE.MathUtils.clamp(
      (value - start) / Math.max(0.0001, end - start),
      0,
      1,
    );
    return normalized * normalized * (3 - 2 * normalized);
  }
}

export function createProceduralCouture(
  options: CoutureSceneOptions,
): HeroRenderer {
  return new AtelierGravityRenderer(options);
}
