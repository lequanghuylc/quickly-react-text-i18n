"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTextTemplate = exports.parseTranslationKey = void 0;
var react_1 = __importDefault(require("react"));
var parseTranslationKey = function (userContent) {
    if (!userContent)
        return { key: userContent, inputs: [] };
    if (typeof userContent === 'number')
        return { key: userContent, inputs: [] };
    if (typeof userContent === 'string') {
        var text_1 = userContent;
        var parts = text_1.match(/_%((.(?!_%))+?)%_/g);
        if (!parts)
            return { key: text_1, inputs: [] };
        var key_1 = '';
        var inputs_1 = [];
        var lastIndex_1 = 0;
        parts.forEach(function (val, partIndex) {
            var index = text_1.indexOf(val);
            key_1 += text_1.slice(lastIndex_1, index);
            var input = val.replace('_%', '').replace('%_', '');
            key_1 += '%s';
            lastIndex_1 = index + val.length;
            inputs_1.push(input);
        });
        if (lastIndex_1 < text_1.length - 1) {
            key_1 += text_1.slice(lastIndex_1, text_1.length);
        }
        return { key: key_1, inputs: inputs_1 };
    }
    if (typeof userContent !== 'string' && !!userContent.filter) {
        var isAllString_1 = userContent.filter(function (val) { return typeof val === 'string' || typeof val === 'number'; }).length === userContent.length;
        if (isAllString_1) {
            var textContent = userContent.join('');
            return (0, exports.parseTranslationKey)(textContent);
        }
    }
    var inputIndex = {};
    var allInputs = [];
    var resultContent = userContent.slice();
    resultContent.forEach(function (val, valIndex) {
        if (val === null || val === undefined)
            return;
        if (typeof val === 'string') {
            var parsePart = (0, exports.parseTranslationKey)(val);
            if (val === parsePart.key)
                return;
            resultContent[valIndex] = parsePart.key;
            inputIndex[valIndex] = parsePart.inputs;
            allInputs = __spreadArray(__spreadArray([], allInputs, true), parsePart.inputs, true);
        }
        if (typeof val === 'object' && !!val.$$typeof) {
            if (valIndex === 0 || valIndex === resultContent.length - 1)
                return;
            if (typeof resultContent[valIndex - 1] === 'string' && resultContent[valIndex - 1].endsWith('_%')
                && typeof resultContent[valIndex + 1] === 'string' && resultContent[valIndex + 1].startsWith('%_')) {
                resultContent[valIndex - 1] = resultContent[valIndex - 1].slice(0, resultContent[valIndex - 1].length - 2);
                resultContent[valIndex + 1] = resultContent[valIndex + 1].replace('%_', '');
                resultContent[valIndex] = '%s';
                inputIndex[valIndex] = val;
                allInputs = __spreadArray(__spreadArray([], allInputs, true), [
                    val,
                ], false);
            }
        }
    });
    var isAllString = resultContent.filter(function (val) { return typeof val === 'string' || typeof val === 'number'; }).length === resultContent.length;
    if (isAllString) {
        var textContent = resultContent.join('');
        return {
            key: textContent,
            inputs: allInputs,
        };
    }
    return {
        key: userContent,
        inputs: [],
    };
};
exports.parseTranslationKey = parseTranslationKey;
var parseTextTemplate = function (template, inputs, componentName) {
    if (typeof template !== 'string') {
        return template;
    }
    var regexp = /%s/g;
    var match = template.match(regexp);
    if (!match)
        return undefined;
    var output = [];
    var lastIndex = 0;
    var stringNode = template;
    inputs.forEach(function (val) {
        var index = stringNode.indexOf('%s');
        output.push(stringNode.slice(lastIndex, index));
        lastIndex = index + '%s'.length;
        var element = componentName ? componentName : react_1.default.Fragment;
        output.push(react_1.default.createElement(element, { key: 'number-' + index }, val));
    });
    if (lastIndex < stringNode.length) {
        output.push(stringNode.slice(lastIndex, stringNode.length));
    }
    return react_1.default.createElement(react_1.default.Fragment, null, output);
};
exports.parseTextTemplate = parseTextTemplate;
//# sourceMappingURL=parseTextTemplate.js.map