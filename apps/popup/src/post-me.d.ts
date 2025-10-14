/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "post-me" {
  type Method = (...args: any[]) => any;

  // A collection of methods, keyed by their names.
  type Methods = Record<string, Method>;

  // The RemoteHandle provides a way to call methods on the remote context.
  interface RemoteHandle<TRemoteMethods extends Methods> {
    call<TMethod extends keyof TRemoteMethods>(
      method: TMethod,
      ...args: Parameters<TRemoteMethods[TMethod]>
    ): Promise<ReturnType<TRemoteMethods[TMethod]>>;
  }

  // The LocalHandle provides a way to manage methods exposed by the local context.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
  interface LocalHandle<TLocalMethods extends Methods> {
    // Simplified based on usage.
  }

  // A representation of the post-me Connection object.
  interface Connection<
    TLocalMethods extends Methods,
    TRemoteMethods extends Methods,
  > {
    remoteHandle(): RemoteHandle<TRemoteMethods>;
    localHandle(): LocalHandle<TLocalMethods>;
    close(): void;
    connected: boolean;
  }

  // Represents a messenger that can post and listen for messages.
  interface Messenger {
    postMessage(message: any, transfer?: any[]): void;
    addMessageListener(listener: (event: MessageEvent) => void): () => void;
  }

  // ChildHandshake function signature.
  export function ChildHandshake<TLocalMethods extends Methods>(
    messenger: Messenger,
    methods?: TLocalMethods,
  ): Promise<Connection<TLocalMethods, Methods>>;

  // WindowMessenger class signature.
  export class WindowMessenger implements Messenger {
    constructor(options: {
      localWindow?: Window;
      remoteWindow: Window;
      remoteOrigin: string;
    });
    postMessage(message: any, transfer?: any[]): void;
    addMessageListener(listener: (event: MessageEvent) => void): () => void;
  }
}
