var Pt=Object.defineProperty;var Ct=(f,a,o)=>a in f?Pt(f,a,{enumerable:!0,configurable:!0,writable:!0,value:o}):f[a]=o;var x=(f,a,o)=>Ct(f,typeof a!="symbol"?a+"":a,o);(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))e(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&e(s)}).observe(document,{childList:!0,subtree:!0});function o(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerPolicy&&(n.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?n.credentials="include":l.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function e(l){if(l.ep)return;l.ep=!0;const n=o(l);fetch(l.href,n)}})();const pt=3.5,Lt=1.2,H=1.33,U=.2,Ft=14/240;function B(f,a){const o=f/a;return Math.pow(1+o*o,-1.5)}function gt(f,a){return a*Math.sqrt(Math.pow(f,-2/3)-1)}function $(f,a){return(B(f,a)+U)/(1+U)}function It(f,a,o){return $(f,o)-$(a,o)}const _t=.46;function Dt(f){return{h:pt*f,size:Lt*f,depth:Ft*f}}const vt=[6,146,206],X=[4,168,230],xt=[5,184,250],Ut="#fbf7ee",kt="#dbd0bd",yt=1.2;function Wt(f,a,o){const e=Math.min(yt,Math.max(0,It(f,a,o)/_t)),l=n=>{const[s,i,t]=n.map((c,r)=>Math.round(X[r]+(c-X[r])*e));return`rgb(${s},${i},${t})`};return{lit:l(xt),mid:l(X),deep:l(vt)}}function Y(f){return`vec3(${f.map(a=>a.toFixed(1)).join(", ")}) / 255.0`}const Bt=`
       const vec3 WATER_DEEP = ${Y(vt)};
       const vec3 WATER_MID = ${Y(X)};
       const vec3 WATER_LIT = ${Y(xt)};`,Ot=`
       float lit(float d, float h) {
         return (fall(d, h) + u_ambient) / (1.0 + u_ambient);
       }`,Gt="#cda687",ot=.28,wt=.45,Nt=.625/240,qt=.42,Xt=16,at=Math.pow(3,1/Xt),V=.65,bt=[.41,.54,.62],lt=`
       uniform sampler2D u_mask;
       uniform vec2 u_lamp;
       uniform float u_height;
       uniform float u_ambient;
       float fall(float d, float h) {
         float k = d / h;
         return pow(1.0 + k * k, -1.5);
       }
       vec3 shadowAt(vec2 maskUv, vec2 cssPoint) {
         float t = texture(u_mask, maskUv).r;
         float direct = fall(length(cssPoint - u_lamp), u_height);
         t *= direct / (direct + u_ambient);
         return vec3(${bt.map(f=>`1.0 - t * ${(1-f).toFixed(4)}`).join(`,
                      `)});
       }`,j=12;function N(f){const[a,o,e]=bt.map(l=>Math.round(255*(1-f*(1-l))));return`rgb(${a},${o},${e})`}function Ht(f,a,o,e){const l=Math.max(o.depth-f.r*f.draft,o.depth*.25),n=o.size*l/(H*e),s=f.r+n,i=s*a,t=Math.max(2,Math.ceil(i*2)),c=document.createElement("canvas");c.width=t,c.height=t;const r=c.getContext("2d");r.translate(t/2,t/2);const m=s*a,d=Math.max(0,(f.r-n)/s),u=1-d,h=r.createRadialGradient(0,0,m*d,0,0,m);return h.addColorStop(0,N(1)),h.addColorStop(Math.min(.999,d+u*.32),N(.79)),h.addColorStop(Math.min(.9995,d+u*.68),N(.28)),h.addColorStop(1,N(0)),r.fillStyle=h,r.fillRect(-t,-t,t*2,t*2),{canvas:c,half:s,drop:l}}function $t(f,a,o){const l=(f+3)*a,n=Math.max(2,Math.ceil(l*2)),s=document.createElement("canvas");s.width=n,s.height=n;const i=s.getContext("2d");i.translate(n/2,n/2);const t=f*a,c=Math.min(o*a,t*qt),r=t-c,m=i.createRadialGradient(0,0,t*.08,0,0,t);m.addColorStop(0,"#fffdf8"),m.addColorStop(.55,Ut),m.addColorStop(1,kt),i.fillStyle=m,i.beginPath(),i.arc(0,0,t,0,Math.PI*2),i.fill(),i.save(),i.beginPath(),i.arc(0,0,r,0,Math.PI*2),i.clip(),i.fillStyle="#fdfaf2",i.fillRect(-r,-r,r*2,r*2);const d=i.createRadialGradient(0,0,r*.56,0,0,r);d.addColorStop(0,"rgba(120,104,84,0)"),d.addColorStop(.62,"rgba(120,104,84,0.1)"),d.addColorStop(.88,"rgba(112,96,76,0.21)"),d.addColorStop(1,"rgba(104,88,68,0.32)"),i.fillStyle=d,i.fillRect(-r,-r,r*2,r*2);const u=i.createRadialGradient(0,0,0,0,0,r*.2);u.addColorStop(0,"rgba(255,255,255,0.28)"),u.addColorStop(.45,"rgba(255,255,255,0.1)"),u.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=u,i.fillRect(-r,-r,r*2,r*2),i.restore();const h=(t+r)/2;i.lineWidth=Math.max(1,c*.86),i.strokeStyle="rgba(255,255,255,0.16)",i.beginPath(),i.arc(0,0,h,0,Math.PI*2),i.stroke(),i.lineWidth=Math.max(.6,c*.34),i.strokeStyle="rgba(255,255,255,0.52)",i.beginPath(),i.arc(0,0,h,0,Math.PI*2),i.stroke();const _=document.createElement("canvas");_.width=n,_.height=n;const p=_.getContext("2d");p.translate(n/2,n/2);const v=new Path2D;v.arc(0,0,t,0,Math.PI*2),v.arc(0,0,r,0,Math.PI*2),p.save(),p.clip(v,"evenodd");const y=V*t,b=p.createRadialGradient(y,0,t*.08,y,0,t*1.5);b.addColorStop(0,"rgba(255,253,246,0.34)"),b.addColorStop(1,"rgba(255,253,246,0)"),p.fillStyle=b,p.fillRect(-t,-t,t*2,t*2);const R=p.createRadialGradient(-y,0,t*.1,-y,0,t*1.4);R.addColorStop(0,"rgba(148,130,106,0.42)"),R.addColorStop(1,"rgba(148,130,106,0)"),p.fillStyle=R,p.fillRect(-t,-t,t*2,t*2),p.restore(),p.save(),p.beginPath(),p.arc(0,0,r,0,Math.PI*2),p.clip();const E=-V*r*.68,w=p.createRadialGradient(E,0,r*.05,E,0,r*1.25);w.addColorStop(0,"rgba(255,255,251,0.58)"),w.addColorStop(.5,"rgba(255,255,251,0.16)"),w.addColorStop(1,"rgba(255,255,251,0)"),p.fillStyle=w,p.fillRect(-r,-r,r*2,r*2);const A=-V*r*.6,g=p.createRadialGradient(A,0,r*.84,A,0,r);g.addColorStop(0,"rgba(74,62,46,0)"),g.addColorStop(1,"rgba(74,62,46,0.23)"),p.fillStyle=g,p.fillRect(-r,-r,r*2,r*2),p.save(),p.translate(-r*.72,0),p.scale(.62,1);const T=p.createRadialGradient(0,0,0,0,0,r*.36);T.addColorStop(0,"rgba(255,255,255,0.6)"),T.addColorStop(.45,"rgba(255,255,255,0.2)"),T.addColorStop(1,"rgba(255,255,255,0)"),p.fillStyle=T,p.fillRect(-r,-r,r*2,r*2),p.restore(),p.restore();const S=p.createLinearGradient(-h,0,h,0);return S.addColorStop(0,"rgba(132,116,96,0.36)"),S.addColorStop(.45,"rgba(132,116,96,0)"),S.addColorStop(.55,"rgba(255,255,255,0)"),S.addColorStop(1,"rgba(255,255,255,0.6)"),p.strokeStyle=S,p.lineWidth=Math.max(.6,c*.38),p.beginPath(),p.arc(0,0,h,0,Math.PI*2),p.stroke(),{body:s,shade:_,half:n/(2*a),r:f}}class zt{constructor(a,o={}){x(this,"gl");x(this,"quad");x(this,"instances");x(this,"texture");x(this,"framebuffer");x(this,"blobProgram");x(this,"poolProgram");x(this,"bowlProgram");x(this,"effectProgram");x(this,"bowlInstances");x(this,"effectInstances");x(this,"bodyAtlas");x(this,"shadeAtlas");x(this,"atlasEntries",[]);x(this,"atlasRungs",new Map);x(this,"atlasDirty",!0);x(this,"atlasTile",0);x(this,"atlasWidth",0);x(this,"atlasHeight",0);x(this,"width",0);x(this,"height",0);x(this,"getSprite",()=>{throw new Error("sprite lookup not installed")});this.canvas=a;const e=a.getContext("webgl2",{alpha:!1,antialias:!1,preserveDrawingBuffer:o.preserveDrawingBuffer??!1});if(!e)throw new Error("WebGL2 unavailable");this.gl=e,a.addEventListener("webglcontextlost",l=>{l.preventDefault()}),a.addEventListener("webglcontextrestored",()=>{window.location.reload()}),this.quad=e.createBuffer(),this.instances=e.createBuffer(),this.texture=e.createTexture(),this.framebuffer=e.createFramebuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.quad),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),this.blobProgram=this.program(`#version 300 es
       layout(location = 0) in vec2 a_quad;
       layout(location = 1) in vec2 a_center;
       layout(location = 2) in float a_half;
       layout(location = 3) in float a_cos;
       layout(location = 4) in float a_sin;
       layout(location = 5) in float a_cosWater;
       layout(location = 6) in float a_umbra;
       uniform vec2 u_resolution;
       out vec2 v_quad;
       flat out float v_umbra;
       void main() {
         vec2 q = vec2(a_quad.x * a_half / a_cosWater, a_quad.y * a_half);
         vec2 p = a_center + vec2(a_cos * q.x - a_sin * q.y,
                                  a_sin * q.x + a_cos * q.y);
         gl_Position = vec4(2.0 * p.x / u_resolution.x - 1.0,
                            1.0 - 2.0 * p.y / u_resolution.y, 0.0, 1.0);
         v_quad = a_quad;
         v_umbra = a_umbra;
       }`,`#version 300 es
       precision highp float;
       in vec2 v_quad;
       flat in float v_umbra;
       layout(location = 0) out float outCoverage;
       void main() {
         float u = length(v_quad);
         float soft = max(1.0 - v_umbra, 0.00001);
         float x = clamp((u - v_umbra) / soft, 0.0, 1.0);
         // The stop offsets are read straight off makeShadow, and where they
         // sit is the whole subtlety. Its gradient runs from r*umbra to r, so
         // its offset is already x — the fraction of the way through the
         // penumbra — and an offset written as "umbra + soft * 0.32" therefore
         // lands at x = umbra + soft * 0.32, not at x = 0.32. Reading those as
         // plain fractions of the penumbra pulls the whole falloff inward and
         // hands back a shadow that is too pale over its outer half.
         float s1 = min(0.999, v_umbra + soft * 0.32);
         float s2 = min(0.9995, v_umbra + soft * 0.68);
         float t = u <= v_umbra ? 1.0 :
           (x <= s1 ? mix(1.0, 0.79, x / s1) :
           (x <= s2 ? mix(0.79, 0.28, (x - s1) / max(s2 - s1, 1e-5)) :
                       mix(0.28, 0.0, (x - s2) / max(1.0 - s2, 1e-5))));
         float aa = max(fwidth(u), 0.00001);
         outCoverage = t * (1.0 - smoothstep(1.0 - aa, 1.0 + aa, u));
       }`),this.poolProgram=this.program(`#version 300 es
       const vec2 POS[4] = vec2[4](
         vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0), vec2(1.0, 1.0));
       void main() { gl_Position = vec4(POS[gl_VertexID], 0.0, 1.0); }`,`#version 300 es
       precision highp float;
       ${lt}
       uniform vec2 u_resolution;
       uniform float u_dpr;
       uniform int u_poolCount;
       uniform vec2 u_poolCenter[3];
       uniform float u_poolRadius[3];
       uniform vec2 u_poolAxis[3];
       uniform float u_poolR0[3];
       uniform float u_poolR1[3];
       uniform float u_poolFrac[3];
       layout(location = 0) out vec4 outColor;

       const vec3 FLOOR = vec3(205.0, 166.0, 135.0) / 255.0;
       const vec3 WASH = vec3(58.0, 40.0, 22.0) / 255.0;
       const vec3 WARM = vec3(255.0, 247.0, 230.0) / 255.0;
       ${Bt}
       const vec3 EDGE = vec3(3.0, 92.0, 139.0) / 255.0;
       const vec3 GLOSS = vec3(241.0, 249.0, 254.0) / 255.0;

       vec3 over(vec3 under, vec3 overColor, float alpha) {
         return mix(under, overColor, clamp(alpha, 0.0, 1.0));
       }
       float ramp(float x, float a, float b) {
         return clamp((x - a) / (b - a), 0.0, 1.0);
       }
       ${Ot}
       // The swing the room allows this basin, and then the paint moved that far
       // toward each end of its range. Mixing toward WATER_MID rather than
       // scaling the channels is what keeps the measured hue and chroma intact
       // at any contrast; see \`waterRamp\`, which this is the twin of.
       vec3 waterAt(float t, float mid, float swing) {
         vec3 lo = mix(WATER_MID, WATER_LIT, swing);
         vec3 hi = mix(WATER_MID, WATER_DEEP, swing);
         return t < mid
           ? mix(lo, WATER_MID, ramp(t, 0.0, mid))
           : mix(WATER_MID, hi, ramp(t, mid, 1.0));
       }
       float waterSwing(float r0, float r1) {
         return clamp((lit(r0, u_height) - lit(r1, u_height)) / ${_t.toFixed(4)},
                      0.0, ${yt.toFixed(4)});
       }
       float warmAlpha(float t) {
         return t < 0.55
           ? mix(0.42, 0.14, ramp(t, 0.0, 0.55))
           : mix(0.14, 0.0, ramp(t, 0.55, 1.0));
       }
       float washAlpha(float t, float reach) {
         float k = clamp(t * 6.0, 0.0, 5.99999);
         float i = floor(k);
         float f = fract(k);
         float a0 = ${ot.toFixed(4)} * (1.0 - lit((i / 6.0) * reach, u_height));
         float a1 = ${ot.toFixed(4)} * (1.0 - lit(((i + 1.0) / 6.0) * reach, u_height));
         return mix(a0, a1, f);
       }
       void main() {
         vec2 screen = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) / u_dpr;
         float reach = u_poolRadius[0] * 3.6;
         float washT = clamp(length(screen - u_lamp) / reach, 0.0, 1.0);
         float washA = washAlpha(washT, reach);
         vec3 color = over(FLOOR, WASH, washA);
         float warmT = clamp(length(screen - u_lamp) / (u_poolRadius[0] * 1.5), 0.0, 1.0);
         color = over(color, WARM, warmAlpha(warmT));

         for (int i = 0; i < 3; i++) {
           if (i >= u_poolCount) continue;
           vec2 local = screen - u_poolCenter[i];
           float d = length(local);
           float R = u_poolRadius[i];
           // A one-device-pixel feather is the equivalent of Canvas2D's clip.
           float poolAlpha = 1.0 - smoothstep(R - fwidth(d), R + fwidth(d), d);
           if (poolAlpha <= 0.0) continue;

           float r0 = u_poolR0[i];
           float r1 = u_poolR1[i];
           float wt = clamp((length(screen - u_lamp) - r0) / (r1 - r0), 0.0, 1.0);
           vec3 pool = waterAt(wt, u_poolFrac[i], waterSwing(r0, r1));

           // The non-concentric edge gradient, in its closed-form approximation.
           vec2 radial = d > 0.0001 ? local / d : u_poolAxis[i];
           float inner = (0.78 + 0.08 * dot(radial, u_poolAxis[i])) * R;
           float edgeA = 0.34 * ramp(d, inner, R);
           pool = over(pool, EDGE, edgeA);

           // The meniscus is a narrow ring with the pinned sRGB colour.
           float ringWidth = max(1.0, R * 0.012);
           float ringAA = max(fwidth(d), 0.5 / u_dpr);
           float innerEdge = R - ringWidth * 0.5;
           float outerEdge = R + ringWidth * 0.5;
           float innerRing = smoothstep(innerEdge - ringAA, innerEdge + ringAA, d);
           float outerRing = 1.0 - smoothstep(outerEdge - ringAA, outerEdge + ringAA, d);
           float ring = innerRing * outerRing;
           float along = clamp(0.5 + dot(local, u_poolAxis[i]) / (2.0 * R), 0.0, 1.0);
           float glossA = along < 0.5
             ? mix(0.09, 0.19, along * 2.0)
             : mix(0.19, 0.46, (along - 0.5) * 2.0);
           // Gathered shadow coverage darkens the water beneath the meniscus.
           pool *= shadowAt(gl_FragCoord.xy / u_resolution, screen);
           // The rim highlight is a catch on top of the water, so it must not
           // inherit the shadow beneath it.
           pool = over(pool, GLOSS, ring * glossA);
           color = mix(color, pool, poolAlpha);
         }
         outColor = vec4(color, 1.0);
       }`),this.bowlInstances=e.createBuffer(),this.effectInstances=e.createBuffer(),this.bodyAtlas=e.createTexture(),this.shadeAtlas=e.createTexture(),this.bowlProgram=this.program(`#version 300 es
       layout(location = 0) in vec2 a_quad;
       layout(location = 1) in vec2 a_center;
       layout(location = 2) in float a_half;
       layout(location = 3) in float a_cos;
       layout(location = 4) in float a_sin;
       layout(location = 5) in float a_alpha;
       layout(location = 6) in float a_tile;
       layout(location = 7) in float a_size;
       layout(location = 8) in float a_radius;
       uniform vec2 u_resolution;
       uniform float u_dpr;
       uniform float u_atlasTile;
       uniform float u_atlasWidth;
       uniform float u_atlasHeight;
       out vec2 v_uv;
       out vec2 v_center;
       out vec2 v_point;
       out float v_alpha;
       out float v_radius;
       void main() {
         vec2 q = a_quad * a_half;
         vec2 p = a_center + vec2(a_cos * q.x - a_sin * q.y,
                                  a_sin * q.x + a_cos * q.y);
         gl_Position = vec4(2.0 * p.x / u_resolution.x - 1.0,
                            1.0 - 2.0 * p.y / u_resolution.y, 0.0, 1.0);
         // The atlas row holding the top of a sprite is the one nearest the top
         // of the frame. a_quad.y = -1 is the top of the quad, since the
         // clip-space flip above turns +y downward, so it takes the tile's
         // first row. Getting this backwards mirrors the sprite, which the
         // bowls happen to survive — both are symmetric about the lamp axis —
         // and which anything struck off that axis would not.
         float side = (a_quad.y + 1.0) * 0.5 * a_size;
         v_uv = vec2((a_tile * u_atlasTile + 2.0 +
                      (a_quad.x + 1.0) * 0.5 * a_size) / u_atlasWidth,
                     (2.0 + side) / u_atlasHeight);
         v_center = a_center / u_dpr;
         v_point = p / u_dpr;
         v_alpha = a_alpha;
         v_radius = a_radius / u_dpr;
       }`,`#version 300 es
       precision highp float;
       uniform sampler2D u_atlas;
       uniform vec2 u_poolCenter;
       uniform float u_poolRadius;
       uniform vec2 u_lamp;
       uniform float u_height;
       uniform float u_ambient;
       uniform float u_dpr;
       uniform int u_effect;
       in vec2 v_uv;
       in vec2 v_center;
       in vec2 v_point;
       in float v_alpha;
       in float v_radius;
       layout(location = 0) out vec4 outColor;
       float fall(float d, float h) {
         float k = d / h;
         return pow(1.0 + k * k, -1.5);
       }
       /*
        * Everything here is premultiplied, which is not a preference — it is
        * the only arithmetic that survives a bilinear tap. Straight alpha keeps
        * a colour in the transparent texels, and a cleared canvas keeps black
        * there, so filtering across a sprite's edge drags the clay toward black
        * and rings every bowl in a dark hairline. Premultiplied, the
        * transparent texels contribute nothing because they *are* nothing, and
        * the interpolation of a colour and its coverage stays consistent.
        *
        * It also makes over() associative and free of a special case: laying
        * the meniscus on a transparent part of the sprite is an under-layer
        * with alpha below one, which is exactly where the straight-alpha mix()
        * form silently disagrees.
        */
       vec4 over(vec4 under, vec4 overColor) {
         return overColor + under * (1.0 - overColor.a);
       }
       /** A straight colour and its coverage, as one premultiplied sample. */
       vec4 lay(vec3 rgb, float alpha) {
         return vec4(rgb * alpha, alpha);
       }
       void main() {
         float poolD = length(v_point - u_poolCenter);
         float bowlD = length(v_point - v_center);
         float poolAA = max(fwidth(poolD), 0.5 / u_dpr);
         float poolAlpha = 1.0 - smoothstep(u_poolRadius - poolAA,
                                            u_poolRadius + poolAA, poolD);
         if (poolAlpha <= 0.0) discard;

         // Scaling a premultiplied sample by a coverage scales both halves.
         vec4 color = texture(u_atlas, v_uv) * v_alpha;
         if (u_effect == 1) {
           float width = max(0.6, v_radius * 0.06);
           // Half a pixel either side of the edge, so the whole feather is one
           // device pixel — what a canvas antialiases an arc over. A full
           // fwidth either side is two, which on a rim already thinner than a
           // pixel smears a dark line outward instead of drawing it.
           float aa = 0.5 * fwidth(bowlD);
           float inner = v_radius * 1.04 - width * 0.5;
           float outer = v_radius * 1.04 + width * 0.5;
           float ring = smoothstep(inner - aa, inner + aa, bowlD) *
                        (1.0 - smoothstep(outer - aa, outer + aa, bowlD));
           color = over(color, lay(vec3(3.0, 98.0, 150.0) / 255.0, ring * 0.3));
         }
         // See drawBowl. Scaling rgb and not a leaves the coverage intact, so
         // this darkens the clay without eating the sprite's edge.
         float reach = (fall(length(v_center - u_lamp), u_height) + u_ambient)
                     / (1.0 + u_ambient);
         color.rgb *= 1.0 + (reach - 1.0) * ${wt};
         outColor = color * poolAlpha;
       }`),this.effectProgram=this.program(`#version 300 es
       layout(location = 1) in vec2 a_center;
       layout(location = 2) in vec2 a_axis;
       layout(location = 3) in float a_length;
       layout(location = 4) in float a_width;
       layout(location = 5) in float a_radius;
       layout(location = 6) in float a_alpha;
       layout(location = 7) in float a_type;
       uniform vec2 u_resolution;
       uniform int u_shape;
       out vec2 v_point;
       out vec2 v_center;
       out float v_t;
       out float v_radius;
       out float v_width;
       out float v_alpha;
       flat out float v_type;
       void main() {
         vec2 q;
         vec2 p;
         if (u_shape == 0) {
           q = gl_VertexID == 0 ? vec2(0.0, -1.0) :
               (gl_VertexID == 1 ? vec2(1.0, 0.0) : vec2(0.0, 1.0));
           vec2 n = vec2(-a_axis.y, a_axis.x);
           p = a_center + a_axis * (q.x * a_length) + n * (q.y * a_width);
           v_t = q.x;
         } else {
           q = vec2((gl_VertexID & 1) == 0 ? -1.0 : 1.0,
                    gl_VertexID < 2 ? -1.0 : 1.0);
           p = a_center + q * (a_radius + a_width);
           v_t = 0.0;
         }
         gl_Position = vec4(2.0 * p.x / u_resolution.x - 1.0,
                            1.0 - 2.0 * p.y / u_resolution.y, 0.0, 1.0);
         v_point = p;
         v_center = a_center;
         v_radius = a_radius;
         v_width = a_width;
         v_alpha = a_alpha;
         v_type = a_type;
       }`,`#version 300 es
       precision highp float;
       precision highp int;
       ${lt}
       uniform vec2 u_resolution;
       uniform float u_dpr;
       uniform vec2 u_poolCenter;
       uniform float u_poolRadius;
       uniform int u_shape;
       in vec2 v_point;
       in vec2 v_center;
       in float v_t;
       in float v_radius;
       in float v_width;
       in float v_alpha;
       flat in float v_type;
       layout(location = 0) out vec4 outColor;
       void main() {
         float poolD = length(v_point - u_poolCenter);
         float poolAA = max(fwidth(poolD), 0.5);
         float poolAlpha = 1.0 - smoothstep(u_poolRadius - poolAA,
                                            u_poolRadius + poolAA, poolD);
         if (poolAlpha <= 0.0) discard;

         // A wake and a ripple lie on the water, so a shadow falling across one
         // darkens it. The pool pass has already multiplied the water it is
         // being laid on, but not this — so it carries the same multiplication
         // itself, which is what drawing it before the shadow amounted to.
         vec2 css = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) / u_dpr;
         vec3 shade = shadowAt(gl_FragCoord.xy / u_resolution, css);

         if (u_shape == 0) {
           outColor = vec4(shade, v_alpha * (1.0 - v_t) * poolAlpha);
           return;
         }
         float d = length(v_point - v_center);
         // Half a device pixel either side; see the bowl shader's meniscus.
         float aa = 0.5 * fwidth(d);
         // Inside the outer edge and outside the inner one. Both factors run
         // the same way round; inverting either leaves a ring that is nowhere.
         float ring = smoothstep(v_radius - v_width * 0.5 - aa,
                                 v_radius - v_width * 0.5 + aa, d) *
                      (1.0 - smoothstep(v_radius + v_width * 0.5 - aa,
                                        v_radius + v_width * 0.5 + aa, d));
         vec3 c = v_type < 0.5 ? vec3(3.0, 100.0, 152.0) / 255.0 :
                  vec3(1.0);
         float a = v_alpha * (v_type < 0.5 ? 0.55 :
                              (v_type < 1.5 ? 1.0 : 0.45));
         outColor = vec4(c * shade, a * ring * poolAlpha);
       }`)}renderMasks(a,o,e,l,n){const s=this.gl,i=Math.round(e*n),t=Math.round(l*n);this.resize(i,t);const c=[];for(const{pool:h,lx:_,ly:p,px:v,py:y}of a)for(const b of h.bowls){const R=b.x-_,E=b.y-p,w=Math.max(Math.hypot(R,E),.001),A=Math.hypot(w,o.h),g=w/A/H,T=Math.sqrt(1-g*g),S=Math.max(o.depth-b.r*b.draft,o.depth*.25),L=o.size*S/(H*A),F=b.r+L,C=S*g/T,k=Math.atan2(E,R);c.push((v+b.x+R/w*C)*n,(y+b.y+E/w*C)*n,F*n,Math.cos(k),Math.sin(k),T,Math.max(0,(b.r-L)/F))}s.bindFramebuffer(s.FRAMEBUFFER,this.framebuffer),s.viewport(0,0,i,t),s.clearColor(0,0,0,0),s.clear(s.COLOR_BUFFER_BIT),s.enable(s.BLEND),s.blendFunc(s.ONE,s.ONE),s.blendEquation(s.MAX),s.useProgram(this.blobProgram);const r=s.getUniformLocation(this.blobProgram,"u_resolution");s.uniform2f(r,i,t),s.bindBuffer(s.ARRAY_BUFFER,this.quad),s.enableVertexAttribArray(0),s.vertexAttribPointer(0,2,s.FLOAT,!1,0,0),s.bindBuffer(s.ARRAY_BUFFER,this.instances),s.bufferData(s.ARRAY_BUFFER,new Float32Array(c),s.STREAM_DRAW);const m=28,d=[0,8,12,16,20,24],u=[2,1,1,1,1,1];for(let h=0;h<d.length;h++){const _=h+1;s.enableVertexAttribArray(_),s.vertexAttribPointer(_,u[h],s.FLOAT,!1,m,d[h]),s.vertexAttribDivisor(_,1)}s.drawArraysInstanced(s.TRIANGLE_STRIP,0,4,c.length/7),s.blendEquation(s.FUNC_ADD),s.disable(s.BLEND)}renderBase(a,o,e,l,n,s,i){const t=this.gl,c=Math.round(n*i),r=Math.round(s*i);this.resize(c,r);const m=new Float32Array(6),d=new Float32Array(3);d[0]=o.h/pt;const u=new Float32Array(6),h=new Float32Array(3),_=new Float32Array(3),p=new Float32Array(3);for(let v=0;v<a.length&&v<3;v++){const{pool:y,lx:b,ly:R,px:E,py:w}=a[v],A=y.radius,g=Math.max(Math.hypot(b,R),.001),T=Math.max(g-A,A*.02),S=g+A,L=(B(T,o.h)+B(S,o.h))/2;m[v*2]=E,m[v*2+1]=w,d[v]=A,u[v*2]=-b/g,u[v*2+1]=-R/g,h[v]=T,_[v]=S,p[v]=Math.min(.95,Math.max(.05,(gt(L,o.h)-T)/(S-T)))}t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,c,r),t.disable(t.BLEND),t.clearColor(1,1,1,1),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(this.poolProgram),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture),t.uniform1i(t.getUniformLocation(this.poolProgram,"u_mask"),0),t.uniform2f(t.getUniformLocation(this.poolProgram,"u_resolution"),c,r),t.uniform1f(t.getUniformLocation(this.poolProgram,"u_dpr"),i),t.uniform2f(t.getUniformLocation(this.poolProgram,"u_lamp"),e,l),t.uniform1f(t.getUniformLocation(this.poolProgram,"u_height"),o.h),t.uniform1f(t.getUniformLocation(this.poolProgram,"u_ambient"),U),t.uniform1i(t.getUniformLocation(this.poolProgram,"u_poolCount"),Math.min(a.length,3)),t.uniform2fv(t.getUniformLocation(this.poolProgram,"u_poolCenter"),m),t.uniform1fv(t.getUniformLocation(this.poolProgram,"u_poolRadius"),d),t.uniform2fv(t.getUniformLocation(this.poolProgram,"u_poolAxis"),u),t.uniform1fv(t.getUniformLocation(this.poolProgram,"u_poolR0"),h),t.uniform1fv(t.getUniformLocation(this.poolProgram,"u_poolR1"),_),t.uniform1fv(t.getUniformLocation(this.poolProgram,"u_poolFrac"),p),t.drawArrays(t.TRIANGLE_STRIP,0,4)}renderEffects(a,o,e,l,n,s,i){const t=this.gl,c=Math.round(n*i),r=Math.round(s*i),m=36;t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,c,r),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.useProgram(this.effectProgram),t.uniform2f(t.getUniformLocation(this.effectProgram,"u_resolution"),c,r),t.uniform1f(t.getUniformLocation(this.effectProgram,"u_dpr"),i),t.uniform2f(t.getUniformLocation(this.effectProgram,"u_lamp"),e,l),t.uniform1f(t.getUniformLocation(this.effectProgram,"u_height"),o.h),t.uniform1f(t.getUniformLocation(this.effectProgram,"u_ambient"),U),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture),t.uniform1i(t.getUniformLocation(this.effectProgram,"u_mask"),0),t.uniform1i(t.getUniformLocation(this.effectProgram,"u_shape"),0),t.bindBuffer(t.ARRAY_BUFFER,this.effectInstances),this.bindEffectAttributes(m);for(const{pool:d,px:u,py:h}of a){const _=[];for(const p of d.bowls){const v=Math.hypot(p.vx,p.vy);if(v<6)continue;const y=Math.min(p.r*3.4,v*.5),b=-p.vx/v,R=-p.vy/v;_.push((u+p.x)*i,(h+p.y)*i,b,R,y*i,p.r*.85*i,0,Math.min(.26,v/340),0)}_.length&&(t.uniform2f(t.getUniformLocation(this.effectProgram,"u_poolCenter"),u*i,h*i),t.uniform1f(t.getUniformLocation(this.effectProgram,"u_poolRadius"),d.radius*i),t.bufferData(t.ARRAY_BUFFER,new Float32Array(_),t.STREAM_DRAW),t.drawArraysInstanced(t.TRIANGLES,0,3,_.length/9))}t.uniform1i(t.getUniformLocation(this.effectProgram,"u_shape"),1);for(const{pool:d,px:u,py:h}of a){const _=[];for(const p of d.ripples){const v=p.age/p.life,y=p.source*(.9+(1.1+p.strength*1.6)*v)*i,b=p.strength*Math.pow(1-v,1.7)*.6;if(b<=.002)continue;const R=Math.max(.5,2.2*(1-v))*i,E=(u+p.x)*i,w=(h+p.y)*i;if(_.push(E,w,0,0,y,R,y+R,b,0),_.push(E,w,0,0,y,R,y,b,1),v>.15){const A=(p.source*.9+(y/i-p.source*.9)*.55)*i;_.push(E,w,0,0,y,R,A,b,2)}}_.length&&(t.uniform2f(t.getUniformLocation(this.effectProgram,"u_poolCenter"),u*i,h*i),t.uniform1f(t.getUniformLocation(this.effectProgram,"u_poolRadius"),d.radius*i),t.bufferData(t.ARRAY_BUFFER,new Float32Array(_),t.STREAM_DRAW),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,_.length/9))}t.disable(t.BLEND)}bindEffectAttributes(a){const o=this.gl,e=[2,2,1,1,1,1,1],l=[0,2,4,5,6,7,8].map(n=>n*4);for(let n=0;n<e.length;n++){const s=n+1;o.enableVertexAttribArray(s),o.vertexAttribPointer(s,e[n],o.FLOAT,!1,a,l[n]),o.vertexAttribDivisor(s,1)}}renderBowls(a,o,e,l,n,s,i){const t=this.gl;if(this.uploadAtlases(),!this.atlasEntries.length)return;const c=Math.round(l*s),r=Math.round(n*s),m=36,d=[],u=[];t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,c,r),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.disable(t.DEPTH_TEST),t.useProgram(this.bowlProgram),t.uniform2f(t.getUniformLocation(this.bowlProgram,"u_resolution"),c,r),t.uniform1f(t.getUniformLocation(this.bowlProgram,"u_dpr"),s),t.uniform1f(t.getUniformLocation(this.bowlProgram,"u_atlasWidth"),this.atlasWidth),t.uniform1f(t.getUniformLocation(this.bowlProgram,"u_atlasHeight"),this.atlasHeight),t.uniform1f(t.getUniformLocation(this.bowlProgram,"u_atlasTile"),this.atlasTile),t.uniform2f(t.getUniformLocation(this.bowlProgram,"u_lamp"),o,e),t.uniform1f(t.getUniformLocation(this.bowlProgram,"u_height"),i.h),t.uniform1f(t.getUniformLocation(this.bowlProgram,"u_ambient"),U),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.bodyAtlas),t.uniform1i(t.getUniformLocation(this.bowlProgram,"u_atlas"),0),t.bindBuffer(t.ARRAY_BUFFER,this.quad),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,this.bowlInstances);for(const h of a){d.length=0,u.length=0;const{pool:_,px:p,py:v}=h;for(const y of _.bowls){const b=this.getSprite(y),R=this.atlasRungs.get(Math.round(Math.log(y.r)/Math.log(at))),E=(p+y.x)*s,w=(v+y.y)*s,A=b.half*y.r/b.r*s,g=y.angle,T=y.x+_.cx,S=y.y+_.cy,L=Math.atan2(-S,-T),F=Math.hypot(T,S)/Math.max(Math.hypot(T,S,i.h),1e-6),C=[E,w,A,Math.cos(g),Math.sin(g),1,R,b.body.width,y.r*s];d.push(...C),u.push(E,w,A,Math.cos(L),Math.sin(L),F,R,b.shade.width,y.r*s)}t.uniform2f(t.getUniformLocation(this.bowlProgram,"u_poolCenter"),p,v),t.uniform1f(t.getUniformLocation(this.bowlProgram,"u_poolRadius"),_.radius),t.uniform1i(t.getUniformLocation(this.bowlProgram,"u_effect"),1),this.drawBowlInstances(d,m),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.shadeAtlas),t.uniform1i(t.getUniformLocation(this.bowlProgram,"u_atlas"),0),t.uniform1i(t.getUniformLocation(this.bowlProgram,"u_effect"),2),this.drawBowlInstances(u,m),t.bindTexture(t.TEXTURE_2D,this.bodyAtlas)}t.disable(t.BLEND)}setSpriteLookup(a){this.getSprite=a}invalidateAtlases(){this.atlasEntries=[],this.atlasRungs.clear(),this.atlasDirty=!0}setAtlasEntries(a){a.length===this.atlasEntries.length&&a.every((o,e)=>{var l,n;return o.rung===((l=this.atlasEntries[e])==null?void 0:l.rung)&&o.sprite===((n=this.atlasEntries[e])==null?void 0:n.sprite)})||(this.atlasEntries=a,this.atlasRungs=new Map(a.map((o,e)=>[o.rung,e])),this.atlasDirty=!0)}drawBowlInstances(a,o){if(!a.length)return;const e=this.gl;e.bindBuffer(e.ARRAY_BUFFER,this.bowlInstances),e.bufferData(e.ARRAY_BUFFER,new Float32Array(a),e.STREAM_DRAW);const l=[2,1,1,1,1,1,1,1],n=[0,2,3,4,5,6,7,8].map(s=>s*4);for(let s=0;s<l.length;s++){const i=s+1;e.enableVertexAttribArray(i),e.vertexAttribPointer(i,l[s],e.FLOAT,!1,o,n[s]),e.vertexAttribDivisor(i,1)}e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,a.length/9)}uploadAtlases(){if(!this.atlasDirty)return;const a=this.gl;if(this.atlasEntries.length){this.atlasTile=Math.max(...this.atlasEntries.map(({sprite:o})=>o.body.width))+4,this.atlasWidth=this.atlasTile*this.atlasEntries.length,this.atlasHeight=this.atlasTile;for(const[o,e]of[[this.bodyAtlas,"body"],[this.shadeAtlas,"shade"]]){a.bindTexture(a.TEXTURE_2D,o),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,this.atlasWidth,this.atlasHeight,0,a.RGBA,a.UNSIGNED_BYTE,null),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE);for(let l=0;l<this.atlasEntries.length;l++){const n=this.atlasEntries[l].sprite;a.texSubImage2D(a.TEXTURE_2D,0,l*this.atlasTile+2,2,a.RGBA,a.UNSIGNED_BYTE,n[e])}}this.atlasDirty=!1}}resize(a,o){if(a===this.width&&o===this.height)return;const e=this.gl;if(this.width=a,this.height=o,this.canvas.width=a,this.canvas.height=o,e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,e.R8,a,o,0,e.RED,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.texture,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw new Error("shadow mask framebuffer is incomplete");e.bindFramebuffer(e.FRAMEBUFFER,null)}program(a,o){const e=this.gl,l=(s,i)=>{const t=e.createShader(s);if(e.shaderSource(t,i),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(t)||"shader compilation failed");return t},n=e.createProgram();if(e.attachShader(n,l(e.VERTEX_SHADER,a)),e.attachShader(n,l(e.FRAGMENT_SHADER,o)),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(n)||"shader link failed");return n}}class ro{constructor(a,o={}){x(this,"sprites",new Map);x(this,"blobs",new Map);x(this,"analyticMask",null);x(this,"ctx");x(this,"dpr",1);x(this,"rim",1);x(this,"mask",document.createElement("canvas"));x(this,"maskCtx",this.mask.getContext("2d"));try{this.analyticMask=new zt(a,o)}catch(e){if(console.error("WebGL renderer unavailable",e),this.ctx=a.getContext("2d",{alpha:!1}),!this.ctx)throw new Error("Canvas2D unavailable")}}setDpr(a){a!==this.dpr&&(this.dpr=a,this.invalidate())}invalidate(){this.sprites.clear(),this.blobs.clear(),this.analyticMask&&this.analyticMask.invalidateAtlases()}atlasEntries(){return[...this.sprites.entries()].map(([a,o])=>({rung:a,sprite:o}))}spriteFor(a){const o=Math.round(Math.log(a.r)/Math.log(at));let e=this.sprites.get(o);return e||(e=$t(Math.pow(at,o),this.dpr,this.rim),this.sprites.set(o,e)),e}frame(a,o,e,l){const n=e.length?e[0].radius:Math.min(a,o),s=Dt(n);this.rim=Nt*n;const i=a/2-l.x,t=o/2-l.y,c=[];for(const u of e)Math.abs(u.cx-l.x)<a/2+u.radius&&Math.abs(u.cy-l.y)<o/2+u.radius&&c.push({pool:u,lx:-u.cx,ly:-u.cy,px:i+u.cx,py:t+u.cy});if(this.analyticMask){this.analyticMask.renderMasks(c,s,a,o,this.dpr),this.analyticMask.renderBase(c,s,i,t,a,o,this.dpr);for(const u of c)for(const h of u.pool.bowls)this.spriteFor(h);this.analyticMask.setAtlasEntries(this.atlasEntries()),this.analyticMask.setSpriteLookup(u=>this.spriteFor(u)),this.analyticMask.renderEffects(c,s,i,t,a,o,this.dpr),this.analyticMask.renderBowls(c,i,t,a,o,this.dpr,s);return}const r=this.ctx;r.setTransform(this.dpr,0,0,this.dpr,0,0),r.fillStyle=Gt,r.fillRect(0,0,a,o),this.drawLightfall(a,o,i,t,n,s);const m=Math.round(a*this.dpr),d=Math.round(o*this.dpr);(this.mask.width!==m||this.mask.height!==d)&&(this.mask.width=m,this.mask.height=d),r.save(),r.translate(i,t);for(const u of e)Math.abs(u.cx-l.x)<a/2+u.radius&&Math.abs(u.cy-l.y)<o/2+u.radius&&this.drawPool(u,s,i+u.cx,t+u.cy,a,o);r.restore()}drawLightfall(a,o,e,l,n,s){const i=this.ctx,t=n*3.6,c=i.createRadialGradient(e,l,0,e,l,t),r=6;for(let d=0;d<=r;d++){const u=d/r,h=ot*(1-$(u*t,s.h));c.addColorStop(u,`rgba(58,40,22,${h.toFixed(3)})`)}i.fillStyle=c,i.fillRect(0,0,a,o);const m=i.createRadialGradient(e,l,0,e,l,n*1.5);m.addColorStop(0,"rgba(255,247,230,0.42)"),m.addColorStop(.55,"rgba(255,247,230,0.14)"),m.addColorStop(1,"rgba(255,247,230,0)"),i.fillStyle=m,i.fillRect(0,0,a,o)}drawPool(a,o,e,l,n,s){const i=this.ctx,{cx:t,cy:c,radius:r}=a;i.save(),i.translate(t,c);const m=-t,d=-c,u=Math.max(Math.hypot(m,d),.001),h=-m/u,_=-d/u;i.save(),i.beginPath(),i.arc(0,0,r,0,Math.PI*2),i.clip();const p=Math.max(u-r,r*.02),v=u+r,y=(B(p,o.h)+B(v,o.h))/2,b=Math.min(.95,Math.max(.05,(gt(y,o.h)-p)/(v-p))),R=i.createRadialGradient(m,d,p,m,d,v),E=Wt(p,v,o.h);R.addColorStop(0,E.lit),R.addColorStop(b,E.mid),R.addColorStop(1,E.deep),i.fillStyle=R,i.fillRect(-r,-r,r*2,r*2);const w=i.createRadialGradient(h*r*.08,_*r*.08,r*.78,0,0,r);w.addColorStop(0,"rgba(3,92,139,0)"),w.addColorStop(1,"rgba(3,92,139,0.34)"),i.fillStyle=w,i.fillRect(-r,-r,r*2,r*2),this.drawWakes(a),this.drawRipples(a),this.drawShadows(a,o,m,d,e,l,n,s);const A=i.createLinearGradient(-h*r,-_*r,h*r,_*r);A.addColorStop(0,"rgba(241,249,254,0.09)"),A.addColorStop(.5,"rgba(241,249,254,0.19)"),A.addColorStop(1,"rgba(241,249,254,0.46)"),i.strokeStyle=A,i.lineWidth=Math.max(1,r*.012),i.beginPath(),i.arc(0,0,r,0,Math.PI*2),i.stroke();for(const g of a.bowls)this.drawBowl(g,m,d,o);i.restore(),i.restore()}drawWakes(a){const o=this.ctx;o.save();for(const e of a.bowls){const l=Math.hypot(e.vx,e.vy);if(l<6)continue;const n=Math.min(e.r*3.4,l*.5),s=-e.vx/l,i=-e.vy/l,t=o.createLinearGradient(e.x,e.y,e.x+s*n,e.y+i*n);t.addColorStop(0,`rgba(255,255,255,${Math.min(.26,l/340)})`),t.addColorStop(1,"rgba(255,255,255,0)"),o.fillStyle=t;const c=-i,r=s,m=e.r*.85;o.beginPath(),o.moveTo(e.x+c*m,e.y+r*m),o.lineTo(e.x+s*n,e.y+i*n),o.lineTo(e.x-c*m,e.y-r*m),o.closePath(),o.fill()}o.restore()}drawRipples(a){const o=this.ctx;o.save();for(const e of a.ripples){const l=e.age/e.life,n=e.source*(.9+(1.1+e.strength*1.6)*l),s=e.strength*Math.pow(1-l,1.7)*.6;s<=.002||(o.lineWidth=Math.max(.5,2.2*(1-l)),o.strokeStyle=`rgba(3,100,152,${s*.55})`,o.beginPath(),o.arc(e.x,e.y,n+o.lineWidth,0,Math.PI*2),o.stroke(),o.strokeStyle=`rgba(255,255,255,${s})`,o.beginPath(),o.arc(e.x,e.y,n,0,Math.PI*2),o.stroke(),l>.15&&(o.globalAlpha=.45,o.beginPath(),o.arc(e.x,e.y,e.source*.9+(n-e.source*.9)*.55,0,Math.PI*2),o.stroke(),o.globalAlpha=1))}o.restore()}drawShadows(a,o,e,l,n,s,i,t){const c=this.maskCtx,r=a.radius,m=this.dpr;c.setTransform(m,0,0,m,n*m,s*m);const d=Math.max(-r,-n)-1,u=Math.min(r,i-n)+1,h=Math.max(-r,-s)-1,_=Math.min(r,t-s)+1;if(u<=d||_<=h)return;c.globalCompositeOperation="source-over",c.fillStyle="#fff",c.fillRect(d,h,u-d,_-h),c.globalCompositeOperation="darken";for(const E of a.bowls)this.castShadow(c,E,e,l,o);c.globalCompositeOperation="source-over";const p=Math.max(Math.hypot(e,l),.001),v=Math.max(p-r,r*.02),y=p+r,b=c.createRadialGradient(e,l,v,e,l,y);for(let E=0;E<=4;E++){const w=E/4,A=B(v+(y-v)*w,o.h);b.addColorStop(w,`rgba(255,255,255,${(U/(A+U)).toFixed(3)})`)}c.fillStyle=b,c.fillRect(d,h,u-d,_-h);const R=this.ctx;R.save(),R.setTransform(1,0,0,1,0,0),R.globalCompositeOperation="multiply",R.drawImage(this.mask,0,0),R.restore()}castShadow(a,o,e,l,n){const s=o.x-e,i=o.y-l,t=Math.max(Math.hypot(s,i),.001),c=Math.hypot(t,n.h),m=t/c/H,d=Math.sqrt(1-m*m),u=this.blobFor(o,n,c),h=u.drop*m/d;a.save(),a.translate(o.x+s/t*h,o.y+i/t*h),a.rotate(Math.atan2(i,s)),a.scale(1/d,1),a.drawImage(u.canvas,-u.half,-u.half,u.half*2,u.half*2),a.restore()}blobFor(a,o,e){const l=Math.max(1,Math.round(o.h/e*j)),n=a.id*(j+1)+l;let s=this.blobs.get(n);return s||(s=Ht(a,this.dpr,o,o.h*j/l),this.blobs.set(n,s)),s}drawBowl(a,o,e,l){const n=this.ctx,s=this.spriteFor(a),i=s.half*a.r/s.r,t=a.x-o,c=a.y-e,r=Math.hypot(t,c),m=1+($(r,l.h)-1)*wt;n.strokeStyle=`rgba(${Math.round(3*m)},${Math.round(98*m)},${Math.round(150*m)},0.3)`,n.lineWidth=Math.max(.6,a.r*.06),n.beginPath(),n.arc(a.x,a.y,a.r*1.04,0,Math.PI*2),n.stroke();const d=r/Math.max(Math.hypot(r,l.h),1e-6);n.save(),n.translate(a.x,a.y),n.filter=`brightness(${m.toFixed(4)})`,n.rotate(a.angle),n.drawImage(s.body,-i,-i,i*2,i*2),n.rotate(Math.atan2(-c,-t)-a.angle),n.globalAlpha=d,n.drawImage(s.shade,-i,-i,i*2,i*2),n.restore()}}const P=new Uint8Array(512);{const f=new Uint8Array(256);for(let o=0;o<256;o++)f[o]=o;let a=2654435769;for(let o=255;o>0;o--){a=a*1664525+1013904223>>>0;const e=a%(o+1),l=f[o];f[o]=f[e],f[e]=l}for(let o=0;o<512;o++)P[o]=f[o&255]}const K=f=>f*f*f*(f*(f*6-15)+10),M=new Float64Array(48);for(let f=0;f<16;f++){const a=f<8?0:1,o=f<4?1:f===12||f===14?0:2;M[f*3+a]+=f&1?-1:1,M[f*3+o]+=f&2?-1:1}function Yt(f,a,o){const e=Math.floor(f),l=Math.floor(a),n=Math.floor(o),s=e&255,i=l&255,t=n&255,c=f-e,r=a-l,m=o-n,d=K(c),u=K(r),h=K(m),_=P[s]+i,p=P[_&255]+t,v=P[_+1&255]+t,y=P[s+1&255]+i,b=P[y&255]+t,R=P[y+1&255]+t,E=c-1,w=r-1,A=m-1;let g=(P[p&255]&15)*3;const T=M[g]*c+M[g+1]*r+M[g+2]*m;g=(P[b&255]&15)*3;const S=M[g]*E+M[g+1]*r+M[g+2]*m;g=(P[v&255]&15)*3;const L=M[g]*c+M[g+1]*w+M[g+2]*m;g=(P[R&255]&15)*3;const F=M[g]*E+M[g+1]*w+M[g+2]*m;g=(P[p+1&255]&15)*3;const C=M[g]*c+M[g+1]*r+M[g+2]*A;g=(P[b+1&255]&15)*3;const k=M[g]*E+M[g+1]*r+M[g+2]*A;g=(P[v+1&255]&15)*3;const I=M[g]*c+M[g+1]*w+M[g+2]*A;g=(P[R+1&255]&15)*3;const Et=M[g]*E+M[g+1]*w+M[g+2]*A,st=T+(S-T)*d,Mt=L+(F-L)*d,nt=C+(k-C)*d,Tt=I+(Et-I)*d,rt=st+(Mt-st)*u,St=nt+(Tt-nt)*u;return rt+(St-rt)*h}const At=4,it=2,Rt=Math.pow(it,-4/3),Vt=Math.pow(it,2/3),jt=(()=>{let f=0;for(let a=0,o=1;a<At;a++,o*=Rt)f+=o;return f})();function Kt(f,a,o){let e=0,l=1,n=1,s=1;for(let i=0;i<At;i++)e+=l*Yt(f*n+i*31.4,a*n-i*17.2,o*s+i*7.9),l*=Rt,n*=it,s*=Vt;return e/jt}const W=.012,ct=.34,Zt=.3849,Jt=2.6,O=.02,ht=.94,Qt=1.6;function q(f,a,o,e,l,n){const s=e*a+l*o,i=-e*o+l*a,t=Math.tanh(i/f.width),c=Math.abs(t)*(1-t*t)/Zt,r=.62+.38*((s+1)/2);return(ct+(1-ct)*c)*r*(1-e*e-l*l)*Kt(e*f.scale+f.seed,l*f.scale-f.seed*.7,n*f.drift+f.seed)}function G(f,a,o,e,l,n){const s=e*a+l*o,i=-e*o+l*a,t=f.width,c=Math.tanh(i/t),r=1-c*c,m=f.jet*(r*(1-s*s-i*i)-2*i*t*c),d=2*f.jet*t*s*c;n.x=m*a-d*o,n.y=m*o+d*a}const D={x:0,y:0},Z={x:0,y:0},J={x:0,y:0},Q={x:0,y:0},tt={x:0,y:0};function to(f,a,o,e,l){const n=Math.cos(f.axis),s=Math.sin(f.axis),i=(q(f,n,s,a,o+W,e)-q(f,n,s,a,o-W,e))/(2*W),t=(q(f,n,s,a+W,o,e)-q(f,n,s,a-W,o,e))/(2*W),c=f.strength*Jt/f.scale;let r=i*c,m=-t*c;G(f,n,s,a,o,D),r+=D.x,m+=D.y,G(f,n,s,a+O,o,J),G(f,n,s,a-O,o,Z),G(f,n,s,a,o+O,tt),G(f,n,s,a,o-O,Q);const d=1/(2*O*Qt);r+=(D.x*(J.x-Z.x)+D.y*(tt.x-Q.x))*d,m+=(D.x*(J.y-Z.y)+D.y*(tt.y-Q.y))*d;const u=Math.hypot(a,o),h=(u-ht)/(1-ht);if(h>0&&u>1e-4){const _=f.confine*h*h;r-=a/u*_,m-=o/u*_}l.x=r,l.y=m}const z=5/480,et=15/480,oo=.02,ao=.004;let eo=0;const ft=.25,io=z+(et-z)*.4,so=.012,ut=.055,dt=4;function mt(f,a){return Math.max(-a,Math.min(a,f))}class lo{constructor(a,o,e,l,n){x(this,"bowls",[]);x(this,"ripples",[]);x(this,"contacts",[]);x(this,"t",0);x(this,"phase",0);x(this,"flowVec",{x:0,y:0});x(this,"touching",new Set);x(this,"wasTouching",new Set);x(this,"collisionCellSize",0);x(this,"collisionOrigin",0);x(this,"collisionGridWidth",0);x(this,"collisionHeads",new Int32Array(0));x(this,"collisionNext",new Int32Array(0));x(this,"collisionTouched",new Int32Array(0));x(this,"collisionTouchedCount",0);x(this,"collisionCell",new Int32Array(0));x(this,"collisionCandidates",new Int32Array(0));this.cx=a,this.cy=o,this.radius=e,this.flow=l,this.rng=n}populate(a){let o=0,e=0;for(;o<a&&e++<4e3;){const l=this.rng(),n=this.radius*(z+(et-z)*Math.pow(l,1.5)),s=this.radius*(1-oo)-n,i=this.rng()*Math.PI*2,t=Math.sqrt(this.rng())*s,c=Math.cos(i)*t,r=Math.sin(i)*t,m=this.radius*ao;this.bowls.some(d=>Math.hypot(d.x-c,d.y-r)<d.r+n+m)||(this.bowls.push({id:eo++,r:n,m:n*n*.012,x:c,y:r,vx:0,vy:0,angle:this.rng()*Math.PI*2,spin:(this.rng()-.5)*.2,draft:.16+.1*this.rng(),tx:0,ty:0,timbre:this.rng(),quiet:1,onWall:!1}),o++)}}step(a){this.t+=a;const o=this.radius,e=o*io,l=this.phase++&dt-1,n=this.bowls;for(let s=0;s<n.length;s++){const i=n[s];i.quiet+=a,(s&dt-1)===l&&(to(this.flow,i.x/o,i.y/o,this.t,this.flowVec),i.tx=this.flowVec.x,i.ty=this.flowVec.y);const t=i.tx*o,c=i.ty*o,r=3.6*Math.pow(i.r,1.5)/(i.m*40);i.vx+=(t-i.vx)*Math.min(1,r*a),i.vy+=(c-i.vy)*Math.min(1,r*a),i.x+=i.vx*a,i.y+=i.vy*a,i.angle+=i.spin*a,i.spin*=Math.exp(-.7*e*a/i.r)}this.resolveBowlContacts(),this.resolveWallContacts(o);for(let s=this.ripples.length-1;s>=0;s--){const i=this.ripples[s];i.age+=a,i.age>=i.life&&this.ripples.splice(s,1)}}prepareCollisionGrid(a){const o=this.bowls;if(o.length===0)return;let e=a*et;for(const h of o)h.r>e&&(e=h.r);const l=e*2,n=l*2,s=-a-n,i=Math.ceil((2*a+n*2)/l)+1;if(this.collisionCellSize!==l||this.collisionOrigin!==s||this.collisionGridWidth!==i)this.collisionCellSize=l,this.collisionOrigin=s,this.collisionGridWidth=i,this.collisionHeads=new Int32Array(i*i),this.collisionHeads.fill(-1),this.collisionTouched=new Int32Array(o.length),this.collisionTouchedCount=0;else{for(let h=0;h<this.collisionTouchedCount;h++)this.collisionHeads[this.collisionTouched[h]]=-1;this.collisionTouchedCount=0}this.collisionNext.length<o.length&&(this.collisionNext=new Int32Array(o.length)),this.collisionTouched.length<o.length&&(this.collisionTouched=new Int32Array(o.length)),this.collisionCell.length<o.length&&(this.collisionCell=new Int32Array(o.length)),this.collisionCandidates.length<o.length&&(this.collisionCandidates=new Int32Array(o.length));const t=i-2,c=this.collisionHeads,r=this.collisionNext,m=this.collisionTouched,d=this.collisionCell;let u=this.collisionTouchedCount;for(let h=0;h<o.length;h++){const _=o[h],p=Math.max(1,Math.min(t,Math.floor((_.x-s)/l))),y=Math.max(1,Math.min(t,Math.floor((_.y-s)/l)))*i+p;d[h]=y,c[y]===-1&&(m[u++]=y),r[h]=c[y],c[y]=h}this.collisionTouchedCount=u}resolveBowlContacts(){const a=this.bowls,o=this.wasTouching;this.wasTouching=this.touching,this.touching=o,this.touching.clear(),this.prepareCollisionGrid(this.radius);const e=this.collisionCandidates,l=this.collisionHeads,n=this.collisionNext,s=this.collisionCell,i=this.collisionGridWidth;for(let t=0;t<a.length;t++){const c=a[t],r=s[t];let m=0;for(let d=r-i;d<=r+i;d+=i)for(let u=d-1;u<=d+1;u++)for(let h=l[u];h!==-1;h=n[h])h>t&&(e[m++]=h);for(let d=1;d<m;d++){const u=e[d];let h=d-1;for(;h>=0&&e[h]>u;)e[h+1]=e[h],h--;e[h+1]=u}for(let d=0;d<m;d++){const u=e[d],h=a[u];let _=h.x-c.x,p=h.y-c.y;const v=c.r+h.r,y=_*_+p*p;if(y>=v*v)continue;const b=t*a.length+u,R=!this.wasTouching.has(b);this.touching.add(b);let E=Math.sqrt(y);E<1e-6&&(_=1,p=0,E=1e-6);const w=_/E,A=p/E,g=v-E,T=c.m+h.m;c.x-=w*g*(h.m/T),c.y-=A*g*(h.m/T),h.x+=w*g*(c.m/T),h.y+=A*g*(c.m/T);const S=h.vx-c.vx,L=h.vy-c.vy,F=S*w+L*A;if(F>0)continue;const C=-1.42*F/(1/c.m+1/h.m);c.vx-=C*w/c.m,c.vy-=C*A/c.m,h.vx+=C*w/h.m,h.vy+=C*A/h.m;const k=-S*A+L*w-c.spin*c.r-h.spin*h.r,I=mt(-k/(3*(1/c.m+1/h.m)),ft*C);c.vx+=I*A/c.m,c.vy-=I*w/c.m,h.vx-=I*A/h.m,h.vy+=I*w/h.m,c.spin-=2*I/(c.m*c.r),h.spin-=2*I/(h.m*h.r),R&&this.report("bowl",c,h,C,c.x+w*c.r,c.y+A*c.r)}}}resolveWallContacts(a){for(const o of this.bowls){const e=Math.hypot(o.x,o.y),l=a-o.r;if(e<=l){o.onWall=!1;continue}const n=!o.onWall;o.onWall=!0;const s=e<1e-6?1:o.x/e,i=e<1e-6?0:o.y/e;o.x=s*l,o.y=i*l;const t=o.vx*s+o.vy*i;if(t<=0)continue;const c=-1.3*t*o.m;o.vx+=c*s/o.m,o.vy+=c*i/o.m;const r=-o.vx*i+o.vy*s+o.spin*o.r,m=mt(-r*o.m/3,ft*Math.abs(c));o.vx-=m*i/o.m,o.vy+=m*s/o.m,o.spin+=2*m/(o.m*o.r),n&&this.report("wall",o,null,c,s*a,i*a)}}report(a,o,e,l,n,s){const i=Math.abs(l),t=i/o.m,c=e?i/e.m:0,r=Math.max(t,c),m=so*this.radius;if(r<m)return;const d=r/this.radius;this.ripples.push({x:n,y:s,age:0,life:.7+Math.min(.8,d/.155),strength:Math.min(1,d/.118),source:e?Math.min(o.r,e.r):o.r});const u=[];t>=m&&o.quiet>=ut&&(o.quiet=0,u.push({bowl:o,dv:t})),e&&c>=m&&e.quiet>=ut&&(e.quiet=0,u.push({bowl:e,dv:c})),u.length!==0&&this.contacts.push({kind:a,strikes:u,impulse:i,peakDv:r,x:n+this.cx,y:s+this.cy})}}export{lo as P,ro as R};
