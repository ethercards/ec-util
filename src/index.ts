/*
 * source       https://github.com/ethercards/ec-util/
 * @name        ECUtil
 * @package     ECUtil
 * @author      Micky Socaci <micky@ether.cards>
 * @license     MIT
 */

import Forge from "./ec/forge";
import ByteArray from "./utils/ByteArray";
import BitArray from "./utils/BitArray";


declare global {
    interface Window { ecutil: any; }
}

if (typeof window !== 'undefined') {
    window.ecutil = window.ecutil || {};
    window.ecutil.Forge = Forge;
    window.ecutil.ByteArray = ByteArray;
    window.ecutil.BitArray = BitArray;
}

export {
    Forge,
    ByteArray,
    BitArray
};
