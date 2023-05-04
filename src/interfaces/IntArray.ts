
/*
 * source       https://github.com/ethercards/ec-util/
 * @name        EC
 * @package     ECUtil
 * @author      Micky Socaci <micky@galaxis.xyz>
 * @license     MIT
 */

import BN from 'bn.js';
 
export interface IntArray {
    DataCount: number;
    bitPos: number;
    maxBits: number;
    Data: BN[];
}