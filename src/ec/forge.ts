/*
 * source       https://github.com/ethercards/ec-util/
 * @name        EC
 * @package     ECUtil
 * @author      Micky Socaci <micky@ether.cards>
 * @license     MIT
 */

import ByteArray from "../utils/ByteArray";

export default class Forge {

    public version: number = 1;
    public USER_ACTION_LAYER_TRANSFER:number = 1;

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
    public encodeLayerTransfer(
        dstTokenId: number,
        srcTokenId: number,
        layer1: string,
        layer2: string,
        layer3: string,
        layer4: string,
        layer5: string
    ): string {

        this.requires(dstTokenId > 10 && dstTokenId <= 10000, "dstTokenId must be in range between 10 and 10000");
        this.requires(srcTokenId > 10 && srcTokenId <= 10000, "srcTokenId must be in range between 10 and 10000");
        this.requires(dstTokenId != srcTokenId, "dstTokenId must be different than srcTokenId");
        this.requires(layer1.length == 2, "Layer1 length must be 2");
        this.requires(layer2.length == 2, "Layer2 length must be 2");
        this.requires(layer3.length == 2, "Layer3 length must be 2");
        this.requires(layer4.length == 2, "Layer4 length must be 2");
        this.requires(layer5.length == 2, "Layer5 length must be 2");


        const bytes = new ByteArray(Buffer.alloc(2 + 2));

        // add version - 2 bytes - uint16
        bytes.writeUnsignedShort(this.version);

        // add method id - 2 bytes - uint16
        bytes.writeUnsignedShort(this.USER_ACTION_LAYER_TRANSFER);
        
        // dstTokenId - 2 bytes - uint16
        bytes.writeUnsignedShort(dstTokenId);

        // optional.. since we already know the source when received by the contract.. but hey.
        // srcTokenId - 2 bytes - uint16
        bytes.writeUnsignedShort(srcTokenId);

        // add layers
        bytes.writeBytes(Buffer.from(layer1));
        bytes.writeBytes(Buffer.from(layer2));
        bytes.writeBytes(Buffer.from(layer3));
        bytes.writeBytes(Buffer.from(layer4));
        bytes.writeBytes(Buffer.from(layer5));

        // add 0x start and return
        return "0x" + bytes.toString("hex"); // + data;
    }

    /** 
     * Decode Layer transfer data
     * @param binaryString string
     * @returns string
     */
     public decodeLayerTransfer(binaryString: string): any {

        // strip out 0x
        const cleanBinary = this.removeZeroX(binaryString);

        // convert the result to a byte array so we can process it
        const bytes: ByteArray = new ByteArray(
            Buffer.from(cleanBinary, "hex")
        );

        const result = {
            version: bytes.readUnsignedShort(),
            method_id: bytes.readUnsignedShort(),
            dstTokenId: bytes.readUnsignedShort(),
            srcTokenId: bytes.readUnsignedShort(),
            layer1: "",
            layer2: "",
            layer3: "",
            layer4: "",
            layer5: "",
        };

        for(let i = 1; i <= 5; i++) {
            // empty byte array
            const workBA = new ByteArray(2);
            // copy bytes into work area
            bytes.readBytes(workBA, 0, 2);
            // 
            result["layer"+i] = workBA.toString("binary");
        }

        return result;
    }

    public requires(condition: any, message: string) {
        if(!condition) {
            throw(message);
        }
    }

    /** 
     * Remove 0x from string then return it
     * @param string
     * @returns string
     */
    public removeZeroX(string: string): string {
        return string.replace("0x", "");
    }
}