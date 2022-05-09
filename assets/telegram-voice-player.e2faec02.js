var $t=Object.defineProperty,mt=Object.defineProperties;var yt=Object.getOwnPropertyDescriptors;var F=Object.getOwnPropertySymbols;var _t=Object.prototype.hasOwnProperty,At=Object.prototype.propertyIsEnumerable;var J=(s,t,e)=>t in s?$t(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e,X=(s,t)=>{for(var e in t||(t={}))_t.call(t,e)&&J(s,e,t[e]);if(F)for(var e of F(t))At.call(t,e)&&J(s,e,t[e]);return s},Z=(s,t)=>mt(s,yt(t));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol(),G=new Map;class ut{constructor(t,e){if(this._$cssResult$=!0,e!==K)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){let t=G.get(this.cssText);return q&&t===void 0&&(G.set(this.cssText,t=new CSSStyleSheet),t.replaceSync(this.cssText)),t}toString(){return this.cssText}}const bt=s=>new ut(typeof s=="string"?s:s+"",K),wt=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((i,o,r)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[r+1],s[0]);return new ut(e,K)},Et=(s,t)=>{q?s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):t.forEach(e=>{const i=document.createElement("style"),o=window.litNonce;o!==void 0&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)})},Q=q?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return bt(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var L;const Y=window.trustedTypes,St=Y?Y.emptyScript:"",tt=window.reactiveElementPolyfillSupport,V={toAttribute(s,t){switch(t){case Boolean:s=s?St:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},pt=(s,t)=>t!==s&&(t==t||s==s),z={attribute:!0,type:String,converter:V,reflect:!1,hasChanged:pt};class w extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(t){var e;(e=this.l)!==null&&e!==void 0||(this.l=[]),this.l.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const o=this._$Eh(i,e);o!==void 0&&(this._$Eu.set(o,i),t.push(o))}),t}static createProperty(t,e=z){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,i,e);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(o){const r=this[t];this[e]=o,this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||z}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const e=this.properties,i=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const o of i)this.createProperty(o,e[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const o of i)e.unshift(Q(o))}else t!==void 0&&e.push(Q(t));return e}static _$Eh(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$Em(),this.requestUpdate(),(t=this.constructor.l)===null||t===void 0||t.forEach(e=>e(this))}addController(t){var e,i;((e=this._$Eg)!==null&&e!==void 0?e:this._$Eg=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)===null||i===void 0||i.call(t))}removeController(t){var e;(e=this._$Eg)===null||e===void 0||e.splice(this._$Eg.indexOf(t)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Et.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Et(e,this.constructor.elementStyles),e}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$Eg)===null||t===void 0||t.forEach(e=>{var i;return(i=e.hostConnected)===null||i===void 0?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$Eg)===null||t===void 0||t.forEach(e=>{var i;return(i=e.hostDisconnected)===null||i===void 0?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ES(t,e,i=z){var o,r;const n=this.constructor._$Eh(t,i);if(n!==void 0&&i.reflect===!0){const h=((r=(o=i.converter)===null||o===void 0?void 0:o.toAttribute)!==null&&r!==void 0?r:V.toAttribute)(e,i.type);this._$Ei=t,h==null?this.removeAttribute(n):this.setAttribute(n,h),this._$Ei=null}}_$AK(t,e){var i,o,r;const n=this.constructor,h=n._$Eu.get(t);if(h!==void 0&&this._$Ei!==h){const a=n.getPropertyOptions(h),l=a.converter,v=(r=(o=(i=l)===null||i===void 0?void 0:i.fromAttribute)!==null&&o!==void 0?o:typeof l=="function"?l:null)!==null&&r!==void 0?r:V.fromAttribute;this._$Ei=h,this[h]=v(e,a.type),this._$Ei=null}}requestUpdate(t,e,i){let o=!0;t!==void 0&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||pt)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Ei!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,i))):o=!1),!this.isUpdatePending&&o&&(this._$Ep=this._$E_())}async _$E_(){this.isUpdatePending=!0;try{await this._$Ep}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach((o,r)=>this[r]=o),this._$Et=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$Eg)===null||t===void 0||t.forEach(o=>{var r;return(r=o.hostUpdate)===null||r===void 0?void 0:r.call(o)}),this.update(i)):this._$EU()}catch(o){throw e=!1,this._$EU(),o}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$Eg)===null||e===void 0||e.forEach(i=>{var o;return(o=i.hostUpdated)===null||o===void 0?void 0:o.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((e,i)=>this._$ES(i,this[i],e)),this._$EC=void 0),this._$EU()}updated(t){}firstUpdated(t){}}w.finalized=!0,w.elementProperties=new Map,w.elementStyles=[],w.shadowRootOptions={mode:"open"},tt==null||tt({ReactiveElement:w}),((L=globalThis.reactiveElementVersions)!==null&&L!==void 0?L:globalThis.reactiveElementVersions=[]).push("1.3.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var D;const S=globalThis.trustedTypes,et=S?S.createPolicy("lit-html",{createHTML:s=>s}):void 0,A=`lit$${(Math.random()+"").slice(9)}$`,ft="?"+A,Ct=`<${ft}>`,C=document,R=(s="")=>C.createComment(s),U=s=>s===null||typeof s!="object"&&typeof s!="function",vt=Array.isArray,xt=s=>{var t;return vt(s)||typeof((t=s)===null||t===void 0?void 0:t[Symbol.iterator])=="function"},T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,it=/-->/g,st=/>/g,b=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,ot=/'/g,rt=/"/g,gt=/^(?:script|style|textarea|title)$/i,Pt=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),O=Pt(1),x=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),nt=new WeakMap,Tt=(s,t,e)=>{var i,o;const r=(i=e==null?void 0:e.renderBefore)!==null&&i!==void 0?i:t;let n=r._$litPart$;if(n===void 0){const h=(o=e==null?void 0:e.renderBefore)!==null&&o!==void 0?o:null;r._$litPart$=n=new M(t.insertBefore(R(),h),h,void 0,e!=null?e:{})}return n._$AI(s),n},E=C.createTreeWalker(C,129,null,!1),kt=(s,t)=>{const e=s.length-1,i=[];let o,r=t===2?"<svg>":"",n=T;for(let a=0;a<e;a++){const l=s[a];let v,d,c=-1,p=0;for(;p<l.length&&(n.lastIndex=p,d=n.exec(l),d!==null);)p=n.lastIndex,n===T?d[1]==="!--"?n=it:d[1]!==void 0?n=st:d[2]!==void 0?(gt.test(d[2])&&(o=RegExp("</"+d[2],"g")),n=b):d[3]!==void 0&&(n=b):n===b?d[0]===">"?(n=o!=null?o:T,c=-1):d[1]===void 0?c=-2:(c=n.lastIndex-d[2].length,v=d[1],n=d[3]===void 0?b:d[3]==='"'?rt:ot):n===rt||n===ot?n=b:n===it||n===st?n=T:(n=b,o=void 0);const _=n===b&&s[a+1].startsWith("/>")?" ":"";r+=n===T?l+Ct:c>=0?(i.push(v),l.slice(0,c)+"$lit$"+l.slice(c)+A+_):l+A+(c===-2?(i.push(void 0),a):_)}const h=r+(s[e]||"<?>")+(t===2?"</svg>":"");if(!Array.isArray(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return[et!==void 0?et.createHTML(h):h,i]};class H{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let r=0,n=0;const h=t.length-1,a=this.parts,[l,v]=kt(t,e);if(this.el=H.createElement(l,i),E.currentNode=this.el.content,e===2){const d=this.el.content,c=d.firstChild;c.remove(),d.append(...c.childNodes)}for(;(o=E.nextNode())!==null&&a.length<h;){if(o.nodeType===1){if(o.hasAttributes()){const d=[];for(const c of o.getAttributeNames())if(c.endsWith("$lit$")||c.startsWith(A)){const p=v[n++];if(d.push(c),p!==void 0){const _=o.getAttribute(p.toLowerCase()+"$lit$").split(A),g=/([.?@])?(.*)/.exec(p);a.push({type:1,index:r,name:g[2],strings:_,ctor:g[1]==="."?Ut:g[1]==="?"?Mt:g[1]==="@"?Nt:B})}else a.push({type:6,index:r})}for(const c of d)o.removeAttribute(c)}if(gt.test(o.tagName)){const d=o.textContent.split(A),c=d.length-1;if(c>0){o.textContent=S?S.emptyScript:"";for(let p=0;p<c;p++)o.append(d[p],R()),E.nextNode(),a.push({type:2,index:++r});o.append(d[c],R())}}}else if(o.nodeType===8)if(o.data===ft)a.push({type:2,index:r});else{let d=-1;for(;(d=o.data.indexOf(A,d+1))!==-1;)a.push({type:7,index:r}),d+=A.length-1}r++}}static createElement(t,e){const i=C.createElement("template");return i.innerHTML=t,i}}function P(s,t,e=s,i){var o,r,n,h;if(t===x)return t;let a=i!==void 0?(o=e._$Cl)===null||o===void 0?void 0:o[i]:e._$Cu;const l=U(t)?void 0:t._$litDirective$;return(a==null?void 0:a.constructor)!==l&&((r=a==null?void 0:a._$AO)===null||r===void 0||r.call(a,!1),l===void 0?a=void 0:(a=new l(s),a._$AT(s,e,i)),i!==void 0?((n=(h=e)._$Cl)!==null&&n!==void 0?n:h._$Cl=[])[i]=a:e._$Cu=a),a!==void 0&&(t=P(s,a._$AS(s,t.values),a,i)),t}class Rt{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;const{el:{content:i},parts:o}=this._$AD,r=((e=t==null?void 0:t.creationScope)!==null&&e!==void 0?e:C).importNode(i,!0);E.currentNode=r;let n=E.nextNode(),h=0,a=0,l=o[0];for(;l!==void 0;){if(h===l.index){let v;l.type===2?v=new M(n,n.nextSibling,this,t):l.type===1?v=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(v=new Ot(n,this,t)),this.v.push(v),l=o[++a]}h!==(l==null?void 0:l.index)&&(n=E.nextNode(),h++)}return r}m(t){let e=0;for(const i of this.v)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class M{constructor(t,e,i,o){var r;this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cg=(r=o==null?void 0:o.isConnected)===null||r===void 0||r}get _$AU(){var t,e;return(e=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&e!==void 0?e:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=P(this,t,e),U(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==x&&this.$(t):t._$litType$!==void 0?this.T(t):t.nodeType!==void 0?this.k(t):xt(t)?this.S(t):this.$(t)}A(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.A(t))}$(t){this._$AH!==u&&U(this._$AH)?this._$AA.nextSibling.data=t:this.k(C.createTextNode(t)),this._$AH=t}T(t){var e;const{values:i,_$litType$:o}=t,r=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=H.createElement(o.h,this.options)),o);if(((e=this._$AH)===null||e===void 0?void 0:e._$AD)===r)this._$AH.m(i);else{const n=new Rt(r,this),h=n.p(this.options);n.m(i),this.k(h),this._$AH=n}}_$AC(t){let e=nt.get(t.strings);return e===void 0&&nt.set(t.strings,e=new H(t)),e}S(t){vt(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const r of t)o===e.length?e.push(i=new M(this.A(R()),this.A(R()),this,this.options)):i=e[o],i._$AI(r),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)===null||i===void 0||i.call(this,!1,!0,e);t&&t!==this._$AB;){const o=t.nextSibling;t.remove(),t=o}}setConnected(t){var e;this._$AM===void 0&&(this._$Cg=t,(e=this._$AP)===null||e===void 0||e.call(this,t))}}class B{constructor(t,e,i,o,r){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=u}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,o){const r=this.strings;let n=!1;if(r===void 0)t=P(this,t,e,0),n=!U(t)||t!==this._$AH&&t!==x,n&&(this._$AH=t);else{const h=t;let a,l;for(t=r[0],a=0;a<r.length-1;a++)l=P(this,h[i+a],e,a),l===x&&(l=this._$AH[a]),n||(n=!U(l)||l!==this._$AH[a]),l===u?t=u:t!==u&&(t+=(l!=null?l:"")+r[a+1]),this._$AH[a]=l}n&&!o&&this.C(t)}C(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}}class Ut extends B{constructor(){super(...arguments),this.type=3}C(t){this.element[this.name]=t===u?void 0:t}}const Ht=S?S.emptyScript:"";class Mt extends B{constructor(){super(...arguments),this.type=4}C(t){t&&t!==u?this.element.setAttribute(this.name,Ht):this.element.removeAttribute(this.name)}}class Nt extends B{constructor(t,e,i,o,r){super(t,e,i,o,r),this.type=5}_$AI(t,e=this){var i;if((t=(i=P(this,t,e,0))!==null&&i!==void 0?i:u)===x)return;const o=this._$AH,r=t===u&&o!==u||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,n=t!==u&&(o===u||r);r&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;typeof this._$AH=="function"?this._$AH.call((i=(e=this.options)===null||e===void 0?void 0:e.host)!==null&&i!==void 0?i:this.element,t):this._$AH.handleEvent(t)}}class Ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}}const at=window.litHtmlPolyfillSupport;at==null||at(H,M),((D=globalThis.litHtmlVersions)!==null&&D!==void 0?D:globalThis.litHtmlVersions=[]).push("2.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var I,j;class k extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return(t=(e=this.renderOptions).renderBefore)!==null&&t!==void 0||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=Tt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Dt)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Dt)===null||t===void 0||t.setConnected(!1)}render(){return x}}k.finalized=!0,k._$litElement$=!0,(I=globalThis.litElementHydrateSupport)===null||I===void 0||I.call(globalThis,{LitElement:k});const lt=globalThis.litElementPolyfillSupport;lt==null||lt({LitElement:k});((j=globalThis.litElementVersions)!==null&&j!==void 0?j:globalThis.litElementVersions=[]).push("3.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Bt=s=>t=>typeof t=="function"?((e,i)=>(window.customElements.define(e,i),i))(s,t):((e,i)=>{const{kind:o,elements:r}=i;return{kind:o,elements:r,finisher(n){window.customElements.define(e,n)}}})(s,t);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lt=(s,t)=>t.kind==="method"&&t.descriptor&&!("value"in t.descriptor)?Z(X({},t),{finisher(e){e.createProperty(t.key,s)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){typeof t.initializer=="function"&&(this[t.key]=t.initializer.call(this))},finisher(e){e.createProperty(t.key,s)}};function m(s){return(t,e)=>e!==void 0?((i,o,r)=>{o.constructor.createProperty(r,i)})(s,t,e):Lt(s,t)}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var W;((W=window.HTMLSlotElement)===null||W===void 0?void 0:W.prototype.assignedElements)!=null;function ht(s){const t=Math.floor(s/60),e=Math.floor(s-t*60);return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`}function zt(s,t){const e=s.getChannelData(0),i=Math.floor(e.length/t),o=[];for(let r=0;r<t;r++){let n=0;const h=i<16?i:16;for(let a=0;a<h;a++){const l=Math.floor(Math.random()*i)+r*i;n+=Math.abs(e[l])}o.push(n/h)}return o}function Dt(s){const t=Math.pow(Math.max(...s),-1);return s.map(e=>e*t)}function N(s,t,e=""){const i=s.getRootNode()instanceof ShadowRoot?s.firstElementChild:s;return window.getComputedStyle(i).getPropertyValue(`--${t}`)||e}function dt(s){const t=window.devicePixelRatio||1;s.width=s.offsetWidth*t,s.height=s.offsetHeight*t,s.getContext("2d").scale(t,t)}async function ct(s,t,e,i,{async:o=!0,mirror:r=!1,lineCap:n="round",minHeight:h=0}={}){const a=t.length;let l=s.offsetWidth/a;const v=l*e,d=l-v;l+=v/a;const c=s.getContext("2d");c.save(),c.translate(0,r?s.offsetHeight/2:s.offsetHeight-d);for(let p=0;p<a;p++){const _=l*p,g=r?s.offsetHeight/2:s.offsetHeight-d;let y=t[p]*s.offsetHeight;r&&(y/=2),y<h*g?y=h*g:y+d>g?y=g-d:y>g&&(y=g),o&&await It(),c.globalCompositeOperation="source-over",c.clearRect(_,g*-1,l,r?g*2:g+d),c.strokeStyle=i,c.lineWidth=d,c.lineCap=n,c.beginPath(),c.moveTo(_+d/2,y*-1),c.lineTo(_+d/2,r?y:0),c.stroke(),c.closePath()}c.restore()}function It(){return new Promise(s=>{requestAnimationFrame(()=>{s(!0)})})}var jt=O`
  <svg viewBox="0 0 384 512" class="play-icon">
    <path
      fill="currentColor"
      d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"
    />
  </svg>
`,Wt=O`
  <svg viewBox="0 0 320 512" class="pause-icon">
    <path
      fill="currentColor"
      d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"
    />
  </svg>
`,Vt=O`
  <svg viewBox="25 25 50 50" class="loading-icon">
    <circle stroke="currentColor" cx="50" cy="50" r="20" fill="none" stroke-miterlimit="10" stroke-width="4"></circle>
  </svg>
`,qt=Object.defineProperty,Kt=Object.getOwnPropertyDescriptor,$=(s,t,e,i)=>{for(var o=i>1?void 0:i?Kt(t,e):t,r=s.length-1,n;r>=0;r--)(n=s[r])&&(o=(i?n(t,e,o):n(o))||o);return i&&o&&qt(t,e,o),o};let f=class extends k{constructor(){super(...arguments);this.src="",this.bars=64,this.mirroredBars=!0,this.initiated=!1,this.isPlaying=!1,this.totalTime=234,this.currentTime=0,this.isPending=!0,this.hasLoaded=!1,this.hasError=!1,this.audio=new Audio}render(){return O`
      <div id="container">
        <button id="play" @click=${this._playOrPause} ?disabled=${!this.hasLoaded}>
          ${this.isPending?Vt:this.isPlaying?Wt:jt}
        </button>
        <div id="details">
          <canvas id="canvas" class=${this.mirroredBars?"mirrored":""}></canvas>
          <div id="info">
            <span class="current">${this.hasLoaded?ht(this.currentTime):"--:--"}</span>
            <span class="total">${this.hasLoaded?ht(this.totalTime):"--:--"}</span>
          </div>
        </div>
      </div>
    `}connectedCallback(){super.connectedCallback()}firstUpdated(){const s=this.renderRoot.querySelector("canvas"),t=new Array(this.bars).fill(0),e=N(this.renderRoot,"sound-bar-color");this.initiated||dt(s),ct(s,t,2/9,e,{async:!1,mirror:this.mirroredBars}),this._loadAudio()}updated(s){if(!!this.initiated){if(s.has("bars")||s.has("mirroredBars")){const t=this._processAudio(this.audioBuffer);if(s.has("mirroredBars")){const e=this.renderRoot.querySelector("canvas");dt(e)}this._drawAudioBars(t)}s.has("src")&&this._loadAudio()}}_loadAudio(){window.AudioContext=window.AudioContext||window.webkitAudioContext;const s=new AudioContext;fetch(this.src).then(t=>t.arrayBuffer()).then(t=>s.decodeAudioData(t)).then(t=>this._processAudio(t)).then(t=>(this._setupAudio(),this._drawAudioBars(t))).then(()=>this._setupProgressEvents()).then(()=>this.initiated=!0)}_processAudio(s){this.audioBuffer=s;const t=zt(s,this.bars);return Dt(t)}async _drawAudioBars(s){const t=this.renderRoot.querySelector("canvas"),e=N(this.renderRoot,"sound-bar-color");await ct(t,s,2/9,e,{async:!1,mirror:this.mirroredBars})}_setupProgressEvents(){if(this.initiated)return;const s=this.renderRoot.querySelector("canvas");let t=!1;const e=i=>{this.audio.currentTime=i*this.totalTime*.01};window.addEventListener("mouseup",()=>{t=!1}),s.addEventListener("mousedown",i=>{t=!0,e(i.offsetX/s.offsetWidth*100)}),window.addEventListener("mousemove",i=>{if(!t)return;const o=s.getBoundingClientRect(),r=o.left,n=o.left+o.width,h=i.clientX;let a=0;h<r?a=0:h>n?a=100:a=(h-r)/(n-r)*100,e(a)},{passive:!0})}_drawAudioProgress(s){const t=this.renderRoot.querySelector("canvas"),e=t.getContext("2d"),i=t.offsetWidth,o=t.offsetHeight;e.globalCompositeOperation="source-atop",e.fillStyle=N(this.renderRoot,"sound-bar-color"),e.fillRect(0,0,i,o),e.fillStyle=N(this.renderRoot,"sound-progress-color"),e.fillRect(0,0,i*s/100,o)}_setupAudio(){this.audio=new Audio,this.audio.autoplay=!1,this.audio.src=this.src,this.audio.loop=!1,this.audio.addEventListener("timeupdate",()=>{this.currentTime=this.audio.currentTime,this._drawAudioProgress(this.audio.currentTime/this.audio.duration*100)}),this.audio.addEventListener("loadedmetadata",()=>{this.totalTime=this.audio.duration,this.currentTime=0}),this.audio.addEventListener("loadeddata",()=>{this.audio.readyState>=2&&(this.isPending=!1,this.hasLoaded=!0,this.hasError=!1)}),this.audio.addEventListener("ended",()=>{this.isPlaying&&(this.audio.currentTime=0,this.isPlaying=!1)}),this.audio.addEventListener("error",()=>{this.hasLoaded=!1,this.isPending=!1,this.hasError=!0})}_playOrPause(){this.audio.readyState>=2&&(this.isPlaying=!this.isPlaying,this.isPlaying?this.audio.play():this.audio.pause())}};f.styles=wt`
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
  `;$([m({type:String})],f.prototype,"src",2);$([m({type:Number,reflect:!0})],f.prototype,"bars",2);$([m({type:Boolean,reflect:!0})],f.prototype,"mirroredBars",2);$([m({type:Boolean,attribute:!1})],f.prototype,"initiated",2);$([m({type:Boolean,attribute:!1})],f.prototype,"isPlaying",2);$([m({type:Number,attribute:!1})],f.prototype,"totalTime",2);$([m({type:Number,attribute:!1})],f.prototype,"currentTime",2);$([m({type:Boolean,attribute:!1})],f.prototype,"isPending",2);$([m({type:Boolean,attribute:!1})],f.prototype,"hasLoaded",2);$([m({type:Boolean,attribute:!1})],f.prototype,"hasError",2);$([m({attribute:!1})],f.prototype,"audio",2);$([m({attribute:!1})],f.prototype,"audioBuffer",2);f=$([Bt("telegram-voice-player")],f);export{f as TelegramVoicePlayer};
