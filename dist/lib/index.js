"use strict";
/*
 * source       https://github.com/ethercards/ec-util/
 * @name        ECUtil
 * @package     ECUtil
 * @author      Micky Socaci <micky@ether.cards>
 * @license     MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualTraits = exports.TokenSpecs = exports.Tools = exports.BitArray = exports.ByteArray = exports.Registry = exports.Forge = void 0;
var forge_1 = __importDefault(require("./ec/forge"));
exports.Forge = forge_1.default;
var registry_1 = __importDefault(require("./ec/registry"));
exports.Registry = registry_1.default;
var ByteArray_1 = __importDefault(require("./utils/ByteArray"));
exports.ByteArray = ByteArray_1.default;
var BitArray_1 = __importDefault(require("./utils/BitArray"));
exports.BitArray = BitArray_1.default;
var Tools_1 = __importDefault(require("./utils/Tools"));
exports.Tools = Tools_1.default;
var TokenSpecs_1 = __importDefault(require("./ec/TokenSpecs"));
exports.TokenSpecs = TokenSpecs_1.default;
var VisualTraits_1 = __importDefault(require("./ec/VisualTraits"));
exports.VisualTraits = VisualTraits_1.default;
if (typeof window !== 'undefined') {
    window.ecutil = window.ecutil || {};
    window.ecutil.Forge = forge_1.default;
    window.ecutil.ByteArray = ByteArray_1.default;
    window.ecutil.BitArray = BitArray_1.default;
    window.ecutil.Registry = registry_1.default;
}
//# sourceMappingURL=index.js.map