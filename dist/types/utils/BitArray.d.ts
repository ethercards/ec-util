export default class BitArray {
    length: number;
    backingArray: Uint8Array;
    constructor(length: number);
    set(array: any): void;
    get(n: number): boolean;
    on(n: number): void;
    off(n: number): void;
    toggle(n: number): void;
    forEach(callback: any): void;
    toHexString(): string;
    toArray(): any[];
    toBinaryString(spacer?: string): string;
    static fromHexString(data: string): BitArray;
    static fromUint8Array(data: Array<any>): BitArray;
}
