export default class BitArray {
    length: number;
    backingArray: Uint8Array;
    offset: number;
    constructor(length: number, offset?: number);
    set(array: any): void;
    get(n: number): boolean;
    on(n: number): void;
    off(n: number): void;
    toggle(n: number): void;
    forEach(callback: any): void;
    toHexString(keepZeros?: boolean): string;
    toEnabled(): any;
    toKeyValue(onlyTrue?: boolean): any;
    toArray(): any[];
    toBinaryString(spacer?: string): string;
    static fromHexString(data: string, offset?: number): BitArray;
    static fromUint8Array(data: Array<any>, offset?: number): BitArray;
}
