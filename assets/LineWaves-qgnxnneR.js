import{r as A,R as P,T as S,P as _,M as Y,j as D}from"./index-DBHQbJ0J.js";function d(r){const t=r.replace("#","");return[Number.parseInt(t.slice(0,2),16)/255,Number.parseInt(t.slice(2,4),16)/255,Number.parseInt(t.slice(4,6),16)/255]}const N=`
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`,z=`
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uInnerLines;
uniform float uOuterLines;
uniform float uWarpIntensity;
uniform float uRotation;
uniform float uEdgeFadeWidth;
uniform float uColorCycleSpeed;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;

#define HALF_PI 1.5707963

float hashF(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

float smoothNoise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hashF(i), hashF(i + 1.0), u);
}

float displaceA(float coord, float t) {
  float result = sin(coord * 2.123) * 0.2;
  result += sin(coord * 3.234 + t * 4.345) * 0.1;
  result += sin(coord * 0.589 + t * 0.934) * 0.5;
  return result;
}

float displaceB(float coord, float t) {
  float result = sin(coord * 1.345) * 0.3;
  result += sin(coord * 2.734 + t * 3.345) * 0.2;
  result += sin(coord * 0.189 + t * 0.934) * 0.3;
  return result;
}

vec2 rotate2D(vec2 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 coords = gl_FragCoord.xy / uResolution.xy;
  coords = coords * 2.0 - 1.0;
  coords.x *= uResolution.z;
  coords = rotate2D(coords, uRotation);

  float halfT = uTime * uSpeed * 0.5;
  float fullT = uTime * uSpeed;

  float mouseWarp = 0.0;
  if (uEnableMouse) {
    vec2 mPos = rotate2D(uMouse * 2.0 - 1.0, uRotation);
    float mDist = length(coords - mPos);
    mouseWarp = uMouseInfluence * exp(-mDist * mDist * 4.0);
  }

  float warpAx = coords.x + displaceA(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpAy = coords.y - displaceA(coords.x * cos(fullT) * 1.235, halfT) * uWarpIntensity;
  float warpBx = coords.x + displaceB(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpBy = coords.y - displaceB(coords.x * sin(fullT) * 1.235, halfT) * uWarpIntensity;

  vec2 fieldA = vec2(warpAx, warpAy);
  vec2 fieldB = vec2(warpBx, warpBy);
  vec2 blended = mix(fieldA, fieldB, 0.5);

  float fadeTop = smoothstep(uEdgeFadeWidth, uEdgeFadeWidth + 0.4, blended.y);
  float fadeBottom = smoothstep(-uEdgeFadeWidth, -(uEdgeFadeWidth + 0.4), blended.y);
  float vMask = 1.0 - max(fadeTop, fadeBottom);

  float tileCount = mix(uOuterLines, uInnerLines, vMask);
  float scaledY = blended.y * tileCount;
  float nY = smoothNoise(abs(scaledY));

  float ridge = pow(step(abs(nY - blended.x) * 2.0, HALF_PI) * cos(2.0 * (nY - blended.x)), 5.0);
  float lines = 0.0;
  for (float i = 1.0; i < 3.0; i += 1.0) {
    lines += pow(max(fract(scaledY), fract(-scaledY)), i * 2.0);
  }

  float pattern = vMask * lines;
  float cycleT = fullT * uColorCycleSpeed;
  float rChannel = (pattern + lines * ridge) * (cos(blended.y + cycleT * 0.234) * 0.5 + 1.0);
  float gChannel = (pattern + vMask * ridge) * (sin(blended.x + cycleT * 1.745) * 0.5 + 1.0);
  float bChannel = (pattern + lines * ridge) * (cos(blended.x + cycleT * 0.534) * 0.5 + 1.0);

  vec3 col = (rChannel * uColor1 + gChannel * uColor2 + bChannel * uColor3) * uBrightness;
  float edge = smoothstep(0.0, 0.14, gl_FragCoord.x / uResolution.x) * smoothstep(1.0, 0.86, gl_FragCoord.x / uResolution.x);
  float alpha = clamp(length(col) * edge, 0.0, 0.72);
  gl_FragColor = vec4(col * edge, alpha);
}
`;function k({speed:r=.3,innerLineCount:t=32,outerLineCount:v=36,warpIntensity:m=1,rotation:p=-45,edgeFadeWidth:h=0,colorCycleSpeed:g=1,brightness:x=.2,color1:y="#ffffff",color2:C="#ffffff",color3:w="#ffffff",enableMouseInteraction:s=!0,mouseInfluence:T=2}){const M=A.useRef(null);return A.useEffect(()=>{const o=M.current;if(!o)return;const f=new P({alpha:!0,premultipliedAlpha:!1,dpr:Math.min(window.devicePixelRatio||1,1.7)}),e=f.gl;e.clearColor(0,0,0,0);let n=[.5,.5],u=[.5,.5];const B=new S(e),I=p*Math.PI/180,l=new _(e,{vertex:N,fragment:z,transparent:!0,uniforms:{uTime:{value:0},uResolution:{value:[e.canvas.width,e.canvas.height,e.canvas.width/Math.max(e.canvas.height,1)]},uSpeed:{value:r},uInnerLines:{value:t},uOuterLines:{value:v},uWarpIntensity:{value:m},uRotation:{value:I},uEdgeFadeWidth:{value:h},uColorCycleSpeed:{value:g},uBrightness:{value:x},uColor1:{value:d(y)},uColor2:{value:d(C)},uColor3:{value:d(w)},uMouse:{value:new Float32Array([.5,.5])},uMouseInfluence:{value:T},uEnableMouse:{value:s}}}),L=new Y(e,{geometry:B,program:l}),b=()=>{f.setSize(o.offsetWidth||1,o.offsetHeight||1),l.uniforms.uResolution.value=[e.canvas.width,e.canvas.height,e.canvas.width/Math.max(e.canvas.height,1)]},R=a=>{const i=e.canvas.getBoundingClientRect();u=[(a.clientX-i.left)/i.width,1-(a.clientY-i.top)/i.height]},F=()=>{u=[.5,.5]},E=new ResizeObserver(b);E.observe(o),b(),o.appendChild(e.canvas),s&&(e.canvas.addEventListener("mousemove",R),e.canvas.addEventListener("mouseleave",F));let c=0;const W=a=>{c=requestAnimationFrame(W),l.uniforms.uTime.value=a*.001,s&&(n[0]+=.05*(u[0]-n[0]),n[1]+=.05*(u[1]-n[1]),l.uniforms.uMouse.value[0]=n[0],l.uniforms.uMouse.value[1]=n[1]),f.render({scene:L})};return c=requestAnimationFrame(W),()=>{var a;cancelAnimationFrame(c),E.disconnect(),s&&(e.canvas.removeEventListener("mousemove",R),e.canvas.removeEventListener("mouseleave",F)),o.contains(e.canvas)&&o.removeChild(e.canvas),(a=e.getExtension("WEBGL_lose_context"))==null||a.loseContext()}},[x,y,C,w,g,h,s,t,T,v,p,r,m]),D.jsx("div",{ref:M,className:"line-waves-container"})}export{k as default};
