"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslationGroupContext = exports.TranslationGroupProvider = exports.initial = void 0;
var react_1 = __importStar(require("react"));
exports.initial = {
    type: 'no-group',
    id: 'none',
};
var TranslationGroupContext = (0, react_1.createContext)([exports.initial, function () { }]);
var TranslationGroupProvider = function (props) {
    var groupInitial = !props.type || !props.id ? exports.initial : {
        type: props.type,
        id: props.id,
    };
    var _a = (0, react_1.useState)(groupInitial), group = _a[0], setGroup = _a[1];
    return (react_1.default.createElement(TranslationGroupContext.Provider, { value: [group, setGroup] }, props.children));
};
exports.TranslationGroupProvider = TranslationGroupProvider;
var useTranslationGroupContext = function () {
    return (0, react_1.useContext)(TranslationGroupContext);
};
exports.useTranslationGroupContext = useTranslationGroupContext;
//# sourceMappingURL=TranslationGroup.js.map