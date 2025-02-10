type Emit = (key: string, value: any) => void;
type On = (key: string, callback: (value: any) => void) => void;
type ReadyEvent = {
    emit: Emit;
    on: On;
};
type MESSAGE_TYPES = "handshake" | "handshake-reply" | "event";
declare abstract class BaseChannel {
    protected _Promise: Promise<this>;
    protected _PromiseResolver: (value: this | PromiseLike<this>) => void;
    protected _PromiseRejecter: (reason?: any) => void;
    protected _handlers: {
        [key: string]: Array<(value: any) => void>;
    };
    protected _targetWindow?: Window | null;
    protected _targetOrigin?: string;
    constructor(opt?: {
        targetWindow?: Window;
        targetOrigin?: string;
    });
    protected _sendMessage(msg: any): void;
    protected _trigger(key: string, value: any): void;
    ready(callback: (event: ReadyEvent) => void): void;
    emit: Emit;
    on: On;
    protected abstract _onMessage(event: MessageEvent): void;
    protected _handleOnMessage(e: MessageEvent, type: MESSAGE_TYPES, callback: () => void): void;
}
declare class Parent extends BaseChannel {
    container: HTMLElement;
    iframe: HTMLIFrameElement;
    protected _handshakeInterval?: number;
    constructor(opt: {
        container: string;
        url: string;
    });
    ready(callback: (event: {
        iframe: HTMLIFrameElement;
        container: HTMLElement;
    } & ReadyEvent) => void): void;
    private _startHandshake;
    protected _onMessage(e: MessageEvent): void;
}
declare class Child extends BaseChannel {
    constructor();
    protected _onMessage(e: MessageEvent): void;
}
declare const Handshake: {
    Parent: typeof Parent;
    Child: typeof Child;
};
export { Handshake };
