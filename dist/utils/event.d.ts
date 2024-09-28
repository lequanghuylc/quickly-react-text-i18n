export interface ICallback<T> {
    (data: T): void;
}
export declare type TEventItem<T> = {
    name: string;
    callback: ICallback<T>;
};
declare type InnerListerners = {
    count: number;
    refs: {
        [key: string]: TEventItem<any>;
    };
};
declare class GlobalEventClass {
    _listeners: InnerListerners;
    addEventListener<T>(eventName: string, callback: ICallback<T>): string | boolean;
    removeEventListener(id: string): undefined | boolean;
    removeAllListeners(): boolean;
    emitEvent<T>(eventName: string, data: T): void;
    on: <T>(eventName: string, callback: ICallback<T>) => string | boolean;
    rm: (id: string) => undefined | boolean;
    rmAll: () => boolean;
    emit: <T>(eventName: string, data: T) => void;
}
export declare const GlobalEvent: GlobalEventClass;
export default GlobalEvent;
