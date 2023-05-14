"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * source       https://github.com/ethercards/ec-util/
 * @name        EC
 * @package     ECUtil
 * @author      Micky Socaci <micky@galaxis.xyz>
 * @license     MIT
 */
var bn_js_1 = __importDefault(require("bn.js"));
var Tools_1 = __importDefault(require("../utils/Tools"));
var VisualTraits = /** @class */ (function () {
    function VisualTraits() {
    }
    VisualTraits.prototype.encodeVisualLayerData = function (tokenJson, tokenSpecs, _howManyTokens) {
        if (_howManyTokens === void 0) { _howManyTokens = "ALL"; }
        var tokensToProcess = 0;
        if (_howManyTokens === "ALL") {
            tokensToProcess = tokenJson.length;
        }
        else if (typeof _howManyTokens === "number") {
            tokensToProcess = _howManyTokens;
        }
        else {
            throw new Error("Invalid _howManyTokens value: (" + _howManyTokens + ")");
        }
        if (tokenJson[0] === null) {
            tokenJson.shift();
        }
        var outputs = [];
        // for each side create a new int array
        for (var i = 0; i < tokenSpecs.SideCount; i++) {
            outputs[i] = Tools_1.default.NewIntArray(tokenSpecs.sides[i].bitlength);
        }
        // Each token in array
        for (var i = 0; i < tokensToProcess; i++) {
            var token = tokenJson[i];
            var value = new bn_js_1.default(0);
            var shift = 0;
            // Each side of the token
            for (var sidej = 0; sidej < token.sides.length; sidej++) {
                // split string by 2 chars ( hex )
                var splitDNA = Tools_1.default.stringSplitter(token.sides[sidej].dna, 2);
                // console.log("splitDNA", splitDNA);
                for (var layery = 0; layery < splitDNA.length; layery++) {
                    var DNAVariantValue = void 0;
                    if (tokenSpecs.SideDNAEncodingIsHEX) {
                        // get DNA Variant value and add 0x so js can properly convert hex to number
                        DNAVariantValue = new bn_js_1.default(Number("0x" + splitDNA[layery]));
                    }
                    else {
                        DNAVariantValue = new bn_js_1.default(parseInt(splitDNA[layery]));
                    }
                    // encoder bitlength
                    var bitlength = tokenSpecs.sides[sidej].layers[layery].bitlength;
                    var shiftedValue = DNAVariantValue.shln(shift);
                    shift += bitlength;
                    value = value.add(shiftedValue);
                }
                Tools_1.default.AddToIntArray(outputs[sidej], value);
            }
            // sides
        }
        var HEXoutputs = [];
        // convert everything to HEX
        for (var i = 0; i < tokenSpecs.SideCount; i++) {
            HEXoutputs[i] = {
                bitPos: outputs[i].bitPos,
                maxBits: outputs[i].maxBits,
                DataCount: outputs[i].DataCount,
                Data: []
            };
            for (var j = 0; j < outputs[i].Data.length; j++) {
                HEXoutputs[i].Data.push("0x" + outputs[i].Data[j].toString("hex"));
            }
        }
        return HEXoutputs;
    };
    return VisualTraits;
}());
exports.default = VisualTraits;
//# sourceMappingURL=VisualTraits.js.map