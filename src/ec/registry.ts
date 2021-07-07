/*
 * source       https://github.com/ethercards/ec-util/
 * @name        EC
 * @package     ECUtil
 * @author      Micky Socaci <micky@ether.cards>
 * @license     MIT
 */

import BitArray from "../utils/BitArray";

export default class Registry {

    /** 
     * Decode Layer Data
     * @param binaryString string
     * @returns string
     */
    public decodeLayers(binaryString: string): any {

    }

    /** 
     * Decode Trait Data
     * @param Uint8Array
     * @returns array
     */
    public decodeTraits(Uint8Array: any[]): any[] {
        const traits = BitArray.fromUint8Array(Uint8Array);
        return traits.toEnabled();
    }

    /** 
     * Decode Trait Data
     * @param Uint8Array
     * @returns array
     */
     public toKeyValue(Uint8Array: any[]): any[] {
        const traits = BitArray.fromUint8Array(Uint8Array);
        return traits.toEnabled();
    }

}
