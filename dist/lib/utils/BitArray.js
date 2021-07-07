"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bitwise_1 = __importDefault(require("bitwise"));
var bignumber_1 = require("@ethersproject/bignumber");
var bytes_1 = require("@ethersproject/bytes");
var BitArray = /** @class */ (function () {
    function BitArray(length) {
        this.length = Math.ceil(length / 8);
        this.backingArray = Uint8Array.from({ length: this.length }, function () { return 0; });
        this.length = this.length * 8;
    }
    BitArray.prototype.set = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == 1) {
                this.on(i);
            }
        }
    };
    BitArray.prototype.get = function (n) {
        return (this.backingArray[n / 8 | 0] & 1 << n % 8) != 0;
    };
    BitArray.prototype.on = function (n) {
        this.backingArray[n / 8 | 0] |= 1 << n % 8;
    };
    BitArray.prototype.off = function (n) {
        this.backingArray[n / 8 | 0] &= ~(1 << n % 8);
    };
    BitArray.prototype.toggle = function (n) {
        this.backingArray[n / 8 | 0] ^= 1 << n % 8;
    };
    BitArray.prototype.forEach = function (callback) {
        var _this = this;
        this.backingArray.forEach(function (number, container) {
            var max = container == _this.backingArray.length - 1 && _this.length % 8 ? _this.length % 8 : 8;
            for (var x = 0; x < max; x++) {
                callback((number & 1 << x) != 0, 8 * container + x);
            }
        });
    };
    BitArray.prototype.toHexString = function () {
        var bn = bignumber_1.BigNumber.from(this.backingArray);
        return bn.toHexString();
    };
    BitArray.prototype.toArray = function () {
        var retVal = [];
        this.backingArray.forEach(function (uint8) {
            retVal.push(uint8);
        });
        return retVal;
    };
    BitArray.prototype.toBinaryString = function (spacer) {
        if (spacer === void 0) { spacer = ' '; }
        var results = [];
        this.backingArray.forEach(function (uint8) {
            var result = "";
            for (var j = 0; j < 8; j++) {
                result += bitwise_1.default.integer.getBit(uint8, j);
            }
            results.push(result);
        });
        return results.join(spacer);
    };
    BitArray.fromHexString = function (data) {
        var Uint8Array = bytes_1.arrayify(data);
        var BA = new BitArray(Uint8Array.length * 8);
        for (var i = 0; i < Uint8Array.length; i++) {
            for (var j = 0; j < 8; j++) {
                var pos = (i * 8) + j;
                var bit = bitwise_1.default.integer.getBit(Uint8Array[i], j);
                if (bit === 1) {
                    BA.on(pos);
                }
            }
        }
        return BA;
    };
    BitArray.fromUint8Array = function (data) {
        if (data.length === 0) {
            data = [0];
        }
        var Uint8Array = bytes_1.arrayify(data);
        var BA = new BitArray(Uint8Array.length * 8);
        for (var i = 0; i < Uint8Array.length; i++) {
            for (var j = 0; j < 8; j++) {
                var pos = (i * 8) + j;
                var bit = bitwise_1.default.integer.getBit(Uint8Array[i], j);
                if (bit === 1) {
                    BA.on(pos);
                }
            }
        }
        return BA;
    };
    return BitArray;
}());
exports.default = BitArray;
//# sourceMappingURL=BitArray.js.map