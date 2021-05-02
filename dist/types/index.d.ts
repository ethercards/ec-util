import Forge from "./ec/forge";
import ByteArray from "./utils/ByteArray";
declare global {
    interface Window {
        ecutil: any;
    }
}
export { Forge, ByteArray, };
