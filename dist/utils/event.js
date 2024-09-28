"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalEvent = void 0;
var GlobalEventClass = (function () {
    function GlobalEventClass() {
        this._listeners = {
            count: 0,
            refs: {},
        };
        this.on = this.addEventListener;
        this.rm = this.removeEventListener;
        this.rmAll = this.removeAllListeners;
        this.emit = this.emitEvent;
    }
    GlobalEventClass.prototype.addEventListener = function (eventName, callback) {
        if (typeof (eventName) === 'string' &&
            typeof (callback) === 'function') {
            this._listeners.count++;
            var eventId = 'l' + this._listeners.count;
            this._listeners.refs[eventId] = {
                name: eventName,
                callback: callback,
            };
            return eventId;
        }
        return false;
    };
    GlobalEventClass.prototype.removeEventListener = function (id) {
        if (typeof (id) === 'string') {
            return delete this._listeners.refs[id];
        }
        return false;
    };
    GlobalEventClass.prototype.removeAllListeners = function () {
        var _this = this;
        var removeError = false;
        Object.keys(this._listeners.refs).forEach(function (_id) {
            var removed = delete _this._listeners.refs[_id];
            removeError = (!removeError) ? !removed : removeError;
        });
        return !removeError;
    };
    GlobalEventClass.prototype.emitEvent = function (eventName, data) {
        var _this = this;
        Object.keys(this._listeners.refs).forEach(function (_id) {
            if (_this._listeners.refs[_id] &&
                eventName === _this._listeners.refs[_id].name)
                _this._listeners.refs[_id].callback(data);
        });
    };
    return GlobalEventClass;
}());
exports.GlobalEvent = new GlobalEventClass();
exports.default = exports.GlobalEvent;
//# sourceMappingURL=event.js.map