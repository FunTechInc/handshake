(function(n,s){typeof exports=="object"&&typeof module<"u"?s(exports):typeof define=="function"&&define.amd?define(["exports"],s):(n=typeof globalThis<"u"?globalThis:n||self,s(n.Handshake={}))})(this,function(n){"use strict";var c=Object.defineProperty;var u=(n,s,h)=>s in n?c(n,s,{enumerable:!0,configurable:!0,writable:!0,value:h}):n[s]=h;var i=(n,s,h)=>u(n,typeof s!="symbol"?s+"":s,h);const l=["handshake","handshake-reply","event"];function _(a,t){if(t==null||a.origin!==t||!a.data||typeof a.data!="object")return!1;const e=a.data;return!(!e.type||!l.includes(e.type))}class o{constructor(t={}){i(this,"_Promise");i(this,"_PromiseResolver");i(this,"_PromiseRejecter");i(this,"_handlers");i(this,"_targetWindow");i(this,"_targetOrigin");i(this,"emit",(t,e)=>this._sendMessage({type:"event",key:t,value:e}));i(this,"on",(t,e)=>{this._handlers[t]||(this._handlers[t]=[]),this._handlers[t].push(e)});this._Promise=new Promise((e,r)=>{this._PromiseResolver=e,this._PromiseRejecter=r}),this._handlers={},this._targetWindow=t.targetWindow,this._targetOrigin=t.targetOrigin,window.addEventListener("message",this._onMessage.bind(this))}_sendMessage(t){var e;this._targetOrigin!=null&&((e=this._targetWindow)==null||e.postMessage(t,this._targetOrigin))}_trigger(t,e){this._handlers[t]&&this._handlers[t].forEach(r=>r(e))}ready(t){this._Promise.then(t)}revert(){window.removeEventListener("message",this._onMessage.bind(this))}_handleOnMessage(t,e,r){if(!_(t,this._targetOrigin))return;const d=t.data;d.type===e?(r(),this._PromiseResolver(this)):d.type==="event"&&d.key!=null&&this._trigger(d.key,d.value)}}class f extends o{constructor(e){super();i(this,"container");i(this,"iframe");i(this,"_handshakeInterval");const r=document.getElementById(e.container);if(!r)throw new Error("Container element not found");this.container=r,this.iframe=document.createElement("iframe"),this.iframe.style.width="100%",this.iframe.style.height="100%",this.container.appendChild(this.iframe),this._targetOrigin=new URL(e.url,window.location.href).origin,this.iframe.addEventListener("load",()=>{this._targetWindow=this.iframe.contentWindow,this._startHandshake()}),this.iframe.src=e.url}ready(e){super.ready(e)}revert(){var e;super.revert(),(e=this.iframe.parentNode)==null||e.removeChild(this.iframe)}_startHandshake(){let e=0;const r=window.setInterval(()=>{e++,e>5?(clearInterval(r),this._PromiseRejecter(new Error("Handshake failed"))):this._sendMessage({type:"handshake"})},500);this._handshakeInterval=r}_onMessage(e){this._handleOnMessage(e,"handshake-reply",()=>clearInterval(this._handshakeInterval))}}class g extends o{constructor(){super({targetWindow:window.parent,targetOrigin:window.parent.location.origin})}_onMessage(t){this._handleOnMessage(t,"handshake",()=>this._sendMessage({type:"handshake-reply"}))}}n.Child=g,n.Parent=f,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=handshake.umd.cjs.map
