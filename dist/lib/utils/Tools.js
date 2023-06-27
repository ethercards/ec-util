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
var bignumber_1 = require("@ethersproject/bignumber");
var Tools = /** @class */ (function () {
    function Tools() {
    }
    Tools.findRevealRangeForN = function (tokenId, reveals) {
        for (var i = 1; i <= reveals.length; i++) {
            if (tokenId <= reveals[i].RANGE_END) {
                return i;
            }
        }
        return 0;
    };
    Tools.shiftAndFilterRevealedTokens = function (tokenJson, reveals) {
        /*  REVEAL ITEM {
                REQUEST_ID: BigNumber {
                    _hex: '0x1a30fc3732a6fc76e884341677c816906ec53b702d0f95bdb92a059c8938dd7b',
                    _isBigNumber: true
                },
                RANDOM_NUM: BigNumber {
                    _hex: '0x1daa749bdd6e830903f8176b896faacd0e87988955f3ab3620bc3698afe1df8a',
                    _isBigNumber: true
                },
                SHIFT: BigNumber { _hex: '0x01', _isBigNumber: true },
                RANGE_START: BigNumber { _hex: '0x0f', _isBigNumber: true },
                RANGE_END: BigNumber { _hex: '0x12', _isBigNumber: true },
                processed: true
            }
        */
        var newJsonData = [];
        // 1. find the highest revealed token id
        var maxTokenId = reveals[reveals.length - 1].RANGE_END;
        // 2. for each reveal that's been processed, copy data into reverse shifted id
        for (var y = 0; y < reveals.length; y++) {
            // make sure it's processed
            var thisReveal = reveals[y];
            if (thisReveal.processed) {
                for (var tokenId = Number(thisReveal.RANGE_START) + 1; tokenId <= Number(thisReveal.RANGE_END); tokenId++) {
                    var dataIndex = this.reverseShift(tokenId, thisReveal.SHIFT, thisReveal.RANGE_START, thisReveal.RANGE_END);
                    newJsonData[dataIndex] = tokenJson[tokenId - 1];
                    newJsonData[dataIndex].tokenId = dataIndex;
                }
            }
        }
        var sortedData = JSON.parse(JSON.stringify(newJsonData));
        if (sortedData[0] === null || typeof sortedData[0] === "undefined") {
            sortedData.shift();
        }
        sortedData.sort(function (a, b) { return a.tokenId - b.tokenId; });
        return [sortedData, Number(maxTokenId)];
    };
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
            DataCount: 0,
            bitPos: 0,
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
    var _a;
    _a = Tools;
    Tools.getReverseShiftedId = function (id, event) {
        var result = id;
        if (event) {
            result = _a.reverseShift(id, event.shifts_by, event.start, event.end);
        }
        return result;
    };
    Tools.reverseShift = function (tokenId, offset, start, end) {
        var result = bignumber_1.BigNumber.from(0);
        var token = bignumber_1.BigNumber.from(tokenId);
        var offsetNumber = bignumber_1.BigNumber.from(offset);
        var startNumber = bignumber_1.BigNumber.from(start).add(1);
        var endNumber = bignumber_1.BigNumber.from(end);
        if (token.lte(endNumber)) {
            var numInRange = token.sub(offsetNumber);
            if (numInRange.gte(startNumber) && numInRange.lte(endNumber)) {
                result = numInRange;
            }
            else {
                result = numInRange.add(endNumber).sub(startNumber).add(1);
            }
        }
        return Number(result.toString());
    };
    return Tools;
}());
exports.default = Tools;
//# sourceMappingURL=Tools.js.map