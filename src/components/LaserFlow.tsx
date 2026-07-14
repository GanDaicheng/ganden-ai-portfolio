import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./LaserFlow.css";

type LaserFlowProps = {
  className?: string;
  style?: React.CSSProperties;
  horizontalBeamOffset?: number;
  verticalBeamOffset?: number;
  horizontalSizing?: number;
  verticalSizing?: number;
  wispDensity?: number;
  wispSpeed?: number;
  wispIntensity?: number;
  flowSpeed?: number;
  flowStrength?: number;
  fogIntensity?: number;
  fogScale?: number;
  fogFallSpeed?: number;
  mouseTiltStrength?: number;
  mouseSmoothTime?: number;
  decay?: number;
  falloffStart?: number;
  dpr?: number;
  color?: string;
};

const VERTEX_SHADER = `
precision highp float;
attribute vec3 position;
varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColor;
uniform float uBeamXFrac;
uniform float uBeamYFrac;
uniform float uHorizontalSizing;
uniform float uVerticalSizing;
uniform float uWispDensity;
uniform float uWispSpeed;
uniform float uWispIntensity;
uniform float uFlowSpeed;
uniform float uFlowStrength;
uniform float uFogIntensity;
uniform float uFogScale;
uniform float uFogFallSpeed;
uniform float uMouseTiltStrength;
uniform float uDecay;
uniform float uFalloffStart;
uniform float uFade;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 34.45);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.55;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p = p * 2.03 + 17.1;
    amp *= 0.52;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5 + uBeamXFrac, 0.58 + uBeamYFrac);
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2((uv.x - center.x) * aspect, uv.y - center.y);

  float mouseTilt = (uMouse.x - 0.5) * uMouseTiltStrength;
  p.x -= mouseTilt * (1.0 - uv.y);

  float flow = sin((uv.y * 7.0 - uTime * uFlowSpeed) * 6.2831) * uFlowStrength;
  float verticalBeam = exp(-pow(abs(p.x + flow * 0.08) / max(0.001, 0.035 * uHorizontalSizing), uDecay + 1.25));
  verticalBeam *= smoothstep(1.02, 0.08, uv.y) * smoothstep(0.06, 0.34 * uVerticalSizing, uv.y);

  float horizontalBeam = exp(-pow(abs(p.y) / max(0.001, 0.045 * uVerticalSizing), uDecay + 1.1));
  horizontalBeam *= smoothstep(0.0, 0.55 * uHorizontalSizing, 1.0 - abs(p.x));

  vec2 fogUv = vec2(p.x * 2.0, uv.y * 1.8) * uFogScale * 4.0;
  fogUv += vec2(0.0, uTime * uFogFallSpeed * 0.12);
  float fog = fbm(fogUv + fbm(fogUv + 2.4));
  fog = pow(fog, 1.35) * uFogIntensity;

  float lane = fract((uv.y + uTime * uWispSpeed * 0.018) * (9.0 + uWispDensity * 6.0));
  float wisp = smoothstep(0.08, 0.0, lane) * exp(-abs(p.x) * (22.0 - uWispDensity * 5.0));
  wisp *= uWispIntensity * 0.045;

  float radial = 1.0 - smoothstep(0.08, uFalloffStart, length(p));
  float intensity = (verticalBeam * 0.92 + horizontalBeam * 0.26 + fog * radial + wisp) * uFade;
  float edge = smoothstep(0.0, 0.18, uv.x) * smoothstep(1.0, 0.82, uv.x) * smoothstep(0.0, 0.12, uv.y) * smoothstep(1.0, 0.72, uv.y);

  vec3 color = uColor * intensity * edge;
  float alpha = clamp(intensity * edge, 0.0, 0.9);
  gl_FragColor = vec4(color, alpha);
}
`;

const hexToVector = (hex: string) => {
  let c = hex.trim().replace("#", "");
  if (c.length === 3) c = c.split("").map((char) => char + char).join("");
  const n = Number.parseInt(c, 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

export default function LaserFlow({
  className,
  style,
  horizontalBeamOffset = 0.1,
  verticalBeamOffset = 0,
  horizontalSizing = 0.5,
  verticalSizing = 2,
  wispDensity = 1,
  wispSpeed = 15,
  wispIntensity = 5,
  flowSpeed = 0.35,
  flowStrength = 0.25,
  fogIntensity = 0.45,
  fogScale = 0.3,
  fogFallSpeed = 0.6,
  mouseTiltStrength = 0.01,
  mouseSmoothTime = 0.08,
  decay = 1.1,
  falloffStart = 1.2,
  dpr,
  color = "#FF79C6",
}: LaserFlowProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const uniformsRef = useRef<Record<string, THREE.IUniform> | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(dpr ?? window.devicePixelRatio ?? 1, 1.7));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor: { value: hexToVector(color) },
      uBeamXFrac: { value: horizontalBeamOffset },
      uBeamYFrac: { value: verticalBeamOffset },
      uHorizontalSizing: { value: horizontalSizing },
      uVerticalSizing: { value: verticalSizing },
      uWispDensity: { value: wispDensity },
      uWispSpeed: { value: wispSpeed },
      uWispIntensity: { value: wispIntensity },
      uFlowSpeed: { value: flowSpeed },
      uFlowStrength: { value: flowStrength },
      uFogIntensity: { value: fogIntensity },
      uFogScale: { value: fogScale },
      uFogFallSpeed: { value: fogFallSpeed },
      uMouseTiltStrength: { value: mouseTiltStrength },
      uDecay: { value: decay },
      uFalloffStart: { value: falloffStart },
      uFade: { value: 0 },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.RawShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    const mouseTarget = new THREE.Vector2(0.5, 0.5);
    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };
    const updateMouse = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseTarget.set((event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    mount.addEventListener("pointermove", updateMouse, { passive: true });
    mount.addEventListener("pointerleave", () => mouseTarget.set(0.5, 0.5), { passive: true });
    resize();

    let frame = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.033);
      uniforms.uTime.value += dt;
      uniforms.uFade.value = Math.min(1, uniforms.uFade.value + dt * 0.9);
      uniforms.uMouse.value.lerp(mouseTarget, mouseSmoothTime <= 0 ? 1 : Math.min(1, dt / mouseSmoothTime));
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", updateMouse);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      uniformsRef.current = null;
    };
  }, [dpr, mouseSmoothTime]);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;
    uniforms.uColor.value = hexToVector(color);
    uniforms.uBeamXFrac.value = horizontalBeamOffset;
    uniforms.uBeamYFrac.value = verticalBeamOffset;
    uniforms.uHorizontalSizing.value = horizontalSizing;
    uniforms.uVerticalSizing.value = verticalSizing;
    uniforms.uWispDensity.value = wispDensity;
    uniforms.uWispSpeed.value = wispSpeed;
    uniforms.uWispIntensity.value = wispIntensity;
    uniforms.uFlowSpeed.value = flowSpeed;
    uniforms.uFlowStrength.value = flowStrength;
    uniforms.uFogIntensity.value = fogIntensity;
    uniforms.uFogScale.value = fogScale;
    uniforms.uFogFallSpeed.value = fogFallSpeed;
    uniforms.uMouseTiltStrength.value = mouseTiltStrength;
    uniforms.uDecay.value = decay;
    uniforms.uFalloffStart.value = falloffStart;
  }, [
    color,
    decay,
    falloffStart,
    flowSpeed,
    flowStrength,
    fogFallSpeed,
    fogIntensity,
    fogScale,
    horizontalBeamOffset,
    horizontalSizing,
    mouseTiltStrength,
    verticalBeamOffset,
    verticalSizing,
    wispDensity,
    wispIntensity,
    wispSpeed,
  ]);

  return <div ref={mountRef} className={`laser-flow-container ${className ?? ""}`} style={style} />;
}
