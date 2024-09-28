import { ICallback } from './event';
export declare const useEvent: <T>(name: string, callback: ICallback<T>, arrayOfState: Array<any>) => void;
export declare const emitEvent: <T>(eventName: string, data: T) => void;
