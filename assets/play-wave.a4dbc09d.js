import{s as p,$ as f,l as y,p as b,a as v,b as g,g as h,r as m,e as o,n as w,h as R,i as C,c as x}from"./loading-spinner.2efbfc08.js";var A=Object.defineProperty,P=Object.getOwnPropertyDescriptor,a=(r,e,n,s)=>{for(var i=s>1?void 0:s?P(e,n):e,d=r.length-1,l;d>=0;d--)(l=r[d])&&(i=(s?l(e,n,i):l(i))||i);return s&&i&&A(e,n,i),i};let t=class extends p{constructor(){super(...arguments);this.src="",this.barCenterHoleRadiusRatio=.6,this.barMaxRadiusRatio=.9,this.barGapRatio=1/5,this.barMode="hole",this.initiated=!1,this.isPlaying=!1,this.isPending=!0,this.hasLoaded=!1,this.hasError=!1,this.audio=new Audio}render(){return f`
      <div id="container">
        <canvas id="canvas"></canvas>
        <button id="play" @click=${this._playOrPause} ?disabled=${!this.hasLoaded}>
          ${this.isPending?y:this.isPlaying?b:v}
        </button>
      </div>
    `}firstUpdated(){this._loadAudio()}updated(r){!this.initiated||r.has("src")&&this._loadAudio()}_loadAudio(){fetch(this.src).then(()=>this._setupAudio())}_setupAudio(){this.audio=new Audio;const r=this._setupAudioAnalyser();this.audio.src=this.src,this.audio.autoplay=!1,this.audio.loop=!1;let e=null;this.audio.addEventListener("loadeddata",()=>{this.audio.readyState>=2&&(this.isPending=!1,this.hasLoaded=!0,this.hasError=!1)}),this.audio.addEventListener("ended",()=>{this.isPlaying&&(this.isPlaying=!1)}),this.audio.addEventListener("error",()=>{this.hasLoaded=!1,this.isPending=!1,this.hasError=!0}),this.audio.addEventListener("play",()=>{const n=()=>{e&&(r(),e=requestAnimationFrame(n))};e=requestAnimationFrame(n)}),this.audio.addEventListener("pause",()=>{e&&cancelAnimationFrame(e)})}_setupAudioAnalyser(){window.AudioContext=window.AudioContext||window.webkitAudioContext;const r=new AudioContext,e=new AnalyserNode(r,{fftSize:512}),n=r.createMediaElementSource(this.audio);n.connect(e),n.connect(r.destination);const s=new Uint8Array(e.frequencyBinCount),i=this.renderRoot.querySelector("canvas");this.initiated||(g(i),this.initiated=!0);const d=h(this.renderRoot,"wave-bg-color"),l=h(this.renderRoot,"wave-border-color"),c=h(this.renderRoot,"wave-bar-color");return()=>{e.getByteFrequencyData(s);const u=w([...s]);u.splice(0,s.length/8*3),u.splice(s.length/-8*3,s.length/8*3),R(i,u,d,{centerHoleRadiusRatio:.5,maxRadiusRatio:1,clearCanvas:!0,strokeWidth:.5,strokeColor:l}),C(i,u,c,{centerHoleRadiusRatio:this.barCenterHoleRadiusRatio,maxRadiusRatio:this.barMaxRadiusRatio,clearCanvas:!1,lineCap:"round",mode:"destination-over",gapRatio:this.barGapRatio,drawMode:this.barMode})}}_playOrPause(){this.audio.readyState>=2&&(this.isPlaying=!this.isPlaying,this.isPlaying?this.audio.play():this.audio.pause())}};t.styles=m`
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
  `;a([o({type:String})],t.prototype,"src",2);a([o({type:Number,reflect:!0})],t.prototype,"barCenterHoleRadiusRatio",2);a([o({type:Number,reflect:!0})],t.prototype,"barMaxRadiusRatio",2);a([o({type:Number,reflect:!0})],t.prototype,"barGapRatio",2);a([o({type:String,reflect:!0})],t.prototype,"barMode",2);a([o({type:Boolean,attribute:!1})],t.prototype,"initiated",2);a([o({type:Boolean,attribute:!1})],t.prototype,"isPlaying",2);a([o({type:Boolean,attribute:!1})],t.prototype,"isPending",2);a([o({type:Boolean,attribute:!1})],t.prototype,"hasLoaded",2);a([o({type:Boolean,attribute:!1})],t.prototype,"hasError",2);a([o({attribute:!1})],t.prototype,"audio",2);t=a([x("play-wave")],t);export{t as PlayWave};
