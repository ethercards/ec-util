import { Forge } from '../src';

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