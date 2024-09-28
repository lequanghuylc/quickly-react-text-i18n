"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var react_1 = require("react");
var useEvent_1 = require("./utils/useEvent");
var parseTextTemplate_1 = require("./utils/parseTextTemplate");
var TranslationGroup_1 = require("./TranslationGroup");
var InstaceController_1 = __importDefault(require("./InstaceController"));
var eventName_1 = require("./eventName");
var create = function (_a) {
    var localData = _a.localData, supportedLanguages = _a.supportedLanguages, localDataGroup = _a.localDataGroup, defaultLang = _a.defaultLang, id = _a.id;
    var instanceId = id || String(Math.random()).replace('.', '');
    var isLocalDataValid = (function () {
        if (!localData)
            return true;
        for (var langCode in localData) {
            if (typeof localData[langCode] !== 'object')
                return false;
        }
        return true;
    })();
    if (!isLocalDataValid)
        throw Error('localData is not valid');
    var translations = localData || {};
    var translationGroups = localDataGroup || {};
    var lang = {
        current: defaultLang || 'en',
        setLang: function (newLang) {
            lang.current = newLang;
            (0, useEvent_1.emitEvent)(eventName_1.EVENT_NAME.UPDATE_LANG(instanceId), newLang);
        }
    };
    var getTranslation = function (key, lang, group, defaultValue) {
        var _a, _b;
        if (typeof key !== 'string')
            return defaultValue;
        var notedAndReturnDefault = function () {
            if (group.id === TranslationGroup_1.initial.id && group.type === TranslationGroup_1.initial.type) {
                supportedLanguages.forEach(function (_a) {
                    var code = _a.code;
                    translations[code] = translations[code] || {};
                    translations[code][key] = translations[code][key] || defaultValue;
                });
            }
            return defaultValue;
        };
        if (group.id === TranslationGroup_1.initial.id && group.type === TranslationGroup_1.initial.type) {
            var langData = translations[lang];
            if (!langData)
                return defaultValue;
            return langData[key] || notedAndReturnDefault();
        }
        var valueInNoGroup = getTranslation(key, lang, TranslationGroup_1.initial, defaultValue);
        if (!translationGroups[group.type] || !translationGroups[group.type][group.id])
            return valueInNoGroup;
        return ((_b = (_a = translationGroups[group.type][group.id]) === null || _a === void 0 ? void 0 : _a[lang]) === null || _b === void 0 ? void 0 : _b[key]) || valueInNoGroup;
    };
    var setTranslation = function (key, lang, group, value) {
    };
    var useParsedTranslation = function (t, componentName) {
        if (componentName === void 0) { componentName = ''; }
        var group = (0, TranslationGroup_1.useTranslationGroupContext)()[0];
        var translationKey = (0, parseTextTemplate_1.parseTranslationKey)(t);
        var key = translationKey.key, inputs = translationKey.inputs;
        var initalValue = getTranslation(key, lang.current, group, t);
        var _a = (0, react_1.useState)({
            raw: initalValue,
            parsed: (0, parseTextTemplate_1.parseTextTemplate)(initalValue, inputs, componentName),
        }), text = _a[0], setText = _a[1];
        (0, useEvent_1.useEvent)(eventName_1.EVENT_NAME.UPDATE_ALL, function () {
            var newValue = getTranslation(key, lang.current, group, t);
            if (newValue !== text.raw)
                setText({
                    raw: newValue,
                    parsed: (0, parseTextTemplate_1.parseTextTemplate)(newValue, inputs, componentName),
                });
        }, [text.raw, t, componentName, getTranslation, group]);
        (0, useEvent_1.useEvent)(eventName_1.EVENT_NAME.UPDATE_LANG(instanceId), function (newLang) {
            var newValue = getTranslation(key, newLang, group, t);
            if (newValue !== text.raw)
                setText({
                    raw: newValue,
                    parsed: (0, parseTextTemplate_1.parseTextTemplate)(newValue, inputs, componentName),
                });
        }, [text.raw, t, componentName, getTranslation, group]);
        (0, react_1.useEffect)(function () {
            var newValue = getTranslation(key, lang.current, group, t);
            setText({
                raw: newValue,
                parsed: (0, parseTextTemplate_1.parseTextTemplate)(newValue, inputs, componentName),
            });
        }, [text.raw, t, componentName, getTranslation, group]);
        (0, useEvent_1.useEvent)(eventName_1.EVENT_NAME.UPDATE_TRANSLATION_KEY(String(key), lang.current, instanceId), function (newTranslation) {
            if (typeof key !== 'string')
                return;
            if (newTranslation !== text.raw)
                setText({
                    raw: newTranslation,
                    parsed: (0, parseTextTemplate_1.parseTextTemplate)(newTranslation, inputs, componentName),
                });
        }, [text.raw, t, key, group, setTranslation]);
        return !text.parsed ? text.raw : text.parsed;
    };
    InstaceController_1.default.addNewInstance({
        id: instanceId,
        supportedLanguages: supportedLanguages,
        defaultLang: defaultLang,
        lang: lang,
        translations: translations,
        translationGroups: translationGroups,
        getTranslation: getTranslation,
        setTranslation: setTranslation,
    });
    var useSupportedLanguages = function () {
        var _a = (0, react_1.useState)(supportedLanguages), langs = _a[0], setLangs = _a[1];
        (0, useEvent_1.useEvent)(eventName_1.EVENT_NAME.NEW_LANG(instanceId), function (newLangArray) {
            setLangs(newLangArray.slice());
        }, []);
        return langs;
    };
    var _t = function (t, group, componentName) {
        if (group === void 0) { group = TranslationGroup_1.initial; }
        if (componentName === void 0) { componentName = ''; }
        var translationKey = (0, parseTextTemplate_1.parseTranslationKey)(t);
        var key = translationKey.key, inputs = translationKey.inputs;
        var value = getTranslation(key, lang.current, group, t);
        var parsed = (0, parseTextTemplate_1.parseTextTemplate)(value, inputs, componentName);
        return !parsed ? value : parsed;
    };
    return {
        lang: lang,
        useTranslation: useParsedTranslation,
        useSupportedLanguages: useSupportedLanguages,
        _t: _t,
    };
};
exports.create = create;
//# sourceMappingURL=create.js.map