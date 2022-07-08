import { ISingleInstance, IRemoteControlReceiveData } from './types';
import GlobalEvent from './utils/event';
import { EVENT_NAME } from './eventName';

class InstanceController {
  
  instances : Array<ISingleInstance> = [];
  remoteType : 'iframe' | 'websocket';

  addNewInstance(instaceData : ISingleInstance) {
    this.instances.push(instaceData);
  }

  sendToRemote(event : string, payload : any) {
    if (this.remoteType !== 'iframe') return;
    const data = {
      event,
      payload,
    };
    window.parent.postMessage('i18n.quickly' + JSON.stringify(data), "*");
  }

  _updateInstaceWithoutChangingReference(instance : ISingleInstance, jsonData : ISingleInstance) {
    instance.defaultLang = jsonData.defaultLang;
    instance.lang.current = jsonData.lang.current;
    for (let langCode in instance.translations) {
      instance.translations[langCode] = jsonData.translations[langCode];
    }

    instance.defaultLang = jsonData.defaultLang;
    for (let groupType in instance.translationGroups) {
      for (let groupId in instance.translationGroups[groupType]) {
        
        for (let langCode in instance.translationGroups[groupType][groupId]) {
          instance.translationGroups[groupType][groupId][langCode] = jsonData.translationGroups[groupType][groupId][langCode];
        }
      }
      
    }
  }

  handleGeneralEvent() {
    GlobalEvent.on<{ event: string, payload: any }>(EVENT_NAME.REMOTE_CONTROL_EVENT(-1), ({ event, payload }) => {
      // console.log({ event, payload });
      switch(event) {
        case 'GET_ALL_INSTANCES':
          this.sendToRemote('GET_ALL_INSTANCES', this.instances);
        break;
        case 'UPDATE_ALL':
          this.instances.forEach((instance, index) => {
            this._updateInstaceWithoutChangingReference(instance, payload[index]);
          });
          GlobalEvent.emit(EVENT_NAME.UPDATE_ALL, undefined);
        break;
      }
    });
  }

  initRemoteControl(type : 'iframe' | 'websocket') {
    // TODO: websocket for mobile app
    if (type !== 'iframe') return;
    this.remoteType = type;
    window.addEventListener("message", function (event) {
      const { data } = event;
      if (typeof data === 'object') return;
      if (!data || !(data as string).startsWith('i18n.quickly')) return;
      const stringify = data.replace('i18n.quickly', '');
      try {
        const { instanceIndex, event, payload } : IRemoteControlReceiveData = JSON.parse(stringify);
        GlobalEvent.emit(EVENT_NAME.REMOTE_CONTROL_EVENT(instanceIndex), { event, payload });
      } catch(err){}
    })

    this.handleGeneralEvent();
    this.instances.forEach((instance) => {
      GlobalEvent.on(EVENT_NAME.UPDATE_LANG(instance.id), newLang => {
        this.sendToRemote(
          'CLIENT_CHANGE_LANGUAGE_'+instance.id,
          newLang,
        )
      });
    })
  }
}

export default new InstanceController();