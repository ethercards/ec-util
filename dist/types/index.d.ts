import Forge from "./ec/forge";
import Registry from "./ec/registry";
import ByteArray from "./utils/ByteArray";
import BitArray from "./utils/BitArray";
declare global {
    interface Window {
        ecutil: any;
    }
}
export { Forge, Registry, ByteArray, BitArray };
