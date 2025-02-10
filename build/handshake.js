var h = Object.defineProperty;
var d = (s, e, t) => e in s ? h(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var n = (s, e, t) => d(s, typeof e != "symbol" ? e + "" : e, t);
const o = [
  "handshake",
  "handshake-reply",
  "event"
];
function l(s, e) {
  if (e == null || s.origin !== e || !s.data || typeof s.data != "object") return !1;
  const t = s.data;
  return !(!t.type || !o.includes(t.type));
}
class a {
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
    if (!l(e, this._targetOrigin)) return;
    const r = e.data;
    r.type === t ? (i(), this._PromiseResolver(this)) : r.type === "event" && r.key != null && this._trigger(r.key, r.value);
  }
}
class g extends a {
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
class c extends a {
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
export {
  c as Child,
  g as Parent
};
//# sourceMappingURL=handshake.js.map
