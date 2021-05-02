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
        layer1: boolean,
        layer2: boolean,
        layer3: boolean,
        layer4: boolean,
        layer5: boolean
    ): string {

        this.requires(dstTokenId > 10 && dstTokenId <= 10000, "dstTokenId must be in range between 10 and 10000");
        this.requires(srcTokenId > 10 && srcTokenId <= 10000, "srcTokenId must be in range between 10 and 10000");
        this.requires(dstTokenId != srcTokenId, "dstTokenId must be different than srcTokenId");
        this.requires(this.isBoolean(layer1), "Layer1 length must be boolean");
        this.requires(this.isBoolean(layer2), "Layer2 length must be boolean");
        this.requires(this.isBoolean(layer3), "Layer3 length must be boolean");
        this.requires(this.isBoolean(layer4), "Layer4 length must be boolean");
        this.requires(this.isBoolean(layer5), "Layer5 length must be boolean");

        const bytes = new ByteArray(Buffer.alloc(2 + 2));

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

        for(let i = 1; i <= 5; i++) {
            result["layer"+i] = bytes.readBoolean();
        }

        return result;
    }

    public requires(condition: any, message: string) {
        if(!condition) {
            throw(message);
        }
    }

    public isBoolean(variable: boolean): boolean {
      return typeof variable === "boolean";
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