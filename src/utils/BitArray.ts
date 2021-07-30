import bitwise from 'bitwise'
import { BigNumber } from "@ethersproject/bignumber";
import { arrayify } from "@ethersproject/bytes";

export default class BitArray {

    public length:number;
    public backingArray: Uint8Array;
    public offset:number;

    constructor(length: number, offset: number = 0) {
        this.length = Math.ceil(length/8);
        this.backingArray = Uint8Array.from({length: this.length}, ()=>0)
        this.length = this.length * 8;
        this.offset = offset;
    }

    public set(array: any ) {
        for(let i = 0; i < array.length; i++) {
            if(array[i] == 1) {
                this.on(i);
            }
        }
    }

    public get(n: number) {
        return (this.backingArray[n/8|0] & 1 << n % 8) != 0;
    }

    public on(n: number) {
        this.backingArray[n/8|0] |= 1 << n % 8;
    }

    public off(n: number) {
        this.backingArray[n/8|0] &= ~(1 << n % 8);
    }

    public toggle(n: number) {
        this.backingArray[n/8|0] ^= 1 << n % 8;
    }

    forEach(callback: any) {
        this.backingArray.forEach((number, container) => {
            const max = container == this.backingArray.length-1 && this.length%8 ? this.length%8 : 8;
            for(let x=0; x<max; x++) {
                callback((number & 1<<x)!=0, 8*container+x)
            }
        })
    }

    public toHexString(keepZeros?: boolean) {
        let startZeros = 0;
        const max = this.backingArray.length;
        for(let i = 0; i < max; i++) {
            if(this.backingArray[i] === 0) {
                startZeros++;
            } else {
                i = max;
            }
        }
        const bn = BigNumber.from(this.backingArray);
        let hexString = bn.toHexString();
        if(startZeros === 0) {
            return hexString;
        } else if (bn.eq(0)) {
            if(!keepZeros) {
                return "0x00";
            } else {
                let finalString = "0x";
                for(let i = 0; i < startZeros; i++) {
                    finalString+= "00";
                }
                return finalString;
            }
        }

        hexString = hexString.replace("0x", "");
        
        let finalString = "0x";
        for(let i = 0; i < startZeros; i++) {
            finalString+= "00";
        }
        finalString+= hexString;
        return finalString;
    }

    public toEnabled(): any {
        return this.toKeyValue(true);
    }

    public toKeyValue(onlyTrue:boolean = false): any {
        const retVal = {};
            this.forEach(( value: boolean, index: number ) => {
                if(onlyTrue) {
                    if(value) {
                        retVal[index + this.offset] = value;
                    }
                } else {
                    retVal[index + this.offset] = value;
                }
            });
        return retVal;
    }

    public toArray() {
        const retVal: Array<any> = [];
            this.backingArray.forEach(uint8 => {
                retVal.push(uint8)
            });
        return retVal;
    }

    public toBinaryString(spacer: string = ' ') {
        let results: Array<string> = [];
        this.backingArray.forEach(uint8 => {
            let result: string = "";
            for(let j = 0; j < 8 ; j++) {
                result += bitwise.integer.getBit(uint8, j);
            }
            results.push(result);
        })

        return results.join(spacer);
    }

    public static fromHexString(data: string, offset?: number) {
        const Uint8Array = arrayify(data);
        const BA = new BitArray(Uint8Array.length * 8, offset);
        for(let i = 0; i < Uint8Array.length; i++) {

            for(let j = 0; j < 8 ; j++) {
                const pos = (i * 8) + j;
                const bit = bitwise.integer.getBit(Uint8Array[i], j);
                if(bit === 1) {
                    BA.on(pos);
                }
            }
        }
        return BA;
    }

    public static fromUint8Array(data: Array<any>, offset?: number) {
        if(data.length === 0) {
            data = [0];
        }
        const Uint8Array = arrayify(data);
        const BA = new BitArray(Uint8Array.length * 8, offset);
        for(let i = 0; i < Uint8Array.length; i++) {

            for(let j = 0; j < 8 ; j++) {
                const pos = (i * 8) + j;
                const bit = bitwise.integer.getBit(Uint8Array[i], j);
                if(bit === 1) {
                    BA.on(pos);
                }
            }
        }
        return BA;
    }
    
}