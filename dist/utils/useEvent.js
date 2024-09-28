"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitEvent = exports.useEvent = void 0;
var react_1 = require("react");
var event_1 = __importDefault(require("./event"));
var useEvent = function (name, callback, arrayOfState) {
    (0, react_1.useEffect)(function () {
        var eventId = event_1.default.on(name, callback);
        if (typeof eventId !== 'string')
            return;
        return function () {
            event_1.default.rm(eventId);
        };
    }, arrayOfState);
};
exports.useEvent = useEvent;
var emitEvent = function (eventName, data) { return event_1.default.emit(eventName, data); };
exports.emitEvent = emitEvent;
//# sourceMappingURL=useEvent.js.map