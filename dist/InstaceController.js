"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var event_1 = __importDefault(require("./utils/event"));
var eventName_1 = require("./eventName");
var InstanceController = (function () {
    function InstanceController() {
        this.instances = [];
        this._compareSupportedLanguages = function (arr1, arr2) {
            if (arr1.length !== arr2.length)
                return false;
            for (var i = 0; i < arr1.length; i++) {
                if (arr1[i].code !== arr2[i].code)
                    return false;
                if (arr1[i].name !== arr2[i].name)
                    return false;
                if (arr1[i].description !== arr2[i].description)
                    return false;
            }
            return true;
        };
    }
    InstanceController.prototype.addNewInstance = function (instaceData) {
        this.instances.push(instaceData);
    };
    InstanceController.prototype.sendToRemote = function (event, payload) {
        if (this.remoteType !== 'iframe')
            return;
        var data = {
            event: event,
            payload: payload,
        };
        window.parent.postMessage('i18n.quickly' + JSON.stringify(data), "*");
    };
    InstanceController.prototype._updateInstaceWithoutChangingReference = function (instance, jsonData) {
        instance.defaultLang = jsonData.defaultLang;
        instance.lang.current = jsonData.lang.current;
        for (var langCode in jsonData.translations) {
            instance.translations[langCode] = jsonData.translations[langCode];
        }
        instance.defaultLang = jsonData.defaultLang;
        for (var groupType in jsonData.translationGroups) {
            for (var groupId in instance.translationGroups[groupType]) {
                for (var langCode in instance.translationGroups[groupType][groupId]) {
                    instance.translationGroups[groupType][groupId][langCode] = jsonData.translationGroups[groupType][groupId][langCode];
                }
            }
        }
        var shouldUpdateSupportedLanguages = !this._compareSupportedLanguages(jsonData.supportedLanguages, instance.supportedLanguages);
        if (shouldUpdateSupportedLanguages) {
            jsonData.supportedLanguages.forEach(function (lang, langIndex) {
                instance.supportedLanguages[langIndex] = lang;
            });
            event_1.default.emit(eventName_1.EVENT_NAME.NEW_LANG(instance.id), instance.supportedLanguages);
        }
    };
    InstanceController.prototype.handleGeneralEvent = function () {
        var _this = this;
        event_1.default.on(eventName_1.EVENT_NAME.REMOTE_CONTROL_EVENT(-1), function (_a) {
            var event = _a.event, payload = _a.payload;
            switch (event) {
                case 'GET_ALL_INSTANCES':
                    _this.sendToRemote('GET_ALL_INSTANCES', _this.instances);
                    break;
                case 'UPDATE_ALL':
                    _this.instances.forEach(function (instance, index) {
                        _this._updateInstaceWithoutChangingReference(instance, payload[index]);
                    });
                    event_1.default.emit(eventName_1.EVENT_NAME.UPDATE_ALL, undefined);
                    break;
            }
        });
    };
    InstanceController.prototype.initRemoteControl = function (type) {
        var _this = this;
        if (type !== 'iframe')
            return;
        this.remoteType = type;
        window.addEventListener("message", function (event) {
            var data = event.data;
            if (typeof data === 'object')
                return;
            if (!data || !data.startsWith('i18n.quickly'))
                return;
            var stringify = data.replace('i18n.quickly', '');
            try {
                var _a = JSON.parse(stringify), instanceIndex = _a.instanceIndex, event_2 = _a.event, payload = _a.payload;
                event_1.default.emit(eventName_1.EVENT_NAME.REMOTE_CONTROL_EVENT(instanceIndex), { event: event_2, payload: payload });
            }
            catch (err) { }
        });
        this.handleGeneralEvent();
        this.instances.forEach(function (instance, index) {
            event_1.default.on(eventName_1.EVENT_NAME.UPDATE_LANG(instance.id), function (newLang) {
                _this.sendToRemote('CLIENT_CHANGE_LANGUAGE_' + instance.id, newLang);
            });
        });
    };
    return InstanceController;
}());
exports.default = new InstanceController();
//# sourceMappingURL=InstaceController.js.map