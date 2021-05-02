export default class Forge {
    version: number;
    USER_ACTION_LAYER_TRANSFER: number;
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
    encodeLayerTransfer(dstTokenId: number, srcTokenId: number, layer1: string, layer2: string, layer3: string, layer4: string, layer5: string): string;
    /**
     * Decode Layer transfer data
     * @param binaryString string
     * @returns string
     */
    decodeLayerTransfer(binaryString: string): any;
    requires(condition: any, message: string): void;
    /**
     * Remove 0x from string then return it
     * @param string
     * @returns string
     */
    removeZeroX(string: string): string;
}
