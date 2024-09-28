"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_NAME = void 0;
exports.EVENT_NAME = {
    UPDATE_LANG: function (id) { return 'UPDATE_LANG_' + id; },
    NEW_LANG: function (id) { return 'NEW_LANG_' + id; },
    UPDATE_ALL: 'UPDATE_ALL',
    UPDATE_TRANSLATION_KEY: function (key, lang, id) { return "UPDATE_TRANSLATION_KEY_".concat(key, "_").concat(lang); },
    REMOTE_CONTROL_EVENT: function (instanceIndex) { return "REMOTE_CONTROL_EVENT_".concat(instanceIndex); },
};
//# sourceMappingURL=eventName.js.map