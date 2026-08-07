var nt=Object.defineProperty;var st=(e,n,t)=>n in e?nt(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t;var w=(e,n,t)=>st(e,typeof n!="symbol"?n+"":n,t);import{R as at,P as it}from"./sim-B88PxYSu.js";const z=4,ot=String.raw`
// Sized against the strike rate, not picked round: 28 slots suited the ~12
// voices/s the piece ran at when the bowls were drawn five times too large.
// At their true scale it takes a far denser population to make them meet at
// all, and the rate more than doubled — at 28 the pool was stealing voices
// that were still plainly ringing, so the overlapping tails that carry the
// piece got cut back exactly when there were finally enough of them.
const MAX_VOICES = 64;
const MODES = 6;

// Partial ratios for a struck open bowl. These were a bell's spread — a near
// octave at 2.02 and modes reaching to 5.9 — which is most of what made the
// piece chime. Earthenware is squatter than that: the modes sit closer in and
// lower, and none of them lands on a simple ratio with the fundamental, so the
// bank reads as a body being knocked rather than as a struck interval.
const RATIOS = [1, 1.58, 2.31, 2.97, 3.72, 4.61];
// Weighted into the low modes. The top two are barely present now; they were
// the sparkle.
const MODE_GAIN = [1, 0.7, 0.38, 0.2, 0.1, 0.05];
// Unglazed clay has high internal damping and it rises steeply with frequency,
// so the upper modes are gone almost as soon as they sound and only the low
// body is left ringing. That split — a broad knock that collapses to a short
// pitched bloom — is the earthiness; a bell holds all six modes for its whole
// tail, which is why it shimmers and this doesn't.
const MODE_DECAY = [1, 0.5, 0.32, 0.2, 0.13, 0.09];

// One-pole cutoff for the contact noise, as a coefficient on 48 kHz-ish rates.
// Glaze on glaze is a tick; clay on clay is duller than the resonators alone
// will make it, so the burst is rolled off before it reaches them.
const CONTACT_LP = 0.12;

// --- Two ears --------------------------------------------------------------

// A head is about 17.5 cm across, and sound crosses it in the time that is the
// whole of the left-right cue. Woodworth's approximation puts the interaural
// delay at (a/c)(theta + sin theta), so it maxes out around 650 microseconds —
// thirty-odd samples, and the single most convincing thing you can do to two
// channels. Amplitude panning has none of it: it moves a sound along a line
// between the ears, and this puts it out in the room.
const HEAD_RADIUS = 0.0875;
const SPEED_OF_SOUND = 343;

// Ring buffer for the far ear, long enough for the full delay at any sample
// rate a browser will hand us.
const ITD_SIZE = 128;
const ITD_MASK = ITD_SIZE - 1;

// The far ear also sits in the head's acoustic shadow, which is a lowpass and
// not a volume knob — the head is large against a treble wavelength and small
// against a bass one, so lows bend round it undiminished while the top is lost.
// This is the cutoff the far ear falls to when a source is at a right angle.
const SHADOW_FLOOR = 2200;

class BowlProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    const n = MAX_VOICES * MODES;
    this.y1 = new Float32Array(n);
    this.y2 = new Float32Array(n);
    this.b1 = new Float32Array(n);
    this.b2 = new Float32Array(n);
    this.mg = new Float32Array(n);

    this.active = new Uint8Array(MAX_VOICES);
    this.level = new Float32Array(MAX_VOICES);
    this.exCount = new Int32Array(MAX_VOICES);
    this.exAmp = new Float32Array(MAX_VOICES);
    this.exDecay = new Float32Array(MAX_VOICES);
    this.exFirst = new Uint8Array(MAX_VOICES);
    this.exLp = new Float32Array(MAX_VOICES);
    this.age = new Float64Array(MAX_VOICES);

    // Where this contact is, as the two ears get it.
    this.gNear = new Float32Array(MAX_VOICES);
    this.gFar = new Float32Array(MAX_VOICES);
    // Which ear is the far one: 1 if the source is off to the left.
    this.farIsRight = new Uint8Array(MAX_VOICES);
    this.itd = new Int32Array(MAX_VOICES);
    this.itdBuf = new Float32Array(MAX_VOICES * ITD_SIZE);
    this.itdW = new Int32Array(MAX_VOICES);
    this.shadowA = new Float32Array(MAX_VOICES);
    this.shadowZ = new Float32Array(MAX_VOICES);
    // Air absorption, and the pinna's dislike of what is behind it.
    this.toneA = new Float32Array(MAX_VOICES);
    this.toneZ = new Float32Array(MAX_VOICES);
    // This contact's share of the reverberant field.
    this.sendG = new Float32Array(MAX_VOICES);

    // Strikes waiting on their own sound to cross the floor.
    this.pending = [];

    this.clock = 0;
    this.gain = 0.6;
    this.binaural = true;

    this.port.onmessage = (e) => {
      const d = e.data;
      if (d.type === 'hit') this.schedule(d);
      else if (d.type === 'gain') this.gain = d.value;
      else if (d.type === 'binaural') this.binaural = !!d.value;
    };
  }

  allocate() {
    for (let v = 0; v < MAX_VOICES; v++) {
      if (!this.active[v]) return v;
    }
    // All busy: steal the quietest, preferring older voices on a tie.
    let best = 0;
    let bestScore = Infinity;
    for (let v = 0; v < MAX_VOICES; v++) {
      const score = this.level[v] * 1000 + this.age[v];
      if (score < bestScore) {
        bestScore = score;
        best = v;
      }
    }
    return best;
  }

  /**
   * Hold a strike for as long as its sound takes to reach the listener.
   *
   * Done by waiting rather than by a delay line, which costs nothing and is
   * also more honest: the far bowl has not been heard yet, so it has not taken
   * a voice yet either, and the budget belongs to whatever is sounding now.
   */
  schedule(d) {
    const at = this.clock + Math.round((d.flight || 0) * sampleRate);
    if (at <= this.clock) {
      this.strike(d);
      return;
    }
    // A runaway queue would be a leak; the floor is only so wide.
    if (this.pending.length >= MAX_VOICES * 2) this.pending.shift();
    this.pending.push({ at, d });
  }

  /** One-pole coefficient for a cutoff in Hz. */
  lp(hz) {
    const a = 1 - Math.exp((-2 * Math.PI * hz) / sampleRate);
    return a < 0 ? 0 : a > 1 ? 1 : a;
  }

  /**
   * Put this contact in the room. Everything here is fixed at the moment of
   * the strike and never revisited: a bowl ringing for a second while the view
   * scrolls does not chase the listener around, it stays where it was struck,
   * which is what a sound does.
   */
  place(v, d) {
    const az = d.az;
    // Near the listener's own position the direction to a contact is barely
    // defined and swings wildly with a pixel of scroll. The main thread sends
    // its judgement of how much direction there is to be had, and it takes
    // everything below to nothing as a contact approaches the ears.
    const near = d.spatial;

    // The far ear hears round the head, so what matters is how far off the
    // median plane the source is — not front or back. Something at 45 degrees
    // ahead and something at 135 gets the same delay, which is a real
    // confusion and not a bug; the spectrum is what tells them apart.
    const lat = Math.abs(az) <= Math.PI / 2 ? az : Math.sign(az) * (Math.PI - Math.abs(az));
    const shadow = Math.abs(Math.sin(lat)) * near;

    if (this.binaural) {
      this.itd[v] = Math.min(
        ITD_MASK,
        Math.round(((HEAD_RADIUS / SPEED_OF_SOUND) * (Math.abs(lat) + Math.sin(Math.abs(lat))) * near) * sampleRate),
      );
      // Blended to exactly transparent at the front, so a contact straight
      // ahead reaches both ears identically instead of arriving at one of
      // them through a filter that is only nearly open.
      const open = this.lp(SHADOW_FLOOR * Math.pow(20000 / SHADOW_FLOOR, 1 - shadow));
      this.shadowA[v] = open + (1 - open) * (1 - shadow);
      // Equal power at the front, opening to about nine decibels of level
      // difference at the side — the rest of the sidedness is in the delay and
      // the shadow, where the ear actually looks for it.
      this.gNear[v] = 0.707 + 0.293 * shadow;
      this.gFar[v] = 0.707 * (1 - 0.5 * shadow);
    } else {
      // Amplitude panning, for speakers. Same geometry, one cue instead of
      // three: no delay, no shadow, and front and back fold onto each other.
      const p = Math.sin(az) * near * 0.9;
      const theta = ((Math.abs(p) + 1) * Math.PI) / 4;
      this.itd[v] = 0;
      this.shadowA[v] = 1;
      this.gNear[v] = Math.sin(theta);
      this.gFar[v] = Math.cos(theta);
    }
    this.farIsRight[v] = az < 0 ? 1 : 0;

    this.toneA[v] = this.lp(d.cutoff);
    this.sendG[v] = d.send;
    this.shadowZ[v] = 0;
    this.toneZ[v] = 0;
    this.itdW[v] = 0;
    this.itdBuf.fill(0, v * ITD_SIZE, v * ITD_SIZE + ITD_SIZE);
  }

  strike(d) {
    const v = this.allocate();
    const base = v * MODES;
    const nyq = sampleRate * 0.46;

    for (let m = 0; m < MODES; m++) {
      const i = base + m;
      // Detune upper partials slightly per strike: no two contacts excite a
      // real bowl in exactly the same place.
      const jitter = 1 + (Math.random() - 0.5) * 0.012 * m;
      const f = d.f0 * RATIOS[m] * Math.pow(1 + d.stretch, m) * jitter;

      if (f >= nyq || f <= 0) {
        this.b1[i] = 0;
        this.b2[i] = 0;
        this.mg[i] = 0;
        this.y1[i] = 0;
        this.y2[i] = 0;
        continue;
      }

      const w = (2 * Math.PI * f) / sampleRate;
      const tau = Math.max(0.02, d.decay * MODE_DECAY[m]);
      const r = Math.exp(-1 / (tau * sampleRate));

      this.b1[i] = 2 * r * Math.cos(w);
      this.b2[i] = -r * r;
      // sin(w) normalises the resonator's impulse response to unit peak.
      // 'bright' tilts energy toward the upper partials on a hard strike.
      this.mg[i] = MODE_GAIN[m] * Math.sin(w) * (1 + d.bright * m * 0.22);
      this.y1[i] = 0;
      this.y2[i] = 0;
    }

    this.place(v, d);

    this.exAmp[v] = d.amp;
    // Contact transient: a couple of milliseconds of noise standing in for
    // the scrape of glaze on glaze before the body starts ringing.
    this.exCount[v] = Math.max(1, Math.round(sampleRate * d.contact));
    this.exDecay[v] = Math.exp(-6 / this.exCount[v]);
    this.exFirst[v] = 1;
    this.exLp[v] = 0;
    this.level[v] = d.amp;
    this.age[v] = this.clock;
    this.active[v] = 1;
  }

  process(_inputs, outputs) {
    const out = outputs[0];
    const dryL = out[0];
    const dryR = out[1];
    const wetL = out[2];
    const wetR = out[3];
    if (!dryL || !dryR || !wetL || !wetR) return true;
    const frames = dryL.length;

    dryL.fill(0);
    dryR.fill(0);
    wetL.fill(0);
    wetR.fill(0);

    // Anything whose sound has now had time to arrive.
    if (this.pending.length) {
      const due = this.clock + frames;
      for (let i = this.pending.length - 1; i >= 0; i--) {
        if (this.pending[i].at <= due) {
          const { d } = this.pending[i];
          this.pending.splice(i, 1);
          this.strike(d);
        }
      }
    }

    for (let v = 0; v < MAX_VOICES; v++) {
      if (!this.active[v]) continue;
      const base = v * MODES;
      const ring = v * ITD_SIZE;
      const gn = this.gNear[v];
      const gf = this.gFar[v];
      const itd = this.itd[v];
      const sa = this.shadowA[v];
      const ta = this.toneA[v];
      const sg = this.sendG[v];
      const farRight = this.farIsRight[v];
      let w = this.itdW[v];
      let sz = this.shadowZ[v];
      let tz = this.toneZ[v];
      let peak = 0;

      for (let n = 0; n < frames; n++) {
        let x = 0;
        if (this.exCount[v] > 0) {
          if (this.exFirst[v]) {
            // Lead with one coherent impulse. A narrow resonator only absorbs
            // the sliver of noise energy inside its own bandwidth, so a burst
            // alone leaves the bank almost silent; the impulse excites every
            // mode at full amplitude and sets the level of the ring.
            x = this.exAmp[v];
            this.exFirst[v] = 0;
          } else {
            this.exLp[v] += CONTACT_LP * ((Math.random() * 2 - 1) - this.exLp[v]);
            x = this.exLp[v] * this.exAmp[v] * 0.6;
          }
          this.exAmp[v] *= this.exDecay[v];
          this.exCount[v]--;
        }

        let s = 0;
        for (let m = 0; m < MODES; m++) {
          const i = base + m;
          const y = this.b1[i] * this.y1[i] + this.b2[i] * this.y2[i] + this.mg[i] * x;
          this.y2[i] = this.y1[i];
          this.y1[i] = y;
          s += y;
        }

        // The floor between here and there, taken off the top. This is the
        // whole sound — the ring and the knock alike — and not a tilt applied
        // to the partials, so a far contact is dull the way a far sound is.
        tz += ta * (s - tz);
        s = tz;

        const a = s < 0 ? -s : s;
        if (a > peak) peak = a;

        // The reverberant field has no direction, so it is fed the sound
        // before either ear has had it.
        wetL[n] += s * sg;
        wetR[n] += s * sg;

        // Near ear direct, far ear late and shadowed.
        this.itdBuf[ring + w] = s;
        const far = this.itdBuf[ring + ((w - itd) & ITD_MASK)];
        sz += sa * (far - sz);
        w = (w + 1) & ITD_MASK;

        if (farRight) {
          dryL[n] += s * gn;
          dryR[n] += sz * gf;
        } else {
          dryR[n] += s * gn;
          dryL[n] += sz * gf;
        }
      }

      this.itdW[v] = w;
      this.shadowZ[v] = sz;
      this.toneZ[v] = tz;
      this.level[v] = peak;
      if (peak < 1e-4 && this.exCount[v] <= 0) this.active[v] = 0;
    }

    const g = this.gain;
    for (let n = 0; n < frames; n++) {
      dryL[n] *= g;
      dryR[n] *= g;
      wetL[n] *= g;
      wetR[n] *= g;
    }

    this.clock += frames;
    return true;
  }
}

registerProcessor('bowl-processor', BowlProcessor);
`,rt=10.2,ht=.004,lt=.28,H=6.1,ct=343,q=1.6/H;function dt(e,n){const t=q*n;return t/Math.hypot(e,t)}const ut=.62,ft=1500,pt=.9,wt=.084,gt=[1,9/8,5/4,3/2,5/3],mt=196;function yt(e){let n=e,t=1/0;for(let s=-1;s<=4;s++){const o=mt*Math.pow(2,s);for(const a of gt){const i=o*a,r=Math.abs(Math.log2(i/e));r<t&&(t=r,n=i)}}return n}function vt(e,n,t){const s=Math.floor(e.sampleRate*n),o=e.createBuffer(2,s,e.sampleRate);for(let a=0;a<2;a++){const i=o.getChannelData(a);for(let h=0;h<s;h++){const c=h/s;i[h]=(Math.random()*2-1)*Math.pow(1-c,t)}const r=Math.floor(e.sampleRate*.012);i.copyWithin(r,0,s-r),i.fill(0,0,r)}return o}class bt{constructor(){w(this,"ctx",null);w(this,"node",null);w(this,"master",null);w(this,"ready",!1);w(this,"opened",!1);w(this,"budget",0);w(this,"binaural",!0)}get running(){return this.ready}get spatial(){return this.binaural}async start(){if(this.ctx){await this.ctx.resume(),this.opened&&this.fadeIn();return}const n=window.AudioContext??window.webkitAudioContext;if(!n)throw new Error("Web Audio is unavailable");const t=new n({latencyHint:"interactive"});this.ctx=t;const s=t.resume();t.addEventListener("statechange",()=>{this.opened&&this.fadeIn()});try{const o=URL.createObjectURL(new Blob([ot],{type:"text/javascript"}));try{await t.audioWorklet.addModule(o)}finally{URL.revokeObjectURL(o)}const a=new AudioWorkletNode(t,"bowl-processor",{outputChannelCount:[z]});this.node=a;const i=t.createChannelSplitter(z);a.connect(i);const r=et=>{const I=t.createBiquadFilter();I.type="highpass",I.frequency.value=90;const E=t.createBiquadFilter();E.type="highshelf",E.frequency.value=3200,E.gain.value=-9;const x=t.createBiquadFilter();return x.type="lowshelf",x.frequency.value=320,x.gain.value=2,et.connect(I),I.connect(E),E.connect(x),x},h=t.createGain();h.gain.value=.9;const c=t.createGain();c.gain.value=1;const p=t.createConvolver();p.buffer=vt(t,1.3,3.6);const d=t.createChannelMerger(2);i.connect(d,0,0),i.connect(d,1,1),r(d).connect(h);const R=t.createChannelMerger(2);i.connect(R,2,0),i.connect(R,3,1),r(R).connect(p);const y=t.createDynamicsCompressor();y.threshold.value=-4,y.knee.value=3,y.ratio.value=12,y.attack.value=.004,y.release.value=.18;const M=t.createGain();M.gain.value=0,this.master=M,p.connect(c),h.connect(M),c.connect(M),M.connect(y),y.connect(t.destination),await s,this.opened&&this.fadeIn()}catch(o){throw await t.close().catch(()=>{}),this.ctx=null,this.node=null,this.master=null,o}}open(){this.opened=!0,this.fadeIn()}fadeIn(){const n=this.ctx,t=this.master;!n||!t||this.ready||n.state!=="running"||(t.gain.setValueAtTime(0,n.currentTime),t.gain.linearRampToValueAtTime(.85,n.currentTime+2.4),this.ready=!0)}setBinaural(n){var t;this.binaural=n,(t=this.node)==null||t.port.postMessage({type:"binaural",value:n})}beginFrame(){this.budget=10}play(n){if(!this.ready||!this.node||this.budget<=0)return!1;this.budget--;const t=n.strike,s=n.wall,o=yt(rt/Math.max(ht,n.relSize)),a=Math.min(1,n.relDv/lt),i=Math.hypot(n.dx,n.dy),r=Math.atan2(n.dx,-n.dy),h=Math.hypot(i,q*n.radius),c=h/n.radius,p=i/h,d=Math.max(0,-Math.cos(r))*p;return this.node.port.postMessage({type:"hit",f0:o,az:r,spatial:p,flight:c*H/ct,cutoff:Math.max(ft,2e4*Math.exp(-(ut*c+pt*d))),send:wt/n.presence*(1+.25*d),amp:(s?.11:.34)*a*n.presence,decay:(.5+32*n.relSize)*(s?.3:1)*(.85+.3*t.bowl.timbre)*(.7+.45*a),bright:s?-.4:-.12+a*.3,stretch:(s?.02:.004)+t.bowl.timbre*.01,contact:s?.012:.006}),!0}}const A=document.getElementById("stage"),Z=document.getElementById("veil"),G=document.getElementById("hud"),k=new at(A),u=new bt;function At(e){let n=e>>>0;return()=>{n=n+1831565813>>>0;let t=Math.imul(n^n>>>15,1|n);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const X=3,Mt=[162,198,144],Et=.8/3,xt=2/3,It=2.6,Ot=.21,N={x:-.644,y:-.271},St=.08;function _t(e,n){return Math.max(e,n)/(2*xt)}let g=[],v=0,b=0;const f={x:0,y:0},m={left:0,top:0,width:0,height:0};function j(e,n){const t=_t(e,n),s=It*t/Math.sqrt(3);return Array.from({length:X},(o,a)=>{const i=Ot+a*2*Math.PI/X;return{cx:Math.cos(i)*s,cy:Math.sin(i)*s,r:t}})}function Y(e){const n=e[0].r*(1+St),t=Math.min(...e.map(o=>o.cx-n)),s=Math.min(...e.map(o=>o.cy-n));m.left=t,m.top=s,m.width=Math.max(...e.map(o=>o.cx+n))-t,m.height=Math.max(...e.map(o=>o.cy+n))-s}function V(e,n,t,s){return t<=s?n+t/2:Math.min(Math.max(e,n+s/2),n+t-s/2)}function P(e,n){f.x=V(e,m.left,m.width,v),f.y=V(n,m.top,m.height,b)}function kt(){const e=j(v,b);Y(e);const n=At(20932);g=e.map((t,s)=>{const o=1.5+s*.35,a=.085+s*.01,i=a*Et,r=new it(t.cx,t.cy,t.r,{scale:o,drift:i*o,strength:i,jet:a,axis:(s%2===0?1:-1)*(.7+s*.9),width:.34,confine:.05,seed:17.3*(s+1)},n);return r.populate(Mt[s]),r}),P(N.x*e[0].r,N.y*e[0].r),k.invalidate()}function Rt(e){const n=j(v,b),t=n[0].r/g[0].radius,s=e.x*t,o=e.y*t;Y(n),g.forEach((a,i)=>{const r=n[i];a.cx=r.cx,a.cy=r.cy,a.radius=r.r;for(const h of a.bowls)h.x*=t,h.y*=t,h.r*=t,h.m*=t*t,h.vx*=t,h.vy*=t;a.ripples.length=0}),P(s,o),k.invalidate()}function $(){const e=Math.min(window.devicePixelRatio||1,2),n=document.documentElement.clientWidth,t=document.documentElement.clientHeight;if(n<=0||t<=0)return;const s=g.length?{x:f.x,y:f.y}:null;v=n,b=t,A.width=Math.round(v*e),A.height=Math.round(b*e),k.setDpr(e),s===null?kt():Rt(s)}const C=1/120,W=6,O=[];let S=0,B=performance.now(),D=60,L=0,T=0,_=!1;function K(e){requestAnimationFrame(K);let n=(e-B)/1e3;B=e,n>.25&&(n=.25),D+=(1/Math.max(n,1e-4)-D)*.05,S+=n;let t=0;for(;S>=C&&t<W;){for(const a of g)a.step(C);S-=C,t++}t===W&&(S=0),u.beginFrame();let s=0,o=0;O.length=0;for(const a of g){s+=a.contacts.length;for(const i of a.contacts){const r=i.x-f.x,h=i.y-f.y,c=dt(Math.hypot(r,h),a.radius),p=i.kind==="wall";for(const d of i.strikes)O.push({strike:d,wall:p,relSize:d.bowl.r/a.radius,relDv:d.dv/a.radius,dx:r,dy:h,radius:a.radius,presence:c})}a.contacts.length=0}O.sort((a,i)=>i.relDv*i.presence-a.relDv*a.presence);for(const a of O)u.play(a)&&o++;if(L+=(s/Math.max(n,1e-4)-L)*.03,T+=(o/Math.max(n,1e-4)-T)*.03,k.frame(v,b,g,f),_){const a=g.reduce((i,r)=>i+r.bowls.length,0);G.textContent=`${D.toFixed(0)} fps   ${a} bowls   ${L.toFixed(1)} contacts/s   ${T.toFixed(1)} voices/s   audio ${u.running?"on":"off"}   ${u.spatial?"binaural":"stereo"}`}}window.addEventListener("keydown",e=>{e.key==="h"?(_=!_,G.classList.toggle("on",_)):e.key==="b"&&u.setBinaural(!u.spatial)});let F=!1;function J(){u.running||u.start().catch(e=>console.warn("audio unavailable:",e))}function Ct(){F||(F=!0,Z.classList.add("gone"),u.open(),J())}Z.addEventListener("click",Ct);let l=null;function Q(e,n){P(f.x+e,f.y+n)}function tt(){l!==null&&A.hasPointerCapture(l.id)&&A.releasePointerCapture(l.id),l=null,document.body.classList.remove("dragging")}window.addEventListener("pointerdown",e=>{!e.isPrimary||e.button!==0||F&&(l={id:e.pointerId,x:e.clientX,y:e.clientY},A.setPointerCapture(e.pointerId),document.body.classList.add("dragging"),e.preventDefault())});window.addEventListener("pointermove",e=>{if(l===null||e.pointerId!==l.id)return;const n=e.clientX-l.x,t=e.clientY-l.y;l.x=e.clientX,l.y=e.clientY,Q(-n,-t),e.preventDefault()});window.addEventListener("pointerup",e=>{J(),!(l===null||e.pointerId!==l.id)&&tt()});window.addEventListener("pointercancel",e=>{l!==null&&e.pointerId===l.id&&tt()});const Dt=16;function U(e,n,t){return n===WheelEvent.DOM_DELTA_PAGE?e*t:n===WheelEvent.DOM_DELTA_LINE?e*Dt:e}window.addEventListener("wheel",e=>{Q(U(e.deltaX,e.deltaMode,v),U(e.deltaY,e.deltaMode,b)),e.preventDefault()},{passive:!1});window.addEventListener("resize",$);$();requestAnimationFrame(K);
