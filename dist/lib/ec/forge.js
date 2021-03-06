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
var ByteArray_1 = __importDefault(require("../utils/ByteArray"));
var Forge = /** @class */ (function () {
    function Forge() {
        this.version = 1;
        this.USER_ACTION_LAYER_TRANSFER = 1;
    }
    /**
     * Encode Layer transfer
     * @param dstTokenId number     Destination token id
     * @param srcTokenId number     Source token id
     * @param layer1 string         Layer 1 value
     * @param layer2 string         Layer 2 value
     * @param layer3 string         Layer 3 value
     * @param layer4 string         Layer 4 value
     * @param layer5 string         Layer 5 value
     * @returns string
     */
    Forge.prototype.encodeLayerTransfer = function (dstTokenId, srcTokenId, layer1, layer2, layer3, layer4, layer5) {
        this.requires(dstTokenId > 10 && dstTokenId <= 10000, "dstTokenId must be in range between 10 and 10000");
        this.requires(srcTokenId > 10 && srcTokenId <= 10000, "srcTokenId must be in range between 10 and 10000");
        this.requires(dstTokenId != srcTokenId, "dstTokenId must be different than srcTokenId");
        this.requires(this.isBoolean(layer1), "Layer1 length must be boolean");
        this.requires(this.isBoolean(layer2), "Layer2 length must be boolean");
        this.requires(this.isBoolean(layer3), "Layer3 length must be boolean");
        this.requires(this.isBoolean(layer4), "Layer4 length must be boolean");
        this.requires(this.isBoolean(layer5), "Layer5 length must be boolean");
        var bytes = new ByteArray_1.default(Buffer.alloc(2 + 2));
        // add version - 1 byte - uint8
        bytes.writeByte(this.version);
        // add method id - 1 byte - uint8
        bytes.writeByte(this.USER_ACTION_LAYER_TRANSFER);
        // dstTokenId - 2 bytes - uint16
        bytes.writeUnsignedShort(dstTokenId);
        // optional.. since we already know the source when received by the contract.. but hey.
        // srcTokenId - 2 bytes - uint16
        bytes.writeUnsignedShort(srcTokenId);
        // add layers
        bytes.writeBoolean(layer1);
        bytes.writeBoolean(layer2);
        bytes.writeBoolean(layer3);
        bytes.writeBoolean(layer4);
        bytes.writeBoolean(layer5);
        // add 0x start and return
        return "0x" + bytes.toString("hex"); // + data;
    };
    /**
     * Decode Layer transfer data
     * @param binaryString string
     * @returns string
     */
    Forge.prototype.decodeLayerTransfer = function (binaryString) {
        // strip out 0x
        var cleanBinary = this.removeZeroX(binaryString);
        // convert the result to a byte array so we can process it
        var bytes = new ByteArray_1.default(Buffer.from(cleanBinary, "hex"));
        var result = {
            version: bytes.readByte(),
            method_id: bytes.readByte(),
            dstTokenId: bytes.readUnsignedShort(),
            srcTokenId: bytes.readUnsignedShort(),
            layer1: false,
            layer2: false,
            layer3: false,
            layer4: false,
            layer5: false,
        };
        for (var i = 1; i <= 5; i++) {
            result["layer" + i] = bytes.readBoolean();
        }
        return result;
    };
    Forge.prototype.requires = function (condition, message) {
        if (!condition) {
            throw (message);
        }
    };
    Forge.prototype.isBoolean = function (variable) {
        return typeof variable === "boolean";
    };
    /**
     * Remove 0x from string then return it
     * @param string
     * @returns string
     */
    Forge.prototype.removeZeroX = function (string) {
        return string.replace("0x", "");
    };
    return Forge;
}());
exports.default = Forge;
//# sourceMappingURL=forge.js.map