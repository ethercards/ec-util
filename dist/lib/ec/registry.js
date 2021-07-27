"use strict";
/*
 * source       https://github.com/ethercards/ec-util/
 * @name        EC
 * @package     ECUtil
 * @author      Micky Socaci <micky@ether.cards>
 * @license     MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BitArray_1 = __importDefault(require("../utils/BitArray"));
var Registry = /** @class */ (function () {
    function Registry() {
    }
    /**
     * Decode Layer Data
     * @param binaryString string
     * @returns string
     */
    Registry.prototype.decodeLayers = function (binaryString) {
    };
    /**
     * Decode Trait Data
     * @param Uint8Array
     * @returns array
     */
    Registry.prototype.decodeTraits = function (Uint8Array) {
        var traits = BitArray_1.default.fromUint8Array(Uint8Array);
        return traits.toEnabled();
    };
    /**
     * Decode Trait Data
     * @param Uint8Array
     * @returns array
     */
    Registry.prototype.toKeyValue = function (Uint8Array) {
        var traits = BitArray_1.default.fromUint8Array(Uint8Array);
        return traits.toEnabled();
    };
    return Registry;
}());
exports.default = Registry;
//# sourceMappingURL=registry.js.map