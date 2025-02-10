var h = Object.defineProperty;
var o = (s, t, e) => t in s ? h(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var r = (s, t, e) => o(s, typeof t != "symbol" ? t + "" : t, e);
const d = [
  "handshake",
  "handshake-reply",
  "event"
];
function l(s, t) {
  if (t == null || s.origin !== t || !s.data || typeof s.data != "object") return !1;
  const e = s.data;
  return !(!e.type || !d.includes(e.type));
}
class a {
  constructor(t = {}) {
    r(this, "_Promise");
    r(this, "_PromiseResolver");
    r(this, "_PromiseRejecter");
    r(this, "_handlers");
    r(this, "_targetWindow");
    r(this, "_targetOrigin");
    r(this, "emit", (t, e) => this._sendMessage({ type: "event", key: t, value: e }));
    r(this, "on", (t, e) => {
      this._handlers[t] || (this._handlers[t] = []), this._handlers[t].push(e);
    });
    this._Promise = new Promise((e, i) => {
      this._PromiseResolver = e, this._PromiseRejecter = i;
    }), this._handlers = {}, this._targetWindow = t.targetWindow, this._targetOrigin = t.targetOrigin, window.addEventListener("message", this._onMessage.bind(this));
  }
  _sendMessage(t) {
    var e;
    this._targetOrigin != null && ((e = this._targetWindow) == null || e.postMessage(t, this._targetOrigin));
  }
  _trigger(t, e) {
    this._handlers[t] && this._handlers[t].forEach((i) => i(e));
  }
  ready(t) {
    this._Promise.then(t);
  }
  revert() {
    window.removeEventListener("message", this._onMessage.bind(this));
  }
  _handleOnMessage(t, e, i) {
    if (!l(t, this._targetOrigin)) return;
    const n = t.data;
    n.type === e ? (i(), this._PromiseResolver(this)) : n.type === "event" && n.key != null && this._trigger(n.key, n.value);
  }
}
class g extends a {
  constructor(e) {
    super();
    r(this, "container");
    r(this, "iframe");
    r(this, "_handshakeInterval");
    const i = document.getElementById(e.container);
    if (!i) throw new Error("Container element not found");
    this.container = i, this.iframe = document.createElement("iframe"), this.iframe.style.width = "100%", this.iframe.style.height = "100%", this.container.appendChild(this.iframe), this._targetOrigin = new URL(e.url, window.location.href).origin, this.iframe.addEventListener("load", () => {
      this._targetWindow = this.iframe.contentWindow, this._startHandshake();
    }), this.iframe.src = e.url;
  }
  ready(e) {
    super.ready(e);
  }
  revert() {
    var e;
    super.revert(), (e = this.iframe.parentNode) == null || e.removeChild(this.iframe);
  }
  _startHandshake() {
    let e = 0;
    const i = window.setInterval(() => {
      e++, e > 5 ? (clearInterval(i), this._PromiseRejecter(new Error("Handshake failed"))) : this._sendMessage({ type: "handshake" });
    }, 500);
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
class c extends a {
  constructor() {
    super({
      targetWindow: window.parent,
      targetOrigin: window.parent.location.origin
    });
  }
  _onMessage(t) {
    this._handleOnMessage(
      t,
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
