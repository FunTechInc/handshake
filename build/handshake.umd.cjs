(function(i,s){typeof exports=="object"&&typeof module<"u"?s(exports):typeof define=="function"&&define.amd?define(["exports"],s):(i=typeof globalThis<"u"?globalThis:i||self,s(i.Handshake={}))})(this,function(i){"use strict";var c=Object.defineProperty;var u=(i,s,h)=>s in i?c(i,s,{enumerable:!0,configurable:!0,writable:!0,value:h}):i[s]=h;var r=(i,s,h)=>u(i,typeof s!="symbol"?s+"":s,h);const l=["handshake","handshake-reply","event"];function _(a,t){if(t==null||a.origin!==t||!a.data||typeof a.data!="object")return!1;const e=a.data;return!(!e.type||!l.includes(e.type))}class o{constructor(t={}){r(this,"_Promise");r(this,"_PromiseResolver");r(this,"_PromiseRejecter");r(this,"_handlers");r(this,"_targetWindow");r(this,"_targetOrigin");this._Promise=new Promise((e,n)=>{this._PromiseResolver=e,this._PromiseRejecter=n}),this._handlers={},this._targetWindow=t.targetWindow,this._targetOrigin=t.targetOrigin,window.addEventListener("message",this._onMessage.bind(this))}_sendMessage(t){var e;this._targetOrigin!=null&&((e=this._targetWindow)==null||e.postMessage(t,this._targetOrigin))}_trigger(t,e){this._handlers[t]&&this._handlers[t].forEach(n=>n(e))}ready(t){this._Promise.then(e=>{t({...e,emit:this.emit.bind(this),on:this.on.bind(this),revert:this.revert.bind(this)})})}emit(t,e){this._sendMessage({type:"event",key:t,value:e})}on(t,e){this._handlers[t]||(this._handlers[t]=[]),this._handlers[t].push(e)}revert(){window.removeEventListener("message",this._onMessage.bind(this))}_handleOnMessage(t,e,n){if(!_(t,this._targetOrigin))return;const d=t.data;d.type===e?(n(),this._PromiseResolver(this)):d.type==="event"&&d.key!=null&&this._trigger(d.key,d.value)}}class f extends o{constructor(e){super();r(this,"container");r(this,"iframe");r(this,"_handshakeInterval");const n=document.getElementById(e.container);if(!n)throw new Error("Container element not found");this.container=n,this.iframe=document.createElement("iframe"),this.iframe.style.width="100%",this.iframe.style.height="100%",this.container.appendChild(this.iframe),this._targetOrigin=new URL(e.url,window.location.href).origin,this.iframe.addEventListener("load",()=>{this._targetWindow=this.iframe.contentWindow,this._startHandshake()}),this.iframe.src=e.url}revert(){var e;super.revert(),(e=this.iframe.parentNode)==null||e.removeChild(this.iframe)}ready(e){super.ready(e)}_startHandshake(){let e=0;const n=window.setInterval(()=>{e++,e>5?(clearInterval(n),this._PromiseRejecter(new Error("Handshake failed"))):this._sendMessage({type:"handshake"})},500);this._handshakeInterval=n}_onMessage(e){this._handleOnMessage(e,"handshake-reply",()=>clearInterval(this._handshakeInterval))}}class g extends o{constructor(){super({targetWindow:window.parent,targetOrigin:window.parent.location.origin})}_onMessage(t){this._handleOnMessage(t,"handshake",()=>this._sendMessage({type:"handshake-reply"}))}}i.Child=g,i.Parent=f,Object.defineProperty(i,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=handshake.umd.cjs.map
