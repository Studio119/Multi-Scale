"use strict";
exports.__esModule = true;
exports.cast = function (obj) { return obj; };
var Probable = /** @class */ (function () {
    function Probable(obj) {
        this.body = obj;
    }
    Probable.prototype.meets = function (key, callback) {
        try {
            var value = this.body[key];
            return callback(value);
        }
        catch (_a) {
            return null;
        }
    };
    Probable.prototype.use = function (key) {
        try {
            return this.body[key];
        }
        catch (_a) {
            return null;
        }
    };
    return Probable;
}());
exports.Probable = Probable;
;
var b = {
    name: "b",
    age: 16,
    call: function (a) { return a + 1; }
};
var a = {
    name: "sf",
    age: 12,
    next: b
};
var pa = new Probable(a);
var pb = new Probable(b);
console.log(pa.meets("call", function (call) { return call(255); }));
