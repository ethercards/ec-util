import { TokenCollectionSpecs } from '../interfaces/TokenSpecs';
import { IntArray } from '../interfaces/IntArray';
export default class VisualTraits {
    encodeVisualLayerData(tokenJson: any, tokenSpecs: TokenCollectionSpecs, _howManyTokens?: number | string): IntArray[];
}
