var d = Object.defineProperty;
var o = (s, e, t) => e in s ? d(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var n = (s, e, t) => o(s, typeof e != "symbol" ? e + "" : e, t);
const l = [
  "handshake",
  "handshake-reply",
  "event"
];
function _(s, e) {
  if (e == null || s.origin !== e || !s.data || typeof s.data != "object") return !1;
  const t = s.data;
  return !(!t.type || !l.includes(t.type));
}
class r {
  constructor(e = {}) {
    n(this, "_Promise");
    n(this, "_PromiseResolver");
    n(this, "_PromiseRejecter");
    n(this, "_handlers");
    n(this, "_targetWindow");
    n(this, "_targetOrigin");
    n(this, "emit", (e, t) => this._sendMessage({ type: "event", key: e, value: t }));
    n(this, "on", (e, t) => {
      this._handlers[e] || (this._handlers[e] = []), this._handlers[e].push(t);
    });
    this._Promise = new Promise((t, i) => {
      this._PromiseResolver = t, this._PromiseRejecter = i;
    }), this._handlers = {}, this._targetWindow = e.targetWindow, this._targetOrigin = e.targetOrigin, window.addEventListener("message", this._onMessage.bind(this));
  }
  _sendMessage(e) {
    var t;
    this._targetOrigin != null && ((t = this._targetWindow) == null || t.postMessage(e, this._targetOrigin));
  }
  _trigger(e, t) {
    this._handlers[e] && this._handlers[e].forEach((i) => i(t));
  }
  ready(e) {
    this._Promise.then(e);
  }
  _handleOnMessage(e, t, i) {
    if (!_(e, this._targetOrigin)) return;
    const a = e.data;
    a.type === t ? (i(), this._PromiseResolver(this)) : a.type === "event" && a.key != null && this._trigger(a.key, a.value);
  }
}
class g extends r {
  constructor(t) {
    super();
    n(this, "container");
    n(this, "iframe");
    n(this, "_handshakeInterval");
    const i = document.getElementById(t.container);
    if (!i) throw new Error("Container element not found");
    this.container = i, this.iframe = document.createElement("iframe"), this.iframe.style.width = "100%", this.iframe.style.height = "100%", this.container.appendChild(this.iframe), this._targetOrigin = new URL(t.url, window.location.href).origin, this.iframe.addEventListener("load", () => {
      this._targetWindow = this.iframe.contentWindow, this._startHandshake();
    }), this.iframe.src = t.url;
  }
  ready(t) {
    super.ready(t);
  }
  _startHandshake() {
    let t = 0;
    const i = window.setInterval(() => {
      t++, t > 5 ? (clearInterval(i), this._PromiseRejecter(new Error("Handshake failed"))) : this._sendMessage({ type: "handshake" });
    }, 500);
    this._handshakeInterval = i;
  }
  _onMessage(t) {
    this._handleOnMessage(
      t,
      "handshake-reply",
      () => clearInterval(this._handshakeInterval)
    );
  }
}
class f extends r {
  constructor() {
    super({
      targetWindow: window.parent,
      targetOrigin: window.parent.location.origin
    });
  }
  _onMessage(e) {
    this._handleOnMessage(
      e,
      "handshake",
      () => this._sendMessage({ type: "handshake-reply" })
    );
  }
}
const h = {
  Parent: g,
  Child: f
};
typeof exports < "u" && (exports.Handshake = h);
typeof globalThis < "u" && (globalThis.Handshake = h);
export {
  h as Handshake
};
//# sourceMappingURL=handshake.js.map
