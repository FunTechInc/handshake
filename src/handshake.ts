type Emit = (key: string, value: any) => void;
type On = (key: string, callback: (value: any) => void) => void;
type ReadyEvent = {
   emit: Emit;
   on: On;
};
type MessageData = { type: string; key?: string; value?: any };
type MESSAGE_TYPES = "handshake" | "handshake-reply" | "event";

const MAX_HANDSHAKE_REQUESTS: number = 5;
const HANDSHAKE_REQUESTS_INTERVAL: number = 500;
const ALLOWED_MESSAGE_TYPES: MESSAGE_TYPES[] = [
   "handshake",
   "handshake-reply",
   "event",
];

function sanitize(message: MessageEvent, allowedOrigin?: string): boolean {
   if (allowedOrigin == null) return false;
   if (message.origin !== allowedOrigin) return false;
   if (!message.data || typeof message.data !== "object") return false;
   const data = message.data as { type?: MESSAGE_TYPES };
   if (!data.type) return false;
   if (!ALLOWED_MESSAGE_TYPES.includes(data.type)) return false;
   return true;
}

abstract class BaseChannel {
   protected _Promise: Promise<this>;
   protected _PromiseResolver!: (value: this | PromiseLike<this>) => void;
   protected _PromiseRejecter!: (reason?: any) => void;

   protected _handlers: { [key: string]: Array<(value: any) => void> };
   protected _targetWindow?: Window | null;
   protected _targetOrigin?: string;

   constructor(opt: { targetWindow?: Window; targetOrigin?: string } = {}) {
      this._Promise = new Promise<this>((resolve, reject) => {
         this._PromiseResolver = resolve;
         this._PromiseRejecter = reject;
      });
      this._handlers = {};
      this._targetWindow = opt.targetWindow;
      this._targetOrigin = opt.targetOrigin;
      window.addEventListener("message", this._onMessage.bind(this));
   }

   protected _sendMessage(msg: any): void {
      if (this._targetOrigin == null) return;
      this._targetWindow?.postMessage(msg, this._targetOrigin);
   }

   protected _trigger(key: string, value: any): void {
      if (this._handlers[key]) this._handlers[key].forEach((cb) => cb(value));
   }

   public ready(callback: (event: ReadyEvent) => void): void {
      this._Promise.then(callback);
   }

   public emit: Emit = (key, value) =>
      this._sendMessage({ type: "event", key, value });

   public on: On = (key, callback) => {
      if (!this._handlers[key]) this._handlers[key] = [];
      this._handlers[key].push(callback);
   };

   protected abstract _onMessage(event: MessageEvent): void;
   protected _handleOnMessage(
      e: MessageEvent,
      type: MESSAGE_TYPES,
      callback: () => void
   ) {
      if (!sanitize(e, this._targetOrigin)) return;
      const msg = e.data as MessageData;
      if (msg.type === type) {
         callback();
         this._PromiseResolver(this);
      } else if (msg.type === "event" && msg.key != undefined) {
         this._trigger(msg.key, msg.value);
      }
   }
}

class Parent extends BaseChannel {
   public container: HTMLElement;
   public iframe: HTMLIFrameElement;
   protected _handshakeInterval?: number;

   constructor(opt: { container: string; url: string }) {
      super();

      const container = document.getElementById(opt.container);
      if (!container) throw new Error("Container element not found");
      this.container = container;
      this.iframe = document.createElement("iframe");
      this.iframe.style.width = "100%";
      this.iframe.style.height = "100%";

      this.container.appendChild(this.iframe);

      this._targetOrigin = new URL(opt.url, window.location.href).origin;

      this.iframe.addEventListener("load", () => {
         this._targetWindow = this.iframe.contentWindow;
         this._startHandshake();
      });
      this.iframe.src = opt.url;
   }

   public ready(
      callback: (
         event: {
            iframe: HTMLIFrameElement;
            container: HTMLElement;
         } & ReadyEvent
      ) => void
   ): void {
      super.ready(callback as any);
   }

   private _startHandshake(): void {
      let attempt = 0;
      const handshakeInterval = window.setInterval(() => {
         attempt++;
         if (attempt > MAX_HANDSHAKE_REQUESTS) {
            clearInterval(handshakeInterval);
            this._PromiseRejecter(new Error("Handshake failed"));
         } else {
            this._sendMessage({ type: "handshake" });
         }
      }, HANDSHAKE_REQUESTS_INTERVAL);
      this._handshakeInterval = handshakeInterval;
   }

   protected _onMessage(e: MessageEvent): void {
      this._handleOnMessage(e, "handshake-reply", () =>
         clearInterval(this._handshakeInterval)
      );
   }
}

class Child extends BaseChannel {
   constructor() {
      super({
         targetWindow: window.parent,
         targetOrigin: window.parent.location.origin,
      });
   }

   protected _onMessage(e: MessageEvent): void {
      this._handleOnMessage(e, "handshake", () =>
         this._sendMessage({ type: "handshake-reply" })
      );
   }
}

const Handshake = {
   Parent,
   Child,
};

if (typeof exports !== "undefined") {
   exports.Handshake = Handshake;
}
if (typeof globalThis !== "undefined") {
   (globalThis as any).Handshake = Handshake;
}

export { Handshake };
