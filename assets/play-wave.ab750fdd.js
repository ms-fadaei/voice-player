import{s as p,$ as f,l as y,p as b,a as v,b as g,g as h,r as m,e as i,n as w,h as R,i as C,c as x}from"./loading-spinner.2efbfc08.js";var A=Object.defineProperty,P=Object.getOwnPropertyDescriptor,a=(o,t,n,r)=>{for(var s=r>1?void 0:r?P(t,n):t,d=o.length-1,l;d>=0;d--)(l=o[d])&&(s=(r?l(t,n,s):l(s))||s);return r&&s&&A(t,n,s),s};let e=class extends p{constructor(){super(...arguments);this.src="",this.barCenterHoleRadiusRatio=.6,this.barMaxRadiusRatio=.9,this.barGapRatio=1/5,this.barMode="hole",this.initiated=!1,this.isPlaying=!1,this.isPending=!0,this.hasLoaded=!1,this.hasError=!1,this.audio=new Audio,this.context=null}render(){return f`
      <div id="container">
        <canvas id="canvas"></canvas>
        <button id="play" @click=${this._playOrPause} ?disabled=${!this.hasLoaded}>
          ${this.isPending?y:this.isPlaying?b:v}
        </button>
      </div>
    `}firstUpdated(){this._loadAudio()}updated(o){!this.initiated||o.has("src")&&this._loadAudio()}_loadAudio(){fetch(this.src).then(()=>this._setupAudio())}_setupAudio(){this.audio=new Audio;const o=this._setupAudioAnalyser();this.audio.src=this.src,this.audio.autoplay=!1,this.audio.loop=!1;let t=null;this.audio.addEventListener("loadeddata",()=>{this.audio.readyState>=2&&(this.isPending=!1,this.hasLoaded=!0,this.hasError=!1)}),this.audio.addEventListener("ended",()=>{this.isPlaying&&(this.isPlaying=!1)}),this.audio.addEventListener("error",()=>{this.hasLoaded=!1,this.isPending=!1,this.hasError=!0}),this.audio.addEventListener("play",()=>{const n=()=>{t&&(o(),t=requestAnimationFrame(n))};t=requestAnimationFrame(n)}),this.audio.addEventListener("pause",()=>{t&&cancelAnimationFrame(t)})}_setupAudioAnalyser(){window.AudioContext=window.AudioContext||window.webkitAudioContext;const o=new AudioContext;this.context=o;const t=new AnalyserNode(o,{fftSize:512}),n=o.createMediaElementSource(this.audio);n.connect(t),n.connect(o.destination);const r=new Uint8Array(t.frequencyBinCount),s=this.renderRoot.querySelector("canvas");this.initiated||(g(s),this.initiated=!0);const d=h(this.renderRoot,"wave-bg-color"),l=h(this.renderRoot,"wave-border-color"),c=h(this.renderRoot,"wave-bar-color");return()=>{t.getByteFrequencyData(r);const u=w([...r]);u.splice(0,r.length/8*3),u.splice(r.length/-8*3,r.length/8*3),R(s,u,d,{centerHoleRadiusRatio:.5,maxRadiusRatio:1,clearCanvas:!0,strokeWidth:.5,strokeColor:l}),C(s,u,c,{centerHoleRadiusRatio:this.barCenterHoleRadiusRatio,maxRadiusRatio:this.barMaxRadiusRatio,clearCanvas:!1,lineCap:"round",mode:"destination-over",gapRatio:this.barGapRatio,drawMode:this.barMode})}}_playOrPause(){this.audio.readyState>=2&&(this.context!==null&&this.context.state==="suspended"&&this.context.resume(),this.isPlaying=!this.isPlaying,this.isPlaying?this.audio.play():this.audio.pause())}};e.styles=m`
    :host {
      display: inline-block;
      font-family: sans-serif;
      direction: ltr;
      font-size: 16px;
      /* width: 300px; */

      --play-btn-background: #fff;
      --play-btn-color: #1566a3;
      --wave-bg-color: #b7d9f3;
      --wave-border-color: #fff;
      --wave-bar-color: #fff;
    }

    * {
      box-sizing: border-box;
      user-select: none;
    }

    #container {
      position: relative;
    }

    #play {
      font-size: 1em;
      flex: 0 0 auto;
      width: 3em;
      height: 3em;
      background: var(--play-btn-background);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      color: var(--play-btn-color);
      padding: 0;
      position: relative;
      z-index: 1;
    }

    #play:disabled {
      cursor: default;
    }

    #play > svg {
      width: 1em;
      height: 1em;
    }

    #play > .play-icon {
      position: relative;
      right: -1px;
    }

    #play > .loading-icon {
      width: 2em;
      height: 2em;
      transition: all 0.3s ease 0s;
      transform-origin: center center;
      animation: rotate 1.5s linear infinite;
    }

    #play > .loading-icon > circle {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      animation: dash 1s ease-in-out infinite;
    }

    #canvas {
      position: absolute;
      z-index: 0;
      width: 6em;
      height: 6em;
      top: calc(50% - 3em);
      left: calc(50% - 3em);
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }

      50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
      }

      100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
      }
    }

    @keyframes rotate {
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
  `;a([i({type:String})],e.prototype,"src",2);a([i({type:Number,reflect:!0})],e.prototype,"barCenterHoleRadiusRatio",2);a([i({type:Number,reflect:!0})],e.prototype,"barMaxRadiusRatio",2);a([i({type:Number,reflect:!0})],e.prototype,"barGapRatio",2);a([i({type:String,reflect:!0})],e.prototype,"barMode",2);a([i({type:Boolean,attribute:!1})],e.prototype,"initiated",2);a([i({type:Boolean,attribute:!1})],e.prototype,"isPlaying",2);a([i({type:Boolean,attribute:!1})],e.prototype,"isPending",2);a([i({type:Boolean,attribute:!1})],e.prototype,"hasLoaded",2);a([i({type:Boolean,attribute:!1})],e.prototype,"hasError",2);a([i({attribute:!1})],e.prototype,"audio",2);a([i({attribute:!1})],e.prototype,"context",2);e=a([x("play-wave")],e);export{e as PlayWave};
