
/*
 * source       https://github.com/ethercards/ec-util/
 * @name        EC
 * @package     ECUtil
 * @author      Micky Socaci <micky@galaxis.xyz>
 * @license     MIT
 */

import BN from 'bn.js';
import { IntArray } from "../interfaces/IntArray"

export default class Tools {

    public static lengthToUintEncoder(length: number): number {
        if(length <= 1) {
            return 1;
        } else {
            return parseInt((Math.log(length) / Math.log(2)).toString(), 10) + 1;
        }
    }

    public static stringSplitter(myString: string, chunkSize: number): any[] {
        let splitString: any = [];
        for (let i = 0; i < myString.length; i = i + chunkSize) {
            splitString.push(myString.slice(i, i + chunkSize));
        }
        return splitString;
    }

    public static NewIntArray(max:number): IntArray {
        return {
            DataCount: 1,
            bitPos: max,
            maxBits: max,
            Data: [ new BN(0) ],
        };
    }

    public static AddToIntArray(outputBuffer: IntArray, val: BN) {
        // let shift value by current position pointer
        const v1 = val.shln(outputBuffer.bitPos);
        outputBuffer.DataCount++
        let pos = outputBuffer.Data.length - 1;
        if(outputBuffer.bitPos + outputBuffer.maxBits < 256 ) {
            outputBuffer.Data[pos] = outputBuffer.Data[pos].add(v1);
            outputBuffer.bitPos = (outputBuffer.bitPos + outputBuffer.maxBits) % 256
            return
        }
        outputBuffer.Data[pos] = outputBuffer.Data[pos].add(
            v1.mod(
                new BN(1).shln(256)
            )
        );
        outputBuffer.Data.push(v1.shrn(256));
        outputBuffer.bitPos = (outputBuffer.bitPos + outputBuffer.maxBits) % 256;
    }

}