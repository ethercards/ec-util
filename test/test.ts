import { Forge } from '../src';

import { BitArray } from '../src';


const forge = new Forge();

// example 2550 and 2551
// 4103836401
// a1a213d406
// 
// keep layers 1/2/3 from 2550
// add layers 4/5 from 2551
//
// user sends 2551 to forge and selects layers to be moved

const result = forge.encodeLayerTransfer(2550, 2551, false, false, false, true, true);
console.log("result:", result);

// result: 0x0001000109f609f734313033383364343036

const decoded = forge.decodeLayerTransfer(result);
console.log("decoded:", decoded);

// decoded: {
//     version: 1,
//     method_id: 1,
//     dstTokenId: 2550,
//     srcTokenId: 2551,
//     layer1: false,
//     layer2: false,
//     layer3: false,
//     layer4: true,
//     layer5: true
// }


const result2 = forge.encodeLayerTransfer(11, 20, true, true, true, true, true);
console.log("result2:", result2);


console.log( "Trait Data Encoding / Decoding");

const data = [
    0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 0, 0, 0, 0, 1, 1,
    1, 1, 1, 0, 0, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
];
let traitData = new BitArray(64);   // we don't store data for traits that don't exist on said token.. so expect to read only available
traitData.set(data);

console.log( "Array ->       ", traitData.toArray() );
console.log( "toKeyValue ->  ", traitData.toKeyValue() );
console.log( "toEnabled ->   ", traitData.toEnabled() );
console.log( "Hex ->         ", traitData.toHexString() );
console.log( "Binary ->      ", traitData.toBinaryString() );
