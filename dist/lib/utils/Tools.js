"use strict";
/*
 * source       https://github.com/ethercards/ec-util/
 * @name        EC
 * @package     ECUtil
 * @author      Micky Socaci <micky@galaxis.xyz>
 * @license     MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bn_js_1 = __importDefault(require("bn.js"));
var Tools = /** @class */ (function () {
    function Tools() {
    }
    Tools.lengthToUintEncoder = function (length) {
        if (length <= 1) {
            return 1;
        }
        else {
            return parseInt((Math.log(length) / Math.log(2)).toString(), 10) + 1;
        }
    };
    Tools.stringSplitter = function (myString, chunkSize) {
        var splitString = [];
        for (var i = 0; i < myString.length; i = i + chunkSize) {
            splitString.push(myString.slice(i, i + chunkSize));
        }
        return splitString;
    };
    Tools.NewIntArray = function (max) {
        return {
            DataCount: 1,
            bitPos: max,
            maxBits: max,
            Data: [new bn_js_1.default(0)],
        };
    };
    Tools.AddToIntArray = function (outputBuffer, val) {
        // let shift value by current position pointer
        var v1 = val.shln(outputBuffer.bitPos);
        outputBuffer.DataCount++;
        var pos = outputBuffer.Data.length - 1;
        if (outputBuffer.bitPos + outputBuffer.maxBits < 256) {
            outputBuffer.Data[pos] = outputBuffer.Data[pos].add(v1);
            outputBuffer.bitPos = (outputBuffer.bitPos + outputBuffer.maxBits) % 256;
            return;
        }
        outputBuffer.Data[pos] = outputBuffer.Data[pos].add(v1.mod(new bn_js_1.default(1).shln(256)));
        outputBuffer.Data.push(v1.shrn(256));
        outputBuffer.bitPos = (outputBuffer.bitPos + outputBuffer.maxBits) % 256;
    };
    return Tools;
}());
exports.default = Tools;
//# sourceMappingURL=Tools.js.map