import BN from 'bn.js';
export interface IntArray {
    DataCount: number;
    bitPos: number;
    maxBits: number;
    Data: BN[];
}
