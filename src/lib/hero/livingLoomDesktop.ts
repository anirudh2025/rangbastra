import * as THREE from "three";
import type { HeroRenderer, HeroState } from "./states";

interface LivingLoomOptions {
  root: HTMLElement;
  mount: HTMLElement;
  tier: "A" | "B";
  signal: AbortSignal;
  onStateChange(state: HeroState): void;
  onReady(): void;
  onPointerOwnershipChange(owned: boolean): void;
  onFailure(): void;
  onIneligible(): void;
}

interface LoomQuality {
  segmentsX: number;
  segmentsY: number;
  pathSamples: number;
  dpr: number;
}

const QUALITY: Record<"A" | "B", LoomQuality> = {
  A: { segmentsX: 144, segmentsY: 88, pathSamples: 34, dpr: 1.5 },
  B: { segmentsX: 112, segmentsY: 68, pathSamples: 24, dpr: 1.25 },
};

const FORMATION_DURATION = 7600;
const IDLE_FRAME_INTERVAL = 1000 / 24;

const atmosphereVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSide;
  uniform float uLayer;
  uniform float uExit;
  uniform vec2 uPointer;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 shaped = position;
    float vertical = uv.y * 2.0 - 1.0;
    float horizontal = uv.x * 2.0 - 1.0;
    float drift = sin(
      vertical * (1.8 + uLayer * 0.24) +
      uTime * (0.045 + uLayer * 0.006) +
      uSide
    ) * (0.065 + uLayer * 0.012);
    float pointerResponse = uPointer.x * uSide * 0.032;
    shaped.x += (drift + pointerResponse) * (0.32 + uv.y * 0.68);
    shaped.x += uSide * uExit * (0.42 + uLayer * 0.1);
    shaped.z += sin(
      vertical * 2.6 -
      horizontal * 1.45 +
      uTime * 0.035 +
      uLayer
    ) * 0.085;
    shaped.z -= uExit * 0.22;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(shaped, 1.0);
  }
`;

const atmosphereFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uSide;
  uniform float uLayer;
  uniform float uExit;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float curvedFold = sin(
      vUv.y * (4.1 + uLayer * 0.42) +
      vUv.x * (2.1 + uLayer * 0.3) * uSide +
      uTime * 0.028
    ) * 0.5 + 0.5;
    float broadFold =
      sin(vUv.y * 2.35 - vUv.x * 3.1 + uSide * 0.8) * 0.5 + 0.5;
    float horizontalFade = smoothstep(0.02, 0.32, vUv.x) *
      (1.0 - smoothstep(0.68, 0.99, vUv.x));
    float verticalFade = smoothstep(0.02, 0.24, vUv.y) *
      (1.0 - smoothstep(0.76, 0.99, vUv.y));
    float edgeFalloff = 1.0 - smoothstep(0.28, 0.72, length(centered));
    float light = curvedFold * 0.55 + broadFold * 0.45;
    vec3 charcoal = vec3(0.007, 0.005, 0.004);
    vec3 cocoa = vec3(0.22, 0.105, 0.07);
    vec3 color = mix(charcoal, cocoa, 0.28 + light * 0.45);
    float alpha = horizontalFade * verticalFade *
      (0.18 + light * 0.28) * (0.5 + edgeFalloff * 0.5);
    alpha *= 1.0 - uExit * 0.82;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const sparkleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uExit;
  attribute float aPhase;
  attribute float aStrength;
  varying float vLight;
  varying float vRare;

  void main() {
    float pulse = pow(
      max(0.0, sin(uTime * (0.22 + aStrength * 0.16) + aPhase)),
      12.0
    );
    vLight = (0.22 + pulse * 0.78) * (1.0 - uExit * 0.92);
    vRare = step(0.86, aStrength);
    vec3 point = position;
    point.y += sin(uTime * 0.035 + aPhase) * 0.018 * aStrength;
    vec4 viewPosition = modelViewMatrix * vec4(point, 1.0);
    gl_PointSize = 1.2 + aStrength * 1.8 + pulse * vRare * 2.2;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const sparkleFragmentShader = /* glsl */ `
  varying float vLight;
  varying float vRare;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float radius = length(point);
    float pin = 1.0 - smoothstep(0.04, 0.5, radius);
    float flare = exp(-abs(point.x) * 34.0) * exp(-abs(point.y) * 5.0) +
      exp(-abs(point.y) * 34.0) * exp(-abs(point.x) * 5.0);
    float alpha = (pin + flare * vRare * 0.34) * vLight;
    vec3 gold = mix(vec3(0.48, 0.31, 0.16), vec3(0.9, 0.74, 0.5), pin);
    if (alpha < 0.012) discard;
    gl_FragColor = vec4(gold, alpha * 0.5);
  }
`;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uCouture;
  uniform float uUnravel;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vFold;
  varying float vRelease;
  varying float vHorizontal;

  float coutureWidth(float vertical) {
    float bodice = 0.52 + 0.22 * smoothstep(0.12, 0.78, vertical);
    float skirt = 0.58 + 0.72 * (1.0 - smoothstep(-0.86, 0.2, vertical));
    return mix(skirt, bodice, smoothstep(-0.02, 0.38, vertical));
  }

  void main() {
    vUv = uv;
    vec3 formed = position;
    float vertical = uv.y * 2.0 - 1.0;
    float horizontal = uv.x * 2.0 - 1.0;
    float widthShape = coutureWidth(vertical);

    formed.x *= mix(0.94, widthShape, uCouture);
    formed.x += (0.105 * (1.0 - uv.y) - 0.04 * uv.y) * uCouture;

    float slowTime = uTime * 0.12;
    float fold =
      sin(horizontal * 7.2 + vertical * 1.1 + slowTime) * 0.06 +
      sin(horizontal * 3.35 - vertical * 2.0 - slowTime * 0.58) * 0.038;
    float microTension = sin(vertical * 6.0 + horizontal * 2.2 + slowTime) * 0.012;

    vec2 pointerUv = uPointer * 0.5 + 0.5;
    float pointerField = smoothstep(0.28, 0.0, distance(uv, pointerUv));
    float pointerResponse = pointerField * 0.028;

    formed.z += (fold + microTension + pointerResponse) * uCouture;
    formed.y += sin(horizontal * 2.1 + slowTime * 0.4) * 0.018 * uCouture;

    float lower = 1.0 - smoothstep(0.02, 0.72, uv.y);
    float release = lower * uUnravel;
    formed.x += sign(horizontal + 0.001) * release * 0.16;
    formed.y -= release * (0.12 + lower * 0.18);
    formed.z -= release * 0.12;

    vFold = fold;
    vRelease = release;
    vHorizontal = horizontal;
    vec4 worldPosition = modelMatrix * vec4(formed, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uCoverage;
  uniform float uCouture;
  uniform float uUnravel;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vFold;
  varying float vRelease;
  varying float vHorizontal;

  float wovenLine(float coordinate, float frequency, float phase) {
    float wave = abs(sin((coordinate * frequency + phase) * 3.14159265));
    float width = max(fwidth(wave) * 1.3, 0.018);
    return smoothstep(0.82 - width, 0.82 + width, wave);
  }

  void main() {
    vec3 dx = dFdx(vWorldPosition);
    vec3 dy = dFdy(vWorldPosition);
    vec3 normal = normalize(cross(dx, dy));
    if (!gl_FrontFacing) normal = -normal;

    float constructionOrder =
      (1.0 - vUv.y) * 0.58 +
      abs(vHorizontal) * 0.25 +
      0.08 * sin(vUv.y * 16.0 + vHorizontal * 3.0);
    float regionalCoverage = smoothstep(
      constructionOrder - 0.11,
      constructionOrder + 0.035,
      uCoverage
    );
    float seamField =
      exp(-20.0 * abs(vHorizontal)) * smoothstep(0.03, 0.34, uCoverage) +
      exp(-26.0 * abs(vUv.y - 0.56)) * smoothstep(0.28, 0.55, uCoverage);
    float coverage = max(regionalCoverage, min(seamField, 1.0));

    float lower = 1.0 - smoothstep(0.02, 0.62, vUv.y);
    float releaseFade = smoothstep(
      0.12,
      1.0,
      uUnravel * lower
    );
    float retainedTextile = 1.0 - releaseFade * (0.55 + lower * 0.34);

    vec2 pointerLight = vec2(uPointer.x * 0.08, uPointer.y * 0.06);
    vec3 lightDirection = normalize(vec3(
      -0.3 + pointerLight.x,
      0.44 + pointerLight.y,
      0.86
    ));
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 halfDirection = normalize(lightDirection + viewDirection);
    float silk = pow(max(dot(normal, halfDirection), 0.0), 13.0);
    float broadSilk = pow(max(dot(normal, halfDirection), 0.0), 4.5);

    float warp = wovenLine(vUv.x, 330.0, sin(vUv.y * 17.0) * 0.045);
    float weft = wovenLine(vUv.y, 224.0, sin(vUv.x * 15.0) * 0.04);
    float weave = warp * 0.58 + weft * 0.27;

    vec3 charcoal = vec3(0.012, 0.01, 0.009);
    vec3 cocoa = vec3(0.125, 0.064, 0.043);
    vec3 pearl = vec3(0.67, 0.59, 0.51);
    vec3 antiqueGold = vec3(0.42, 0.3, 0.18);
    vec3 color = mix(
      charcoal,
      cocoa,
      0.2 + broadSilk * 0.42 + weave * 0.045
    );
    color += pearl * silk * 0.16;
    color += antiqueGold * smoothstep(0.7, 0.96, abs(vHorizontal)) * 0.022;
    float selectedFold = pow(max(0.0, 1.0 - abs(vFold * 8.0 - 0.22)), 3.0);
    color += vec3(0.19, 0.095, 0.055) * selectedFold * uCouture * 0.11;
    color *= 0.88 + (1.0 - abs(vHorizontal)) * 0.12;
    color = mix(color, charcoal, uUnravel * lower * 0.78);

    float edge = 1.0 - smoothstep(0.88, 1.0, abs(vHorizontal));
    float verticalEdge =
      smoothstep(0.0, 0.045, vUv.y) *
      (1.0 - smoothstep(0.96, 1.0, vUv.y));
    float alpha = coverage * retainedTextile * edge * verticalEdge;
    alpha *= 0.94 + broadSilk * 0.06;
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

type Path = THREE.Vector3[];

class LivingLoomDesktopRenderer implements HeroRenderer {
  #options: LivingLoomOptions;
  #quality: LoomQuality;
  #renderer?: THREE.WebGLRenderer;
  #scene?: THREE.Scene;
  #camera?: THREE.PerspectiveCamera;
  #fabric?: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  #draft?: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  #stitches?: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  #motif?: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  #atmosphere: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
  #sparkles?: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  #needle?: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  #patternPaths: Path[] = [];
  #motifPaths: Path[] = [];
  #resizeObserver?: ResizeObserver;
  #events = new AbortController();
  #frame = 0;
  #startTime = 0;
  #lastFrameTime = 0;
  #pauseStarted = 0;
  #pausedDuration = 0;
  #paused = false;
  #disposed = false;
  #ready = false;
  #degraded = false;
  #qualityWindowStart = 0;
  #qualityFrames = 0;
  #qualityAssessmentDone = false;
  #scrollTarget = 0;
  #scrollCurrent = 0;
  #constructionCurrent = 0;
  #state: HeroState = "FALLBACK_READY";
  #pointerTarget = new THREE.Vector2(0, 0);
  #pointerCurrent = new THREE.Vector2(0, 0);

  constructor(options: LivingLoomOptions) {
    this.#options = options;
    this.#quality = { ...QUALITY[options.tier] };
    options.signal.addEventListener("abort", () => this.dispose(), {
      once: true,
    });
  }

  async mount() {
    if (this.#disposed || this.#options.signal.aborted) return;
    if (matchMedia("(orientation: portrait)").matches) {
      this.#options.onIneligible();
      return;
    }

    try {
      this.#scene = new THREE.Scene();
      this.#camera = new THREE.PerspectiveCamera(31, 1, 0.1, 30);
      this.#camera.position.set(0, 0.04, 8.65);
      this.#renderer = this.#createRenderer();
      this.#renderer.setClearColor(0x000000, 0);
      this.#renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.#renderer.debug.checkShaderErrors = true;
      this.#renderer.domElement.setAttribute("aria-hidden", "true");
      this.#renderer.domElement.tabIndex = -1;
      this.#renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
      this.#options.mount.replaceChildren(this.#renderer.domElement);

      this.#createVisualSystem();
      this.#measure();
      this.#renderer.compile(this.#scene, this.#camera);
      this.#bindEvents();
      this.#startTime = performance.now();
      this.#qualityWindowStart = this.#startTime;
      this.#onScroll();
      this.resume();
    } catch {
      this.#options.onFailure();
    }
  }

  #createRenderer() {
    const probe = document.createElement("canvas");
    const strictContext = probe.getContext("webgl2", {
      failIfMajorPerformanceCaveat: true,
    });
    strictContext?.getExtension("WEBGL_lose_context")?.loseContext();
    const strict = Boolean(strictContext);

    if (!strict) {
      this.#quality = { ...QUALITY.B };
    }
    this.#options.root.dataset.heroRendererProfile =
      strict ? "strict" : "compatibility";

    return new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: strict ? "high-performance" : "default",
      failIfMajorPerformanceCaveat: strict,
    });
  }

  pause() {
    if (this.#paused) return;
    this.#paused = true;
    this.#pauseStarted = performance.now();
    cancelAnimationFrame(this.#frame);
    this.#frame = 0;
    this.#options.onPointerOwnershipChange(false);
  }

  resume() {
    if (this.#disposed || !this.#renderer || !this.#scene || !this.#camera) {
      return;
    }
    if (this.#paused && this.#pauseStarted > 0) {
      this.#pausedDuration += performance.now() - this.#pauseStarted;
      this.#pauseStarted = 0;
      this.#qualityWindowStart = performance.now();
      this.#qualityFrames = 0;
    }
    this.#paused = false;
    this.#schedule();
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    cancelAnimationFrame(this.#frame);
    this.#resizeObserver?.disconnect();
    this.#events.abort();
    for (const object of [
      this.#fabric,
      this.#draft,
      this.#stitches,
      this.#motif,
      this.#sparkles,
      this.#needle,
      ...this.#atmosphere,
    ]) {
      object?.geometry.dispose();
      object?.material.dispose();
    }
    this.#options.onPointerOwnershipChange(false);
    this.#renderer?.dispose();
    this.#renderer?.forceContextLoss();
    this.#renderer?.domElement.remove();
    this.#options.mount.replaceChildren();
    this.#options.root.style.removeProperty("--hero-unravel");
    this.#options.root.style.removeProperty("--hero-scene-progress");
    delete this.#options.root.dataset.heroRendererProfile;
  }

  #createVisualSystem() {
    if (!this.#scene) return;
    for (const object of [
      this.#fabric,
      this.#draft,
      this.#stitches,
      this.#motif,
      this.#sparkles,
      this.#needle,
      ...this.#atmosphere,
    ]) {
      if (object) {
        object.geometry.dispose();
        object.material.dispose();
        this.#scene.remove(object);
      }
    }
    this.#atmosphere = [];

    this.#patternPaths = this.#buildPatternPaths();
    this.#motifPaths = this.#buildMotifPaths();
    const patternGeometry = this.#pathsToSegments(this.#patternPaths);

    this.#draft = new THREE.LineSegments(
      patternGeometry,
      new THREE.LineBasicMaterial({
        color: 0x7b6253,
        transparent: true,
        opacity: 0.1,
        depthWrite: false,
      }),
    );
    this.#draft.geometry.setDrawRange(0, 0);

    this.#stitches = new THREE.LineSegments(
      patternGeometry.clone(),
      new THREE.LineBasicMaterial({
        color: 0xc4a177,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
      }),
    );
    this.#stitches.geometry.setDrawRange(0, 0);

    this.#motif = new THREE.LineSegments(
      this.#pathsToSegments(this.#motifPaths),
      new THREE.LineBasicMaterial({
        color: 0xb98a54,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
      }),
    );
    this.#motif.geometry.setDrawRange(0, 0);

    const fabricGeometry = new THREE.PlaneGeometry(
      3.35,
      4.62,
      this.#quality.segmentsX,
      this.#quality.segmentsY,
    );
    const fabricMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uCoverage: { value: 0 },
        uCouture: { value: 0 },
        uUnravel: { value: 0 },
        uPointer: { value: this.#pointerCurrent },
      },
    });
    this.#fabric = new THREE.Mesh(fabricGeometry, fabricMaterial);
    this.#fabric.position.set(0.18, -0.03, 0);
    this.#fabric.rotation.set(-0.018, -0.075, -0.018);

    this.#atmosphere = [
      this.#createAtmospherePlane(-1, 0, -2.35, 0.2, 4.9, 5.7),
      this.#createAtmospherePlane(-1, 1, -3.25, -0.32, 5.1, 4.8),
      this.#createAtmospherePlane(1, 2, 2.62, -0.12, 4.65, 5.35),
      this.#createAtmospherePlane(1, 3, 3.48, 0.44, 5.25, 4.5),
    ];
    this.#sparkles = this.#createSparkles();

    const needleGeometry = new THREE.BufferGeometry();
    needleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0, 2.1, 0.12], 3),
    );
    this.#needle = new THREE.Points(
      needleGeometry,
      new THREE.PointsMaterial({
        color: 0xe2c59f,
        size: 0.045,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    );

    this.#scene.add(
      ...this.#atmosphere,
      this.#fabric,
      this.#sparkles,
      this.#draft,
      this.#stitches,
      this.#motif,
      this.#needle,
    );
  }

  #createAtmospherePlane(
    side: -1 | 1,
    layer: number,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    const material = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uSide: { value: side },
        uLayer: { value: layer },
        uExit: { value: 0 },
        uPointer: { value: this.#pointerCurrent },
      },
    });
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height, 18, 28),
      material,
    );
    plane.position.set(x, y, -0.42);
    plane.rotation.set(0.02 * side, -0.09 * side, 0.09 * side);
    return plane;
  }

  #createSparkles() {
    const positions: number[] = [];
    const phases: number[] = [];
    const strengths: number[] = [];
    for (let index = 0; index < 28; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const radial = 1.48 + ((index * 37) % 100) / 100 * 2.85;
      const x = side * radial + Math.sin(index * 2.17) * 0.16;
      const y = -2.05 + ((index * 61) % 100) / 100 * 4.2;
      positions.push(x, y, -0.12 - (index % 4) * 0.08);
      phases.push((index * 2.399 + (index % 5) * 0.73) % (Math.PI * 2));
      strengths.push(0.22 + ((index * 43) % 100) / 100 * 0.78);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute(
      "aPhase",
      new THREE.Float32BufferAttribute(phases, 1),
    );
    geometry.setAttribute(
      "aStrength",
      new THREE.Float32BufferAttribute(strengths, 1),
    );
    return new THREE.Points(
      geometry,
      new THREE.ShaderMaterial({
        vertexShader: sparkleVertexShader,
        fragmentShader: sparkleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uExit: { value: 0 },
        },
      }),
    );
  }

  #buildPatternPaths(): Path[] {
    const s = this.#quality.pathSamples;
    return [
      this.#sampleCubic(
        new THREE.Vector3(0.04, 2.1, 0.11),
        new THREE.Vector3(-0.03, 1.22, 0.12),
        new THREE.Vector3(0.12, -0.82, 0.11),
        new THREE.Vector3(0.02, -2.14, 0.1),
        s,
      ),
      this.#sampleCubic(
        new THREE.Vector3(-0.05, 1.92, 0.1),
        new THREE.Vector3(-0.72, 1.62, 0.1),
        new THREE.Vector3(-0.64, 0.72, 0.11),
        new THREE.Vector3(-1.35, -2.02, 0.1),
        s,
      ),
      this.#sampleCubic(
        new THREE.Vector3(0.08, 1.92, 0.1),
        new THREE.Vector3(0.77, 1.62, 0.1),
        new THREE.Vector3(0.71, 0.72, 0.11),
        new THREE.Vector3(1.48, -2.02, 0.1),
        s,
      ),
      this.#sampleCubic(
        new THREE.Vector3(-0.66, 0.54, 0.12),
        new THREE.Vector3(-0.28, 0.42, 0.13),
        new THREE.Vector3(0.35, 0.42, 0.13),
        new THREE.Vector3(0.73, 0.54, 0.12),
        Math.round(s * 0.72),
      ),
      this.#sampleCubic(
        new THREE.Vector3(-1.02, -0.24, 0.1),
        new THREE.Vector3(-0.44, -0.48, 0.13),
        new THREE.Vector3(0.42, -0.86, 0.13),
        new THREE.Vector3(1.18, -1.54, 0.1),
        s,
      ),
      this.#sampleCubic(
        new THREE.Vector3(-1.28, -1.42, 0.1),
        new THREE.Vector3(-0.58, -1.15, 0.13),
        new THREE.Vector3(0.61, -1.12, 0.13),
        new THREE.Vector3(1.39, -1.68, 0.1),
        s,
      ),
    ];
  }

  #buildMotifPaths(): Path[] {
    const s = Math.max(14, Math.round(this.#quality.pathSamples * 0.72));
    return [
      this.#sampleCubic(
        new THREE.Vector3(-0.62, -0.32, 0.16),
        new THREE.Vector3(-0.78, -0.7, 0.18),
        new THREE.Vector3(-0.54, -1.12, 0.18),
        new THREE.Vector3(-0.34, -1.48, 0.16),
        s,
      ),
      this.#sampleCubic(
        new THREE.Vector3(-0.56, -0.72, 0.17),
        new THREE.Vector3(-0.34, -0.58, 0.18),
        new THREE.Vector3(-0.2, -0.64, 0.18),
        new THREE.Vector3(-0.12, -0.82, 0.16),
        Math.round(s * 0.68),
      ),
      this.#sampleCubic(
        new THREE.Vector3(-0.46, -1.08, 0.17),
        new THREE.Vector3(-0.72, -1.02, 0.18),
        new THREE.Vector3(-0.84, -1.18, 0.18),
        new THREE.Vector3(-0.76, -1.34, 0.16),
        Math.round(s * 0.68),
      ),
      this.#sampleCubic(
        new THREE.Vector3(0.52, -0.12, 0.16),
        new THREE.Vector3(0.72, -0.48, 0.18),
        new THREE.Vector3(0.6, -0.98, 0.18),
        new THREE.Vector3(0.82, -1.38, 0.16),
        s,
      ),
      this.#sampleCubic(
        new THREE.Vector3(0.34, 1.08, 0.16),
        new THREE.Vector3(0.48, 0.94, 0.18),
        new THREE.Vector3(0.44, 0.7, 0.18),
        new THREE.Vector3(0.31, 0.58, 0.16),
        Math.round(s * 0.58),
      ),
    ];
  }

  #sampleCubic(
    start: THREE.Vector3,
    controlA: THREE.Vector3,
    controlB: THREE.Vector3,
    end: THREE.Vector3,
    samples: number,
  ): Path {
    const curve = new THREE.CubicBezierCurve3(start, controlA, controlB, end);
    return curve.getPoints(samples);
  }

  #pathsToSegments(paths: Path[]) {
    const positions: number[] = [];
    for (const path of paths) {
      for (let index = 1; index < path.length; index += 1) {
        const previous = path[index - 1]!;
        const current = path[index]!;
        positions.push(
          previous.x,
          previous.y,
          previous.z,
          current.x,
          current.y,
          current.z,
        );
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    return geometry;
  }

  #bindEvents() {
    const { root } = this.#options;
    const signal = this.#events.signal;
    root.addEventListener("pointerenter", this.#onPointerEnter, { signal });
    root.addEventListener("pointermove", this.#onPointerMove, {
      passive: true,
      signal,
    });
    root.addEventListener("pointerleave", this.#onPointerLeave, { signal });
    window.addEventListener("scroll", this.#onScroll, {
      passive: true,
      signal,
    });
    window.addEventListener("orientationchange", this.#onOrientationChange, {
      signal,
    });
    this.#renderer?.domElement.addEventListener(
      "webglcontextlost",
      this.#onContextLost,
      { signal },
    );
    this.#resizeObserver = new ResizeObserver(this.#measure);
    this.#resizeObserver.observe(root);
  }

  #onPointerEnter = () => {
    if (this.#ready) this.#options.onPointerOwnershipChange(true);
  };

  #onPointerMove = (event: PointerEvent) => {
    const stage =
      this.#options.root.querySelector<HTMLElement>("[data-hero-stage]");
    const rect = stage?.getBoundingClientRect();
    if (!rect) return;
    this.#pointerTarget.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    this.#schedule();
  };

  #onPointerLeave = () => {
    this.#pointerTarget.set(0, 0);
    this.#options.onPointerOwnershipChange(false);
  };

  #onScroll = () => {
    const rect = this.#options.root.getBoundingClientRect();
    const distance = Math.max(1, rect.height - innerHeight);
    this.#scrollTarget = THREE.MathUtils.clamp(-rect.top / distance, 0, 1);
    this.#options.root.style.setProperty(
      "--hero-scene-progress",
      this.#scrollTarget.toFixed(4),
    );
    this.#schedule();
  };

  #onOrientationChange = () => {
    if (matchMedia("(orientation: portrait)").matches) {
      this.#options.onIneligible();
    }
  };

  #onContextLost = (event: Event) => {
    event.preventDefault();
    if (!this.#disposed) this.#options.onFailure();
  };

  #measure = () => {
    if (!this.#renderer || !this.#camera) return;
    const stage =
      this.#options.root.querySelector<HTMLElement>("[data-hero-stage]");
    const { width, height } =
      stage?.getBoundingClientRect() ??
      this.#options.root.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;
    if (height > width) {
      this.#options.onIneligible();
      return;
    }
    this.#renderer.setPixelRatio(
      Math.min(devicePixelRatio || 1, this.#quality.dpr),
    );
    this.#renderer.setSize(width, height, false);
    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
  };

  #schedule() {
    if (!this.#frame && !this.#paused && !this.#disposed) {
      this.#frame = requestAnimationFrame(this.#render);
    }
  }

  #render = (now: number) => {
    this.#frame = 0;
    if (
      this.#disposed ||
      this.#paused ||
      !this.#renderer ||
      !this.#scene ||
      !this.#camera ||
      !this.#fabric ||
      !this.#draft ||
      !this.#stitches ||
      !this.#motif ||
      !this.#sparkles ||
      !this.#needle
    ) {
      return;
    }

    const elapsed = now - this.#startTime - this.#pausedDuration;
    this.#scrollCurrent = THREE.MathUtils.lerp(
      this.#scrollCurrent,
      this.#scrollTarget,
      0.09,
    );
    const timeConstruction = Math.min(1, elapsed / FORMATION_DURATION);
    const scrollConstruction = Math.min(1, this.#scrollCurrent / 0.34);
    const constructionTarget = Math.max(timeConstruction, scrollConstruction);
    this.#constructionCurrent = THREE.MathUtils.lerp(
      this.#constructionCurrent,
      constructionTarget,
      0.085,
    );
    const construction = this.#constructionCurrent;
    const exit = this.#smoothRange(0.52, 0.94, this.#scrollCurrent);

    if (
      construction >= 1 &&
      exit <= 0 &&
      now - this.#lastFrameTime < IDLE_FRAME_INTERVAL
    ) {
      this.#schedule();
      return;
    }
    this.#lastFrameTime = now;
    this.#pointerCurrent.lerp(this.#pointerTarget, 0.045);

    const draftProgress = this.#smoothRange(0.0, 0.26, construction);
    const stitchProgress = this.#smoothRange(0.1, 0.48, construction);
    const coverage = this.#smoothRange(0.27, 0.7, construction);
    const couture = this.#smoothRange(0.56, 0.82, construction);
    const motifProgress = this.#smoothRange(0.8, 0.98, construction);

    this.#setDrawProgress(this.#draft.geometry, draftProgress);
    this.#setDrawProgress(this.#stitches.geometry, stitchProgress);
    this.#setDrawProgress(this.#motif.geometry, motifProgress);
    this.#draft.material.opacity =
      0.1 * (1 - this.#smoothRange(0.42, 0.78, construction));
    this.#stitches.material.opacity =
      0.34 * (1 - this.#smoothRange(0.54, 0.94, construction));
    this.#motif.material.opacity =
      (0.1 + this.#smoothRange(0.82, 1, construction) * 0.04) *
      (1 - exit * 0.82);

    this.#fabric.material.uniforms.uTime.value = elapsed / 1000;
    this.#fabric.material.uniforms.uCoverage.value = coverage;
    this.#fabric.material.uniforms.uCouture.value = couture;
    this.#fabric.material.uniforms.uUnravel.value = exit;
    for (const plane of this.#atmosphere) {
      plane.material.uniforms.uTime.value = elapsed / 1000;
      plane.material.uniforms.uExit.value = exit;
    }
    this.#sparkles.material.uniforms.uTime.value = elapsed / 1000;
    this.#sparkles.material.uniforms.uExit.value = exit;

    const headProgress = motifProgress > 0
      ? motifProgress
      : stitchProgress;
    const headPaths = motifProgress > 0 ? this.#motifPaths : this.#patternPaths;
    this.#updateNeedle(headPaths, headProgress, exit);
    this.#options.root.style.setProperty("--hero-unravel", exit.toFixed(4));

    try {
      this.#renderer.render(this.#scene, this.#camera);
    } catch {
      this.#options.onFailure();
      return;
    }

    if (!this.#ready && draftProgress >= 0.08) {
      this.#ready = true;
      this.#options.onReady();
    }
    this.#updateState(construction, coverage, couture, motifProgress, exit);

    if (!this.#assessQuality(now)) return;
    if (exit < 0.995 || this.#scrollTarget < 0.995) this.#schedule();
  };

  #updateState(
    construction: number,
    coverage: number,
    couture: number,
    motif: number,
    exit: number,
  ) {
    let next: HeroState | undefined;
    if (this.#state === "FALLBACK_READY" && construction > 0.01) {
      next = "THREADS_ENTER";
    } else if (this.#state === "THREADS_ENTER" && coverage > 0.02) {
      next = "WEAVE_FORM";
    } else if (this.#state === "WEAVE_FORM" && couture > 0.02) {
      next = "COUTURE_FORM";
    } else if (this.#state === "COUTURE_FORM" && motif > 0.01) {
      next = "MOTIF_EMERGE";
    } else if (this.#state === "MOTIF_EMERGE" && construction >= 0.995) {
      next = "IDLE_BREATH";
    } else if (this.#state === "IDLE_BREATH" && exit > 0.02) {
      next = "UNRAVEL";
    } else if (this.#state === "UNRAVEL" && exit >= 0.52) {
      next = "SECTION_HANDOFF";
    } else if (this.#state === "SECTION_HANDOFF" && exit >= 0.96) {
      next = "COMPLETE";
    }
    if (next && next !== this.#state) {
      this.#state = next;
      this.#options.onStateChange(next);
    }
  }

  #updateNeedle(paths: Path[], progress: number, exit: number) {
    if (!this.#needle || paths.length === 0) return;
    const scaled = Math.min(0.9999, progress) * paths.length;
    const pathIndex = Math.min(paths.length - 1, Math.floor(scaled));
    const path = paths[pathIndex]!;
    const local = scaled - pathIndex;
    const pointIndex = Math.min(
      path.length - 1,
      Math.floor(local * (path.length - 1)),
    );
    const point = path[pointIndex]!;
    const attribute = this.#needle.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    attribute.setXYZ(0, point.x, point.y, point.z);
    attribute.needsUpdate = true;
    const completionFade = 1 - this.#smoothRange(0.9, 0.995, progress);
    this.#needle.material.opacity = (1 - exit) * 0.92 * completionFade;
  }

  #setDrawProgress(geometry: THREE.BufferGeometry, progress: number) {
    const count = geometry.getAttribute("position").count;
    geometry.setDrawRange(0, Math.floor((count * progress) / 2) * 2);
  }

  #smoothRange(start: number, end: number, value: number) {
    const normalized = THREE.MathUtils.clamp(
      (value - start) / Math.max(0.0001, end - start),
      0,
      1,
    );
    return normalized * normalized * (3 - 2 * normalized);
  }

  #assessQuality(now: number): boolean {
    if (this.#qualityAssessmentDone) return true;
    if (now - this.#qualityWindowStart < 2800) {
      this.#qualityFrames += 1;
      return true;
    }
    const fps =
      this.#qualityFrames / ((now - this.#qualityWindowStart) / 1000);
    this.#qualityWindowStart = now;
    this.#qualityFrames = 0;
    if (fps >= (this.#degraded ? 32 : 44)) {
      this.#qualityAssessmentDone = true;
      return true;
    }
    if (this.#options.tier === "A" && !this.#degraded) {
      this.#degraded = true;
      this.#quality = { ...QUALITY.B };
      this.#createVisualSystem();
      this.#measure();
      return true;
    }
    this.#qualityAssessmentDone = true;
    this.#renderer?.setPixelRatio(1);
    return true;
  }
}

export function createLivingLoomDesktop(
  options: LivingLoomOptions,
): HeroRenderer {
  return new LivingLoomDesktopRenderer(options);
}
