export default class Registry {
    /**
     * Decode Layer Data
     * @param binaryString string
     * @returns string
     */
    decodeLayers(binaryString: string): any;
    /**
     * Decode Trait Data
     * @param Uint8Array
     * @returns array
     */
    decodeTraits(Uint8Array: any[]): any[];
    /**
     * Decode Trait Data
     * @param Uint8Array
     * @returns array
     */
    toKeyValue(Uint8Array: any[]): any[];
}
