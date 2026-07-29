import * as THREE from "three";
import type { HeroRenderer, HeroState } from "./states";

interface MobileCoutureOptions {
  root: HTMLElement;
  mount: HTMLElement;
  signal: AbortSignal;
  onStateChange(state: HeroState): void;
  onReady(): void;
  onFailure(): void;
  onIneligible(): void;
}

type Path = THREE.Vector3[];

const DPR_CAP = 1.1;
const INTRO_DURATION = 1750;
const EXIT_START = 0.76;
const EXIT_END = 0.98;
const PARTICLE_COUNT = 220;

const clothVertex = /* glsl */ `
  uniform float uTime;
  uniform float uCouture;
  uniform float uUnravel;
  uniform float uLayer;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vFold;

  float silhouette(float vertical) {
    float shoulder = mix(0.34, 0.48, smoothstep(0.58, 0.92, vertical));
    float waist = mix(0.54, 0.31, smoothstep(0.04, 0.48, vertical));
    float lower = 0.56 + (1.0 - smoothstep(-0.92, 0.08, vertical)) * 0.78;
    return mix(lower, mix(waist, shoulder, smoothstep(0.28, 0.72, vertical)),
      smoothstep(-0.12, 0.2, vertical));
  }

  void main() {
    vUv = uv;
    vec3 shaped = position;
    float vertical = uv.y * 2.0 - 1.0;
    float horizontal = uv.x * 2.0 - 1.0;
    float width = silhouette(vertical) * (1.0 + uLayer * 0.045);
    shaped.x *= mix(0.9, width, uCouture);
    shaped.x += (0.055 - uv.y * 0.035) * uCouture;

    float time = uTime * 0.055;
    float fold =
      sin(horizontal * (5.1 + uLayer * 0.67) + vertical * 1.4 + time + uLayer) *
        (0.052 + uLayer * 0.006) +
      sin(horizontal * (2.35 + uLayer * 0.38) - vertical * 2.1 - time * 0.6) *
        (0.034 + uLayer * 0.004);
    shaped.z += fold * uCouture;
    shaped.y += sin(horizontal * 1.7 + uLayer) * 0.012 * uCouture;

    float lower = 1.0 - smoothstep(0.02, 0.7, uv.y);
    shaped.x += sign(horizontal + 0.001) * uUnravel * lower * 0.1;
    shaped.y -= uUnravel * lower * 0.16;
    shaped.z -= uUnravel * lower * 0.08;

    vFold = fold;
    vec4 world = modelMatrix * vec4(shaped, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(shaped, 1.0);
  }
`;

const clothFragment = /* glsl */ `
  uniform float uCoverage;
  uniform float uCouture;
  uniform float uUnravel;
  uniform float uLayer;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vFold;

  float weaveLine(float value, float frequency) {
    float wave = abs(sin(value * frequency * 3.14159265));
    float width = max(fwidth(wave) * 1.25, 0.02);
    return smoothstep(0.84 - width, 0.84 + width, wave);
  }

  void main() {
    float horizontal = vUv.x * 2.0 - 1.0;
    float order = (1.0 - vUv.y) * 0.62 + abs(horizontal) * 0.2;
    float coverage = smoothstep(order - 0.12, order + 0.045, uCoverage);
    float edge = 1.0 - smoothstep(0.87, 1.0, abs(horizontal));
    float verticalEdge = smoothstep(0.0, 0.04, vUv.y) *
      (1.0 - smoothstep(0.965, 1.0, vUv.y));
    float lower = 1.0 - smoothstep(0.02, 0.64, vUv.y);

    vec3 dx = dFdx(vWorld);
    vec3 dy = dFdy(vWorld);
    vec3 normal = normalize(cross(dx, dy));
    if (!gl_FrontFacing) normal = -normal;
    vec3 lightDirection = normalize(vec3(-0.28, 0.42, 0.88));
    vec3 viewDirection = normalize(cameraPosition - vWorld);
    vec3 halfDirection = normalize(lightDirection + viewDirection);
    float broad = pow(max(dot(normal, halfDirection), 0.0), 4.2);
    float silk = pow(max(dot(normal, halfDirection), 0.0), 15.0);
    float warp = weaveLine(vUv.x + sin(vUv.y * 8.0) * 0.002, 260.0);
    float weft = weaveLine(vUv.y, 184.0);

    vec3 black = vec3(0.009, 0.008, 0.007);
    vec3 cocoa = vec3(0.105, 0.052, 0.034);
    vec3 warm = vec3(0.23, 0.125, 0.078);
    vec3 color = mix(black, cocoa, 0.16 + broad * 0.38);
    color += warm * silk * 0.12;
    color += vec3(0.34, 0.27, 0.2) * (warp * 0.025 + weft * 0.012);
    float valley = smoothstep(0.02, 0.075, abs(vFold));
    color *= 0.76 + valley * 0.24;
    color = mix(color, black, uUnravel * lower * 0.82);

    float mask = 1.0;
    if (uLayer > 0.5 && uLayer < 1.5) {
      mask = (1.0 - smoothstep(0.52, 0.86, vUv.x)) * 0.74;
    }
    if (uLayer > 1.5) {
      mask = smoothstep(0.15, 0.48, vUv.x) * lower * 0.7;
    }
    float release = 1.0 - smoothstep(0.12, 1.0, uUnravel * lower) * 0.86;
    float alpha = coverage * edge * verticalEdge * mask * release;
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const veilVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSide;
  uniform float uExit;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 shaped = position;
    float vertical = uv.y * 2.0 - 1.0;
    shaped.x += sin(vertical * 2.2 + uTime * 0.04 + uSide) * 0.055;
    shaped.x += uSide * uExit * 0.2;
    shaped.z += sin(vertical * 2.8 - uv.x * 1.6 + uTime * 0.025) * 0.06;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(shaped, 1.0);
  }
`;

const veilFragment = /* glsl */ `
  uniform float uExit;
  varying vec2 vUv;
  void main() {
    float xFade = smoothstep(0.02, 0.34, vUv.x) *
      (1.0 - smoothstep(0.68, 0.98, vUv.x));
    float yFade = smoothstep(0.02, 0.22, vUv.y) *
      (1.0 - smoothstep(0.78, 0.99, vUv.y));
    float fold = sin(vUv.y * 4.4 + vUv.x * 2.1) * 0.5 + 0.5;
    vec3 color = mix(vec3(0.004), vec3(0.12, 0.055, 0.035), 0.22 + fold * 0.4);
    float alpha = xFade * yFade * (0.06 + fold * 0.1) * (1.0 - uExit * 0.86);
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uExit;
  attribute float aPhase;
  attribute float aStrength;
  varying float vAlpha;
  varying float vRare;
  void main() {
    float pulse = pow(max(0.0, sin(uTime * (0.2 + aStrength * 0.12) + aPhase)), 14.0);
    vAlpha = (0.07 + pulse * 0.93) * (1.0 - uExit * 0.94);
    vRare = step(0.94, aStrength);
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 1.0 + aStrength * 1.35 + pulse * vRare * 1.8;
    gl_Position = projectionMatrix * view;
  }
`;

const dustFragment = /* glsl */ `
  varying float vAlpha;
  varying float vRare;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float pin = 1.0 - smoothstep(0.04, 0.5, length(p));
    float flare = exp(-abs(p.x) * 30.0) * exp(-abs(p.y) * 5.0) +
      exp(-abs(p.y) * 30.0) * exp(-abs(p.x) * 5.0);
    float alpha = (pin + flare * vRare * 0.28) * vAlpha * 0.42;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(0.76, 0.55, 0.3, alpha);
  }
`;

class MobileCoutureRenderer implements HeroRenderer {
  #options: MobileCoutureOptions;
  #renderer?: THREE.WebGLRenderer;
  #scene?: THREE.Scene;
  #camera?: THREE.PerspectiveCamera;
  #cloth: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
  #veils: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
  #dust?: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  #guides?: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  #embroidery?: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  #resizeObserver?: ResizeObserver;
  #events = new AbortController();
  #frame = 0;
  #startTime = 0;
  #scrollTarget = 0;
  #scrollCurrent = 0;
  #constructionCurrent = 0;
  #paused = false;
  #disposed = false;
  #ready = false;
  #state: HeroState = "THREAD_READY";

  constructor(options: MobileCoutureOptions) {
    this.#options = options;
    options.signal.addEventListener("abort", () => this.dispose(), { once: true });
  }

  mount() {
    if (this.#disposed || this.#options.signal.aborted) return;
    if (!matchMedia("(orientation: portrait)").matches) {
      this.#options.onIneligible();
      return;
    }
    try {
      this.#scene = new THREE.Scene();
      this.#camera = new THREE.PerspectiveCamera(30, 1, 0.1, 24);
      this.#camera.position.set(0, 0.05, 8.8);
      this.#renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
      });
      this.#renderer.setClearColor(0x000000, 0);
      this.#renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.#renderer.domElement.setAttribute("aria-hidden", "true");
      this.#renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
      this.#options.mount.replaceChildren(this.#renderer.domElement);
      this.#createScene();
      this.#measure();
      this.#renderer.compile(this.#scene, this.#camera);
      this.#bindEvents();
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
    cancelAnimationFrame(this.#frame);
    this.#events.abort();
    this.#resizeObserver?.disconnect();
    for (const object of [
      ...this.#cloth,
      ...this.#veils,
      this.#dust,
      this.#guides,
      this.#embroidery,
    ]) {
      object?.geometry.dispose();
      object?.material.dispose();
    }
    this.#renderer?.dispose();
    this.#renderer?.forceContextLoss();
    this.#renderer?.domElement.remove();
    this.#options.mount.replaceChildren();
    this.#options.root.style.removeProperty("--hero-unravel");
    this.#options.root.style.removeProperty("--hero-scene-progress");
  }

  #createScene() {
    if (!this.#scene) return;
    this.#cloth = [
      this.#createCloth(0, 0, 0, 0),
      this.#createCloth(1, -0.1, -0.11, -0.14),
      this.#createCloth(2, 0.14, -0.08, -0.08),
    ];
    this.#veils = [
      this.#createVeil(-1, -1.45, 0.12, -0.42, 2.4, 5.4),
      this.#createVeil(1, 1.55, -0.2, -0.38, 2.1, 4.9),
    ];
    this.#dust = this.#createDust();
    this.#guides = new THREE.LineSegments(
      this.#pathsToSegments(this.#guidePaths()),
      new THREE.LineBasicMaterial({
        color: 0xa77b54,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      }),
    );
    this.#guides.geometry.setDrawRange(0, 0);
    this.#embroidery = new THREE.LineSegments(
      this.#pathsToSegments(this.#embroideryPaths()),
      new THREE.LineBasicMaterial({
        color: 0xb68a55,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    this.#embroidery.geometry.setDrawRange(0, 0);
    this.#scene.add(
      ...this.#veils,
      ...this.#cloth,
      this.#dust,
      this.#guides,
      this.#embroidery,
    );
  }

  #createCloth(layer: number, x: number, y: number, z: number) {
    const material = new THREE.ShaderMaterial({
      vertexShader: clothVertex,
      fragmentShader: clothFragment,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uCoverage: { value: 0 },
        uCouture: { value: 0 },
        uUnravel: { value: 0 },
        uLayer: { value: layer },
      },
    });
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.15, 5.45, 54, 72),
      material,
    );
    mesh.position.set(x, y, z);
    mesh.rotation.set(-0.015 + layer * 0.007, (layer - 1) * -0.055, (layer - 1) * 0.018);
    return mesh;
  }

  #createVeil(
    side: -1 | 1,
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
  ) {
    const material = new THREE.ShaderMaterial({
      vertexShader: veilVertex,
      fragmentShader: veilFragment,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uSide: { value: side },
        uExit: { value: 0 },
      },
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 12, 22), material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(0.02, side * -0.11, side * 0.05);
    return mesh;
  }

  #createDust() {
    const positions: number[] = [];
    const phases: number[] = [];
    const strengths: number[] = [];
    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const openSpace = index % 5 === 0;
      const x =
        side *
        (0.72 +
          ((index * 37) % 100) / 100 * (openSpace ? 1.65 : 0.78));
      const y = -2.25 + ((index * 61) % 100) / 100 * 4.7;
      positions.push(x, y, -0.12 - (index % 3) * 0.08);
      phases.push((index * 2.17) % (Math.PI * 2));
      strengths.push(0.18 + ((index * 43) % 100) / 100 * 0.82);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
    geometry.setAttribute("aStrength", new THREE.Float32BufferAttribute(strengths, 1));
    return new THREE.Points(
      geometry,
      new THREE.ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uExit: { value: 0 } },
      }),
    );
  }

  #guidePaths(): Path[] {
    return [
      this.#curve(-0.05, 2.45, -0.08, 1.1, 0.08, -0.7, 0, -2.35),
      this.#curve(-0.1, 2.2, -0.72, 1.62, -0.54, 0.48, -1.28, -2.12),
      this.#curve(0.08, 2.2, 0.74, 1.58, 0.62, 0.5, 1.36, -2.08),
      this.#curve(-0.62, 0.42, -0.22, 0.3, 0.28, 0.32, 0.7, 0.44, 20),
    ];
  }

  #embroideryPaths(): Path[] {
    return [
      this.#curve(-0.58, -0.36, -0.78, -0.72, -0.52, -1.15, -0.28, -1.55),
      this.#curve(-0.5, -0.8, -0.28, -0.65, -0.12, -0.72, -0.04, -0.9, 18),
      this.#curve(0.48, -0.18, 0.7, -0.54, 0.56, -1.02, 0.76, -1.42),
      this.#curve(0.27, 1.06, 0.42, 0.9, 0.4, 0.69, 0.29, 0.56, 18),
    ];
  }

  #curve(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    samples = 28,
  ) {
    return new THREE.CubicBezierCurve3(
      new THREE.Vector3(x0, y0, 0.18),
      new THREE.Vector3(x1, y1, 0.19),
      new THREE.Vector3(x2, y2, 0.19),
      new THREE.Vector3(x3, y3, 0.18),
    ).getPoints(samples);
  }

  #pathsToSegments(paths: Path[]) {
    const positions: number[] = [];
    for (const path of paths) {
      for (let index = 1; index < path.length; index += 1) {
        positions.push(...path[index - 1]!.toArray(), ...path[index]!.toArray());
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }

  #bindEvents() {
    const signal = this.#events.signal;
    window.addEventListener("scroll", this.#onScroll, { passive: true, signal });
    window.addEventListener("orientationchange", this.#onOrientationChange, { signal });
    this.#renderer?.domElement.addEventListener("webglcontextlost", this.#onContextLost, { signal });
    this.#resizeObserver = new ResizeObserver(this.#measure);
    this.#resizeObserver.observe(this.#options.root);
  }

  #onScroll = () => {
    const rect = this.#options.root.getBoundingClientRect();
    const distance = Math.max(1, rect.height - innerHeight);
    this.#scrollTarget = THREE.MathUtils.clamp(-rect.top / distance, 0, 1);
    this.#options.root.style.setProperty("--hero-scene-progress", this.#scrollTarget.toFixed(4));
    this.#schedule();
  };

  #onOrientationChange = () => {
    if (!matchMedia("(orientation: portrait)").matches) this.#options.onIneligible();
  };

  #onContextLost = (event: Event) => {
    event.preventDefault();
    if (!this.#disposed) this.#options.onFailure();
  };

  #measure = () => {
    if (!this.#renderer || !this.#camera) return;
    const stage = this.#options.root.querySelector<HTMLElement>("[data-hero-stage]");
    const { width, height } = stage?.getBoundingClientRect() ?? this.#options.root.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;
    if (width >= height) {
      this.#options.onIneligible();
      return;
    }
    this.#renderer.setPixelRatio(Math.min(devicePixelRatio || 1, DPR_CAP));
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
      this.#paused ||
      this.#disposed ||
      !this.#renderer ||
      !this.#scene ||
      !this.#camera ||
      !this.#dust ||
      !this.#guides ||
      !this.#embroidery
    ) return;

    this.#scrollCurrent += (this.#scrollTarget - this.#scrollCurrent) * 0.1;
    const elapsed = now - this.#startTime;
    const intro = Math.min(0.13, (elapsed / INTRO_DURATION) * 0.13);
    const scrollConstruction = this.#smoothRange(0, 0.68, this.#scrollCurrent);
    const target = Math.max(intro, scrollConstruction);
    this.#constructionCurrent += (target - this.#constructionCurrent) * 0.095;
    const construction = this.#constructionCurrent;
    const exit = this.#smoothRange(EXIT_START, EXIT_END, this.#scrollCurrent);
    const coverage = this.#smoothRange(0.24, 0.7, construction);
    const couture = this.#smoothRange(0.5, 0.84, construction);
    const motif = this.#smoothRange(0.78, 0.98, construction);
    const guide = this.#smoothRange(0, 0.38, construction);

    for (const cloth of this.#cloth) {
      cloth.material.uniforms.uTime.value = elapsed / 1000;
      cloth.material.uniforms.uCoverage.value = coverage;
      cloth.material.uniforms.uCouture.value = couture;
      cloth.material.uniforms.uUnravel.value = exit;
    }
    for (const veil of this.#veils) {
      veil.material.uniforms.uTime.value = elapsed / 1000;
      veil.material.uniforms.uExit.value = exit;
      veil.visible = couture > 0.02;
    }
    this.#dust.material.uniforms.uTime.value = elapsed / 1000;
    this.#dust.material.uniforms.uExit.value = exit;
    this.#dust.visible = couture > 0.15;
    this.#setDrawProgress(this.#guides.geometry, guide);
    this.#guides.material.opacity =
      0.42 * (1 - this.#smoothRange(0.46, 0.91, construction));
    this.#setDrawProgress(this.#embroidery.geometry, motif);
    this.#embroidery.material.opacity = 0.18 * motif * (1 - exit * 0.84);
    this.#options.root.style.setProperty("--hero-unravel", exit.toFixed(4));

    try {
      this.#renderer.render(this.#scene, this.#camera);
    } catch {
      this.#options.onFailure();
      return;
    }
    if (!this.#ready && guide > 0.05) {
      this.#ready = true;
      this.#options.onReady();
    }
    this.#updateState(exit);
    const smoothing =
      Math.abs(this.#scrollTarget - this.#scrollCurrent) > 0.001 ||
      Math.abs(target - this.#constructionCurrent) > 0.001;
    if (elapsed < INTRO_DURATION || smoothing || (exit < 0.995 && construction > 0.9)) {
      this.#schedule();
    }
  };

  #updateState(exit: number) {
    const c = this.#constructionCurrent;
    let next: HeroState | undefined;
    if (this.#state === "THREAD_READY" && c > 0.01) next = "THREADS_ENTER";
    else if (this.#state === "THREADS_ENTER" && c >= 0.28) next = "WEAVE_FORM";
    else if (this.#state === "WEAVE_FORM" && c >= 0.56) next = "COUTURE_FORM";
    else if (this.#state === "COUTURE_FORM" && c >= 0.8) next = "MOTIF_EMERGE";
    else if (this.#state === "MOTIF_EMERGE" && c >= 0.995) next = "IDLE_BREATH";
    else if (this.#state === "IDLE_BREATH" && exit > 0.02) next = "UNRAVEL";
    else if (this.#state === "UNRAVEL" && exit >= 0.52) next = "SECTION_HANDOFF";
    else if (this.#state === "SECTION_HANDOFF" && exit >= 0.96) next = "COMPLETE";
    if (next) {
      this.#state = next;
      this.#options.onStateChange(next);
    }
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
}

export function createSilkPortalMobile(
  options: MobileCoutureOptions,
): HeroRenderer {
  return new MobileCoutureRenderer(options);
}
