var h = Object.defineProperty;
var d = (s, t, e) => t in s ? h(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var n = (s, t, e) => d(s, typeof t != "symbol" ? t + "" : t, e);
const o = [
  "handshake",
  "handshake-reply",
  "event"
];
function _(s, t) {
  if (t == null || s.origin !== t || !s.data || typeof s.data != "object") return !1;
  const e = s.data;
  return !(!e.type || !o.includes(e.type));
}
class a {
  constructor(t = {}) {
    n(this, "_Promise");
    n(this, "_PromiseResolver");
    n(this, "_PromiseRejecter");
    n(this, "_handlers");
    n(this, "_targetWindow");
    n(this, "_targetOrigin");
    n(this, "_bindedOnMessage");
    this._Promise = new Promise((e, i) => {
      this._PromiseResolver = e, this._PromiseRejecter = i;
    }), this._handlers = {}, this._targetWindow = t.targetWindow, this._targetOrigin = t.targetOrigin, this._bindedOnMessage = this._onMessage.bind(this), window.addEventListener("message", this._bindedOnMessage);
  }
  _sendMessage(t) {
    var e;
    this._targetOrigin != null && ((e = this._targetWindow) == null || e.postMessage(t, this._targetOrigin));
  }
  _trigger(t, e) {
    this._handlers[t] && this._handlers[t].forEach((i) => i(e));
  }
  ready(t) {
    this._Promise.then((e) => {
      t({
        ...e,
        emit: this.emit.bind(this),
        on: this.on.bind(this),
        revert: this.revert.bind(this)
      });
    });
  }
  emit(t, e) {
    this._sendMessage({ type: "event", key: t, value: e });
  }
  on(t, e) {
    this._handlers[t] || (this._handlers[t] = []), this._handlers[t].push(e);
  }
  revert() {
    window.removeEventListener("message", this._bindedOnMessage);
  }
  _handleOnMessage(t, e, i) {
    if (!_(t, this._targetOrigin)) return;
    const r = t.data;
    r.type === e ? (i(), this._PromiseResolver(this)) : r.type === "event" && r.key != null && this._trigger(r.key, r.value);
  }
}
class g extends a {
  constructor(e) {
    super();
    n(this, "container");
    n(this, "iframe");
    n(this, "_handshakeInterval");
    const i = document.getElementById(e.container);
    if (!i) throw new Error("Container element not found");
    this.container = i, this.iframe = document.createElement("iframe"), this.iframe.style.width = "100%", this.iframe.style.height = "100%", this.iframe.style.position = "absolute", this.container.appendChild(this.iframe), this._targetOrigin = new URL(e.url).origin, this.iframe.addEventListener("load", () => {
      this._targetWindow = this.iframe.contentWindow, this._startHandshake();
    }), this.iframe.src = e.url;
  }
  revert() {
    var e;
    super.revert(), (e = this.iframe.parentNode) == null || e.removeChild(this.iframe);
  }
  ready(e) {
    super.ready(e);
  }
  _startHandshake() {
    let e = 0;
    const i = window.setInterval(() => {
      e++, e > 50 ? (clearInterval(i), this._PromiseRejecter(new Error("Handshake failed"))) : this._sendMessage({ type: "handshake" });
    }, 100);
    this._handshakeInterval = i;
  }
  _onMessage(e) {
    this._handleOnMessage(
      e,
      "handshake-reply",
      () => clearInterval(this._handshakeInterval)
    );
  }
}
class f extends a {
  constructor(t) {
    super({
      targetWindow: window.parent,
      targetOrigin: new URL(t.url).origin
    });
  }
  _onMessage(t) {
    this._handleOnMessage(t, "handshake", () => {
      this._targetOrigin = t.origin, this._sendMessage({ type: "handshake-reply" });
    });
  }
}
export {
  f as Child,
  g as Parent
};
//# sourceMappingURL=handshake.js.map
