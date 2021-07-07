import Forge from "./ec/forge";
import ByteArray from "./utils/ByteArray";
import BitArray from "./utils/BitArray";
declare global {
    interface Window {
        ecutil: any;
    }
}
export { Forge, ByteArray, BitArray };
