
/*
 * source       https://github.com/ethercards/ec-util/
 * @name        EC
 * @package     ECUtil
 * @author      Micky Socaci <micky@galaxis.xyz>
 * @license     MIT
 */

import BN from 'bn.js';
import { IntArray } from "../interfaces/IntArray"
import { BigNumber } from '@ethersproject/bignumber';

export default class Tools {

    public static getReverseShiftedId = (id: number, event: any) => {
        let result = id;
        if (event) {
          result = this.reverseShift(id, event.shifts_by, event.start, event.end);
        }
        return result;
      };

    public static reverseShift = (tokenId: number, offset: number, start: number, end: number) => {
        let result = BigNumber.from(0);
        const token = BigNumber.from(tokenId);
        const offsetNumber = BigNumber.from(offset);
        const startNumber = BigNumber.from(start).add(1);
        const endNumber = BigNumber.from(end);
      
        if (token.lte(endNumber)) {
          const numInRange = token.sub(offsetNumber);
          if (numInRange.gte(startNumber) && numInRange.lte(endNumber)) {
            result = numInRange;
          } else {
            result = numInRange.add(endNumber).sub(startNumber).add(1);
          }
        }
      
        return Number(result.toString());
      };

    public static findRevealRangeForN(tokenId: number, reveals: any ) :number {
        for(let i = 1; i <= reveals.length; i++) {
            if(tokenId <= reveals[i].RANGE_END) {
                return i;
            }
        }
        return 0;
    }

    public static shiftAndFilterRevealedTokens(tokenJson: any, reveals: any): any {

        /*  REVEAL ITEM {
                REQUEST_ID: BigNumber {
                    _hex: '0x1a30fc3732a6fc76e884341677c816906ec53b702d0f95bdb92a059c8938dd7b',
                    _isBigNumber: true
                },
                RANDOM_NUM: BigNumber {
                    _hex: '0x1daa749bdd6e830903f8176b896faacd0e87988955f3ab3620bc3698afe1df8a',
                    _isBigNumber: true
                },
                SHIFT: BigNumber { _hex: '0x01', _isBigNumber: true },
                RANGE_START: BigNumber { _hex: '0x0f', _isBigNumber: true },
                RANGE_END: BigNumber { _hex: '0x12', _isBigNumber: true },
                processed: true
            }
        */

        const newJsonData: any = [];

        // 1. find the highest revealed token id
        const maxTokenId = reveals[ reveals.length - 1].RANGE_END;

        // 2. for each reveal that's been processed, copy data into reverse shifted id
        for(let y = 0; y < reveals.length; y++) {
            // make sure it's processed
            const thisReveal = reveals[y];
            if(thisReveal.processed) {
                for(let tokenId = Number(thisReveal.RANGE_START) + 1; tokenId <= Number(thisReveal.RANGE_END); tokenId++) {
                    const dataIndex = this.reverseShift(tokenId, thisReveal.SHIFT, thisReveal.RANGE_START, thisReveal.RANGE_END);
                    newJsonData[dataIndex] = tokenJson[tokenId - 1];
                    newJsonData[dataIndex].tokenId = dataIndex;
                }
            }
        }

        let sortedData = JSON.parse(JSON.stringify(newJsonData))
        if( sortedData[0]=== null || typeof sortedData[0] === "undefined") {
            sortedData.shift();
        }
        sortedData.sort(function (a: any, b: any): number {  return a.tokenId - b.tokenId;  });
        return [sortedData, Number(maxTokenId)];
    }

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