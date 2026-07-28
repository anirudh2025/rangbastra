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
  strandCount: number;
  dpr: number;
}

const QUALITY: Record<"A" | "B", LoomQuality> = {
  A: { segmentsX: 152, segmentsY: 92, strandCount: 12, dpr: 1.5 },
  B: { segmentsX: 120, segmentsY: 72, strandCount: 6, dpr: 1.25 },
};

const FORMATION_DURATION = 4200;
const IDLE_FRAME_INTERVAL = 1000 / 30;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFormation;
  uniform float uUnravel;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vFold;
  varying float vEdge;
  varying float vUnravelEdge;

  float coutureWidth(float vertical) {
    float upper = smoothstep(-0.7, 0.45, vertical);
    float shoulder = 0.64 + 0.18 * smoothstep(0.22, 0.72, vertical);
    float skirt = 0.63 + 0.62 * (1.0 - smoothstep(-0.82, 0.42, vertical));
    return mix(skirt, shoulder, upper);
  }

  void main() {
    vUv = uv;
    vec3 formed = position;
    float vertical = uv.y * 2.0 - 1.0;
    float horizontal = uv.x * 2.0 - 1.0;
    float widthShape = coutureWidth(vertical);
    float formation = smoothstep(0.0, 1.0, uFormation);

    formed.x *= mix(0.32 + 0.18 * abs(vertical), widthShape, formation);
    formed.x += (0.1 * (1.0 - uv.y) - 0.045 * uv.y) * formation;

    float slowTime = uTime * 0.16;
    float primaryFold =
      sin(horizontal * 7.1 + vertical * 1.35 + slowTime) * 0.062 +
      sin(horizontal * 3.2 - vertical * 2.1 - slowTime * 0.62) * 0.042;
    float secondary =
      sin(vertical * 5.6 + horizontal * 2.4 + slowTime * 0.43) * 0.016;
    float edgeTension = pow(abs(horizontal), 2.5);
    float weightedMotion = primaryFold * (1.0 - edgeTension * 0.58) + secondary;

    vec2 pointerUv = uPointer * 0.5 + 0.5;
    float pointerDistance = distance(uv, pointerUv);
    float pointerField = smoothstep(0.43, 0.0, pointerDistance);
    float localTension = pointerField * (0.075 + 0.035 * sin(slowTime));

    formed.z += weightedMotion * formation;
    formed.z += localTension * formation;
    formed.y += sin(horizontal * 2.2 + slowTime * 0.35) * 0.035 * formation;
    formed.y -= (1.0 - formation) * (0.46 + 0.24 * abs(horizontal));

    float train = smoothstep(0.42, 0.0, uv.y) * smoothstep(-0.05, 0.95, horizontal);
    formed.x += train * 0.18 * formation;
    formed.z += train * 0.12 * formation;

    float release = pow(abs(horizontal), 1.7) * uUnravel;
    formed.x += sign(horizontal) * release * (0.62 + uv.y * 0.25);
    formed.y -= uUnravel * (0.18 + release * 0.54);
    formed.z += sin(vertical * 5.0 + horizontal * 2.0) * release * 0.12;

    vFold = weightedMotion;
    vEdge = 1.0 - smoothstep(0.82, 1.0, abs(horizontal));
    vUnravelEdge = release;
    vec4 worldPosition = modelMatrix * vec4(formed, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uFormation;
  uniform float uMotif;
  uniform float uUnravel;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vFold;
  varying float vEdge;
  varying float vUnravelEdge;

  float wovenLine(float coordinate, float frequency, float phase) {
    float wave = abs(sin((coordinate * frequency + phase) * 3.14159265));
    float filterWidth = max(fwidth(wave) * 1.35, 0.018);
    return smoothstep(0.82 - filterWidth, 0.82 + filterWidth, wave);
  }

  void main() {
    vec3 dx = dFdx(vWorldPosition);
    vec3 dy = dFdy(vWorldPosition);
    vec3 normal = normalize(cross(dx, dy));
    if (!gl_FrontFacing) normal = -normal;

    vec2 pointerLight = vec2(uPointer.x * 0.28, uPointer.y * 0.18);
    vec3 lightDirection = normalize(vec3(
      -0.34 + pointerLight.x,
      0.42 + pointerLight.y,
      0.84
    ));
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 halfDirection = normalize(lightDirection + viewDirection);

    float silk = pow(max(dot(normal, halfDirection), 0.0), 12.0);
    float broadSilk = pow(max(dot(normal, halfDirection), 0.0), 4.2);
    float irregularity = sin(vUv.y * 41.0 + sin(vUv.x * 23.0)) * 0.035;
    float warp = wovenLine(vUv.x + irregularity, 355.0, sin(vUv.y * 19.0) * 0.06);
    float weft = wovenLine(vUv.y, 238.0, sin(vUv.x * 17.0) * 0.045);
    float weave = warp * 0.58 + weft * 0.28;

    float zariPattern =
      smoothstep(0.987, 1.0, sin(vUv.x * 118.0 + sin(vUv.y * 17.0) * 0.32) * 0.5 + 0.5) *
      smoothstep(0.6, 0.98, silk);
    float driftingZari =
      pow(max(sin(vUv.x * 15.0 - uTime * 0.11 + vFold * 8.0), 0.0), 16.0) *
      broadSilk * 0.12;

    vec3 charcoal = vec3(0.012, 0.011, 0.010);
    vec3 cocoa = vec3(0.115, 0.072, 0.052);
    vec3 pearl = vec3(0.68, 0.61, 0.55);
    vec3 antiqueGold = vec3(0.39, 0.28, 0.18);
    float asymmetry = smoothstep(0.18, 0.92, vUv.x) * 0.05;
    float selvedge = smoothstep(0.55, 0.94, abs(vUv.x * 2.0 - 1.0)) * 0.025;
    vec3 color = mix(charcoal, cocoa, broadSilk * 0.48 + weave * 0.035 + asymmetry);
    color += pearl * silk * 0.1;
    color += antiqueGold * selvedge;
    color += antiqueGold * (zariPattern * 0.13 + driftingZari);

    vec2 motifUv = (vUv - vec2(0.56, 0.53)) * vec2(1.0, 1.35);
    float curvedStem = abs(
      motifUv.x - 0.085 * sin(motifUv.y * 11.0 + 0.7)
    );
    float stem = 1.0 - smoothstep(0.008, 0.021, curvedStem);
    vec2 petalUv = motifUv - vec2(0.105, 0.055);
    float petal = 1.0 - smoothstep(
      0.012,
      0.026,
      abs(length(petalUv * vec2(1.1, 0.72)) - 0.16)
    );
    float motifGate =
      smoothstep(-0.38, -0.27, motifUv.y) *
      (1.0 - smoothstep(0.31, 0.44, motifUv.y));
    float pearlA = 1.0 - smoothstep(0.008, 0.017, distance(motifUv, vec2(0.12, -0.19)));
    float pearlB = 1.0 - smoothstep(0.007, 0.015, distance(motifUv, vec2(-0.02, 0.24)));
    color += antiqueGold * (stem * 0.16 + petal * motifGate * 0.22) * uMotif;
    color += pearl * (pearlA + pearlB) * 0.31 * uMotif;

    float verticalEdge = smoothstep(0.0, 0.08, vUv.y) *
      (1.0 - smoothstep(0.94, 1.0, vUv.y));
    float formation = smoothstep(0.02, 0.78, uFormation);
    float releaseAlpha = 1.0 - smoothstep(0.42, 1.05, vUnravelEdge);
    float alpha = vEdge * verticalEdge * formation * releaseAlpha *
      (0.84 + broadSilk * 0.16);
    gl_FragColor = vec4(color, alpha);
  }
`;

class LivingLoomDesktopRenderer implements HeroRenderer {
  #options: LivingLoomOptions;
  #quality: LoomQuality;
  #renderer?: THREE.WebGLRenderer;
  #scene?: THREE.Scene;
  #camera?: THREE.PerspectiveCamera;
  #fabric?: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  #strands?: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
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
  #coutureStateReached = false;
  #motifStateReached = false;
  #idleStateReached = false;
  #unravelStateReached = false;
  #handoffStateReached = false;
  #completeStateReached = false;
  #unravelTarget = 0;
  #unravelCurrent = 0;
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

      this.#renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: true,
      });
      this.#renderer.setClearColor(0x000000, 0);
      this.#renderer.setPixelRatio(
        Math.min(devicePixelRatio || 1, this.#quality.dpr),
      );
      this.#renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.#renderer.debug.checkShaderErrors = true;
      this.#renderer.domElement.setAttribute("aria-hidden", "true");
      this.#renderer.domElement.tabIndex = -1;
      this.#renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
      this.#options.mount.replaceChildren(this.#renderer.domElement);

      this.#createFabric();
      this.#createStrands();
      this.#measure();
      this.#renderer.compile(this.#scene, this.#camera);

      this.#bindEvents();
      this.#startTime = performance.now();
      this.#qualityWindowStart = this.#startTime;
      this.#options.onStateChange("WEAVE_FORM");
      this.resume();
    } catch {
      this.#options.onFailure();
    }
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
    if (!this.#frame) this.#frame = requestAnimationFrame(this.#render);
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    cancelAnimationFrame(this.#frame);
    this.#frame = 0;
    this.#resizeObserver?.disconnect();
    this.#events.abort();
    this.#fabric?.geometry.dispose();
    this.#fabric?.material.dispose();
    this.#strands?.geometry.dispose();
    this.#strands?.material.dispose();
    this.#options.onPointerOwnershipChange(false);
    this.#renderer?.dispose();
    this.#renderer?.forceContextLoss();
    this.#renderer?.domElement.remove();
    this.#options.mount.replaceChildren();
    this.#options.root.style.removeProperty("--hero-unravel");
  }

  #createFabric() {
    if (!this.#scene) return;
    this.#fabric?.geometry.dispose();
    this.#fabric?.material.dispose();
    if (this.#fabric) this.#scene.remove(this.#fabric);

    const geometry = new THREE.PlaneGeometry(
      3.35,
      4.62,
      this.#quality.segmentsX,
      this.#quality.segmentsY,
    );
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uFormation: { value: 0 },
        uMotif: { value: 0 },
        uUnravel: { value: 0 },
        uPointer: { value: this.#pointerCurrent },
      },
    });
    this.#fabric = new THREE.Mesh(geometry, material);
    this.#fabric.position.set(0.3, -0.04, 0);
    this.#fabric.rotation.set(-0.025, -0.1, -0.025);
    this.#scene.add(this.#fabric);
  }

  #createStrands() {
    if (!this.#scene) return;
    this.#strands?.geometry.dispose();
    this.#strands?.material.dispose();
    if (this.#strands) this.#scene.remove(this.#strands);

    const positions: number[] = [];
    const samples = 18;
    for (let strand = 0; strand < this.#quality.strandCount; strand += 1) {
      const left = strand % 2 === 0;
      const index = Math.floor(strand / 2);
      const lane = index / Math.max(1, this.#quality.strandCount / 2 - 1);
      const startX = left ? -5.2 : 5.2;
      const endX = left ? -0.78 - lane * 0.28 : 1.38 + lane * 0.24;
      const startY = 2.25 - lane * 4.15;
      const endY = 1.65 - lane * 3.55;
      let previous = new THREE.Vector3(startX, startY, -0.28);

      for (let sample = 1; sample <= samples; sample += 1) {
        const t = sample / samples;
        const eased = t * t * (3 - 2 * t);
        const x = THREE.MathUtils.lerp(startX, endX, eased);
        const y =
          THREE.MathUtils.lerp(startY, endY, t) +
          Math.sin(t * Math.PI * (1.2 + lane)) * (left ? 0.16 : -0.16);
        const z = Math.sin(t * Math.PI) * 0.13 - 0.22;
        const current = new THREE.Vector3(x, y, z);
        positions.push(
          previous.x,
          previous.y,
          previous.z,
          current.x,
          current.y,
          current.z,
        );
        previous = current;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    const material = new THREE.LineBasicMaterial({
      color: 0xa98972,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.#strands = new THREE.LineSegments(geometry, material);
    this.#scene.add(this.#strands);
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
    window.addEventListener("orientationchange", this.#onOrientationChange, {
      signal,
    });
    window.addEventListener("scroll", this.#onScroll, {
      passive: true,
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
    const rect = this.#options.root.getBoundingClientRect();
    this.#pointerTarget.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    if (!this.#frame && !this.#paused) {
      this.#frame = requestAnimationFrame(this.#render);
    }
  };

  #onPointerLeave = () => {
    this.#pointerTarget.set(0, 0);
    this.#options.onPointerOwnershipChange(false);
  };

  #onOrientationChange = () => {
    if (matchMedia("(orientation: portrait)").matches) {
      this.#options.onIneligible();
    }
  };

  #onScroll = () => {
    const rect = this.#options.root.getBoundingClientRect();
    this.#unravelTarget = THREE.MathUtils.clamp(
      -rect.top / Math.max(1, rect.height * 0.72),
      0,
      1,
    );
    this.#options.root.style.setProperty(
      "--hero-unravel",
      this.#unravelTarget.toFixed(4),
    );
    if (!this.#frame && !this.#paused) {
      this.#frame = requestAnimationFrame(this.#render);
    }
  };

  #onContextLost = (event: Event) => {
    event.preventDefault();
    if (!this.#disposed) this.#options.onFailure();
  };

  #measure = () => {
    if (!this.#renderer || !this.#camera) return;
    const { width, height } = this.#options.root.getBoundingClientRect();
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

  #render = (now: number) => {
    this.#frame = 0;
    if (
      this.#disposed ||
      this.#paused ||
      !this.#renderer ||
      !this.#scene ||
      !this.#camera ||
      !this.#fabric ||
      !this.#strands
    ) {
      return;
    }

    const elapsed = now - this.#startTime - this.#pausedDuration;
    const formation = Math.min(1, elapsed / FORMATION_DURATION);
    const isForming = formation < 1;
    if (!isForming && now - this.#lastFrameTime < IDLE_FRAME_INTERVAL) {
      this.#frame = requestAnimationFrame(this.#render);
      return;
    }

    this.#lastFrameTime = now;
    this.#pointerCurrent.lerp(this.#pointerTarget, isForming ? 0.045 : 0.075);
    this.#unravelCurrent = THREE.MathUtils.lerp(
      this.#unravelCurrent,
      this.#unravelTarget,
      0.085,
    );
    this.#fabric.material.uniforms.uTime.value = elapsed / 1000;
    this.#fabric.material.uniforms.uFormation.value =
      formation * formation * (3 - 2 * formation);
    this.#fabric.material.uniforms.uMotif.value = THREE.MathUtils.smoothstep(
      formation,
      0.66,
      0.94,
    );
    this.#fabric.material.uniforms.uUnravel.value = this.#unravelCurrent;
    this.#strands.material.opacity =
      Math.min(0.13, formation * 0.15) *
      (this.#options.tier === "A" ? 1 : 0.68) *
      (1 - this.#unravelCurrent * 0.72);
    this.#strands.position.y = -this.#unravelCurrent * 0.72;
    this.#strands.scale.x = 1 + this.#unravelCurrent * 0.28;

    try {
      this.#renderer.render(this.#scene, this.#camera);
    } catch {
      this.#options.onFailure();
      return;
    }

    if (!this.#ready && formation >= 0.16) {
      this.#ready = true;
      this.#options.onReady();
      if (this.#options.root.matches(":hover")) {
        this.#options.onPointerOwnershipChange(true);
      }
    }
    if (!this.#coutureStateReached && formation >= 0.52) {
      this.#coutureStateReached = true;
      this.#options.onStateChange("COUTURE_FORM");
    }
    if (!this.#motifStateReached && formation >= 0.7) {
      this.#motifStateReached = true;
      this.#options.onStateChange("MOTIF_EMERGE");
    }
    if (!this.#idleStateReached && formation >= 1) {
      this.#idleStateReached = true;
      this.#options.onStateChange("IDLE_BREATH");
    }
    if (
      this.#idleStateReached &&
      !this.#unravelStateReached &&
      this.#unravelTarget >= 0.04
    ) {
      this.#unravelStateReached = true;
      this.#options.onStateChange("UNRAVEL");
    }
    if (
      this.#unravelStateReached &&
      !this.#handoffStateReached &&
      this.#unravelTarget >= 0.52
    ) {
      this.#handoffStateReached = true;
      this.#options.onStateChange("SECTION_HANDOFF");
    }
    if (
      this.#handoffStateReached &&
      !this.#completeStateReached &&
      this.#unravelCurrent >= 0.985
    ) {
      this.#completeStateReached = true;
      this.#options.onStateChange("COMPLETE");
      this.#options.onPointerOwnershipChange(false);
    }

    if (!this.#assessQuality(now)) return;
    if (!this.#completeStateReached) {
      this.#frame = requestAnimationFrame(this.#render);
    }
  };

  #assessQuality(now: number): boolean {
    if (this.#qualityAssessmentDone) return true;

    if (now - this.#qualityWindowStart < 2800) {
      this.#qualityFrames += 1;
      return true;
    }

    const elapsedSeconds = (now - this.#qualityWindowStart) / 1000;
    const fps = this.#qualityFrames / elapsedSeconds;
    this.#qualityWindowStart = now;
    this.#qualityFrames = 0;

    if (fps >= (this.#degraded ? 34 : 46)) {
      this.#qualityAssessmentDone = true;
      return true;
    }

    if (this.#options.tier === "A" && !this.#degraded) {
      this.#degraded = true;
      this.#quality = { ...QUALITY.B };
      this.#createFabric();
      this.#createStrands();
      this.#measure();
      return true;
    }

    this.#options.onFailure();
    return false;
  }
}

export function createLivingLoomDesktop(
  options: LivingLoomOptions,
): HeroRenderer {
  return new LivingLoomDesktopRenderer(options);
}
