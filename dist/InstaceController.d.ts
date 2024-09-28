import { ISingleInstance, TSupportedLanguages } from './types';
declare class InstanceController {
    instances: Array<ISingleInstance>;
    remoteType: 'iframe' | 'websocket';
    addNewInstance(instaceData: ISingleInstance): void;
    sendToRemote(event: string, payload: any): void;
    _compareSupportedLanguages: (arr1: TSupportedLanguages, arr2: TSupportedLanguages) => boolean;
    _updateInstaceWithoutChangingReference(instance: ISingleInstance, jsonData: ISingleInstance): void;
    handleGeneralEvent(): void;
    initRemoteControl(type: 'iframe' | 'websocket'): void;
}
declare const _default: InstanceController;
export default _default;
