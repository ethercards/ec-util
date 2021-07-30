# @ethercards/ec-util
EtherCards JS/TS Utils Library

## 1. Layer Forge 

### - encodeLayerTransfer

User sends 2551 to forge and selects layers to be moved

```
import { Forge } from "@ethercards/ec-util";
const forge = new Forge();
const result = forge.encodeLayerTransfer(2550, 2551, false, false, false, true, true);

// 0x0001000109f609f734313033383364343036
```

### - decodeLayerTransfer

0x0001000109f609f734313033383364343036

```
import { Forge } from "@ethercards/ec-util";
const forge = new Forge();
const data = forge.decodeLayerTransfer("0x0001000109f609f734313033383364343036");

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
```

## 2. Traits Registry

```
import { Registry } from "@ethercards/ec-util";

const onChainUint8Result = [3, 16, 255]; // 96 traits
const registry = new Registry();
const traits = registry.decodeTraits(onChainUint8Result);


```


### Preparing data to be stored
```
import { BitArray } from "@ethercards/ec-util";

const data = [
    0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 0, 0, 0, 0, 1, 1,
    1, 1, 1, 0, 0, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
];
let traitData = new BitArray(64);   // we don't store data for traits that don't exist on said token.. so expect to only get available ones

traitData.set(data);

console.log( "Array ->       ", traitData.toArray() );
console.log( "toKeyValue ->  ", traitData.toKeyValue() );
console.log( "toEnabled ->   ", traitData.toEnabled() );
console.log( "Hex ->         ", traitData.toHexString() );
console.log( "Binary ->      ", traitData.toBinaryString() );
```

