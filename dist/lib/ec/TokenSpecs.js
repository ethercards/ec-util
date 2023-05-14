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
var Tools_1 = __importDefault(require("../utils/Tools"));
var TokenSpecs = /** @class */ (function () {
    function TokenSpecs() {
    }
    TokenSpecs.generateTokenCollectionSpecs = function (tokenJson, dnaInHex, keepLayerValues) {
        if (dnaInHex === void 0) { dnaInHex = false; }
        if (keepLayerValues === void 0) { keepLayerValues = false; }
        if (tokenJson[0] === null) {
            tokenJson.shift();
        }
        var specs = {
            tokenStart: 0,
            tokenEnd: 0,
            tokenCount: 0,
            SideCount: tokenJson[0].sides.length,
            SideDNAEncodingIsHEX: dnaInHex,
            tokenBitlength: 0,
            totalBitlength: 0,
            sides: []
        };
        var LayerVariants = [];
        // Each token in array
        for (var i = 0; i < tokenJson.length; i++) {
            var token = tokenJson[i];
            // Each side of the token
            for (var sidej = 0; sidej < token.sides.length; sidej++) {
                // split string by 2 chars ( hex )
                var splitDNA = Tools_1.default.stringSplitter(token.sides[sidej].dna, 2);
                var _loop_1 = function (layery) {
                    var DNAVariantValue = 0;
                    if (dnaInHex) {
                        // get DNA Variant value and add 0x so js can properly convert hex to number
                        DNAVariantValue = Number("0x" + splitDNA[layery]);
                    }
                    else {
                        DNAVariantValue = parseInt(splitDNA[layery]);
                    }
                    // index distinct value for side
                    if (typeof LayerVariants[sidej] === "undefined") {
                        LayerVariants[sidej] = {
                            id: sidej.toString(),
                            name: "Side " + sidej.toString(),
                            bitlength: 0,
                            layers: []
                        };
                    }
                    if (typeof LayerVariants[sidej].layers[layery] === "undefined") {
                        LayerVariants[sidej].layers[layery] = {
                            id: layery.toString(),
                            name: "Side " + sidej + " / Layer " + layery.toString(),
                            bitlength: 0,
                            values: []
                        };
                    }
                    if (!LayerVariants[sidej].layers[layery].values.some(function (e) { return e.id === DNAVariantValue; })) {
                        LayerVariants[sidej].layers[layery].values.push({
                            "id": DNAVariantValue,
                            "label": ""
                        });
                    }
                };
                for (var layery = 0; layery < splitDNA.length; layery++) {
                    _loop_1(layery);
                }
            }
            // sides
        }
        // sort our LayerVariants
        // each side
        var tokenBitlength = 0;
        for (var i = 0; i < LayerVariants.length; i++) {
            var SideBitLength = 0;
            // each layer
            for (var y = 0; y < LayerVariants[i].layers.length; y++) {
                // sort ASC
                LayerVariants[i].layers[y].values = LayerVariants[i].layers[y].values.sort(function (a, b) { return a.id - b.id; });
                // take max value ( last in array )
                var minVal = LayerVariants[i].layers[y].values[0].id;
                var maxVal = LayerVariants[i].layers[y].values[LayerVariants[i].layers[y].values.length - 1].id;
                // set min / max
                LayerVariants[i].layers[y].minVal = minVal;
                LayerVariants[i].layers[y].maxVal = maxVal;
                // set layer bitLength
                LayerVariants[i].layers[y].bitlength = Tools_1.default.lengthToUintEncoder(maxVal);
                // current layer bitlength add to side bitLength
                SideBitLength += LayerVariants[i].layers[y].bitlength;
                if (!keepLayerValues) {
                    // unset values as we no longer need them
                    LayerVariants[i].layers[y].values = [];
                }
            }
            LayerVariants[i].bitlength = SideBitLength;
            tokenBitlength += SideBitLength;
        }
        var sortedTokenJson = JSON.parse(JSON.stringify(tokenJson));
        sortedTokenJson.sort(function (a, b) { return a.tokenId - b.tokenId; });
        // figure out lowest token id and highest token id
        specs.tokenStart = sortedTokenJson[0].tokenId;
        specs.tokenEnd = sortedTokenJson[sortedTokenJson.length - 1].tokenId;
        specs.tokenCount = specs.tokenEnd - specs.tokenStart + 1;
        specs.tokenBitlength = tokenBitlength;
        specs.totalBitlength = tokenBitlength * specs.tokenCount;
        specs.sides = LayerVariants;
        return specs;
    };
    return TokenSpecs;
}());
exports.default = TokenSpecs;
//# sourceMappingURL=TokenSpecs.js.map