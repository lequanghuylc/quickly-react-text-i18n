import { useEffect } from 'react';
import GlobalEvent, { ICallback } from './event';

export const useEvent = <T>(name : string, callback : ICallback<T>, arrayOfState : Array<any>) : void => {
  useEffect(() => {
    let eventId =  GlobalEvent.on(name, callback);
    if (typeof eventId !== 'string') return;
    return () => {
      GlobalEvent.rm(eventId as string);
    };
  }, arrayOfState);
};

export const emitEvent = <T>(eventName: string, data: T) => GlobalEvent.emit(eventName, data);