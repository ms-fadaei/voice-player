import{s as y,$ as g,l as b,p as v,a as w,g as h,b as f,d as p,f as x,n as P,r as _,e as n,c as A}from"./loading-spinner.2efbfc08.js";function m(e){const t=Math.floor(e/60),i=Math.floor(e-t*60);return`${String(t).padStart(2,"0")}:${String(i).padStart(2,"0")}`}var B=Object.defineProperty,S=Object.getOwnPropertyDescriptor,o=(e,t,i,s)=>{for(var a=s>1?void 0:s?S(t,i):t,d=e.length-1,l;d>=0;d--)(l=e[d])&&(a=(s?l(t,i,a):l(a))||a);return s&&a&&B(t,i,a),a};let r=class extends y{constructor(){super(...arguments);this.src="",this.bars=64,this.mirroredBars=!0,this.initiated=!1,this.isPlaying=!1,this.totalTime=234,this.currentTime=0,this.isPending=!0,this.hasLoaded=!1,this.hasError=!1,this.audio=new Audio}render(){return g`
      <div id="container">
        <button id="play" @click=${this._playOrPause} ?disabled=${!this.hasLoaded}>
          ${this.isPending?b:this.isPlaying?v:w}
        </button>
        <div id="details">
          <canvas id="canvas" class=${this.mirroredBars?"mirrored":""}></canvas>
          <div id="info">
            <span class="current">${this.hasLoaded?m(this.currentTime):"--:--"}</span>
            <span class="total">${this.hasLoaded?m(this.totalTime):"--:--"}</span>
          </div>
        </div>
      </div>
    `}connectedCallback(){super.connectedCallback()}firstUpdated(){const e=this.renderRoot.querySelector("canvas"),t=new Array(this.bars).fill(0),i=h(this.renderRoot,"sound-bar-color");this.initiated||f(e),p(e,t,2/9,i,{async:!1,mirror:this.mirroredBars}),this._loadAudio()}updated(e){if(!!this.initiated){if(e.has("bars")||e.has("mirroredBars")){const t=this._processAudio(this.audioBuffer);if(e.has("mirroredBars")){const i=this.renderRoot.querySelector("canvas");f(i)}this._drawAudioBars(t)}e.has("src")&&this._loadAudio()}}_loadAudio(){window.AudioContext=window.AudioContext||window.webkitAudioContext;const e=new AudioContext;fetch(this.src).then(t=>t.arrayBuffer()).then(t=>e.decodeAudioData(t)).then(t=>this._processAudio(t)).then(t=>(this._setupAudio(),this._drawAudioBars(t))).then(()=>this._setupProgressEvents()).then(()=>this.initiated=!0)}_processAudio(e){this.audioBuffer=e;const t=x(e,this.bars);return P(t)}async _drawAudioBars(e){const t=this.renderRoot.querySelector("canvas"),i=h(this.renderRoot,"sound-bar-color");await p(t,e,2/9,i,{async:!1,mirror:this.mirroredBars})}_setupProgressEvents(){if(this.initiated)return;const e=this.renderRoot.querySelector("canvas");let t=!1;const i=s=>{this.audio.currentTime=s*this.totalTime*.01};window.addEventListener("mouseup",()=>{t=!1}),e.addEventListener("mousedown",s=>{t=!0,i(s.offsetX/e.offsetWidth*100)}),window.addEventListener("mousemove",s=>{if(!t)return;const a=e.getBoundingClientRect(),d=a.left,l=a.left+a.width,c=s.clientX;let u=0;c<d?u=0:c>l?u=100:u=(c-d)/(l-d)*100,i(u)},{passive:!0})}_drawAudioProgress(e){const t=this.renderRoot.querySelector("canvas"),i=t.getContext("2d"),s=t.offsetWidth,a=t.offsetHeight;i.globalCompositeOperation="source-atop",i.fillStyle=h(this.renderRoot,"sound-bar-color"),i.fillRect(0,0,s,a),i.fillStyle=h(this.renderRoot,"sound-progress-color"),i.fillRect(0,0,s*e/100,a)}_setupAudio(){this.audio=new Audio,this.audio.autoplay=!1,this.audio.src=this.src,this.audio.loop=!1,this.audio.addEventListener("timeupdate",()=>{this.currentTime=this.audio.currentTime,this._drawAudioProgress(this.audio.currentTime/this.audio.duration*100)}),this.audio.addEventListener("loadedmetadata",()=>{this.totalTime=this.audio.duration,this.currentTime=0}),this.audio.addEventListener("loadeddata",()=>{this.audio.readyState>=2&&(this.isPending=!1,this.hasLoaded=!0,this.hasError=!1)}),this.audio.addEventListener("ended",()=>{this.isPlaying&&(this.audio.currentTime=0,this.isPlaying=!1)}),this.audio.addEventListener("error",()=>{this.hasLoaded=!1,this.isPending=!1,this.hasError=!0})}_playOrPause(){this.audio.readyState>=2&&(this.isPlaying=!this.isPlaying,this.isPlaying?this.audio.play():this.audio.pause())}};r.styles=_`
    :host {
      display: inline-block;
      font-family: sans-serif;
      direction: ltr;
      font-size: 16px;
      width: 300px;

      --container-border-radius: 0.875em;
      --container-background: #1566a3;
      --play-btn-background: #fff;
      --play-btn-color: #1566a3;
      --text-color: #b7d9f3;
      --sound-bar-color: #b7d9f3;
      --sound-progress-color: #fff;
    }

    * {
      box-sizing: border-box;
      user-select: none;
    }

    #container {
      height: 4em;
      background: var(--container-background);
      border-radius: var(--container-border-radius);
      padding: 0.5em 0.625em;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
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
      margin-right: 1em;
      border: none;
      cursor: pointer;
      color: var(--play-btn-color);
      padding: 0;
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

    #details {
      flex: 1 1 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      height: 100%;
    }

    #canvas {
      flex: 1 1 auto;
      height: 0;
      width: 100%;
      cursor: pointer;
      margin: 0.2em 0;
    }

    #canvas.mirrored {
      margin: 0;
    }

    #info {
      margin-top: 0.33em;
      flex: 0 0 auto;
      width: 100%;
      align-items: flex-end;
      font-size: 0.7em;
      line-height: 1.25em;
      color: var(--text-color);
      display: flex;
      justify-content: space-between;
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
  `;o([n({type:String})],r.prototype,"src",2);o([n({type:Number,reflect:!0})],r.prototype,"bars",2);o([n({type:Boolean,reflect:!0})],r.prototype,"mirroredBars",2);o([n({type:Boolean,attribute:!1})],r.prototype,"initiated",2);o([n({type:Boolean,attribute:!1})],r.prototype,"isPlaying",2);o([n({type:Number,attribute:!1})],r.prototype,"totalTime",2);o([n({type:Number,attribute:!1})],r.prototype,"currentTime",2);o([n({type:Boolean,attribute:!1})],r.prototype,"isPending",2);o([n({type:Boolean,attribute:!1})],r.prototype,"hasLoaded",2);o([n({type:Boolean,attribute:!1})],r.prototype,"hasError",2);o([n({attribute:!1})],r.prototype,"audio",2);o([n({attribute:!1})],r.prototype,"audioBuffer",2);r=o([A("telegram-voice-player")],r);export{r as TelegramVoicePlayer};
