"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./polyfill");
var util_1 = require("./util");
var getValue_1 = __importDefault(require("./getValue"));
function default_1(el, attr, typeConvert, filter) {
    var filedElements = el.querySelectorAll("[data-" + attr + "]");
    var values = [];
    for (var _i = 0, _a = Array.from(filedElements); _i < _a.length; _i++) {
        var _el = _a[_i];
        values = values.concat(getValue_1.default(_el, attr, typeConvert, filter));
    }
    var result = util_1.arrayToHash(values);
    return result;
}
exports.default = default_1;
//# sourceMappingURL=get.js.map