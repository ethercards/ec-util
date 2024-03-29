import BN from 'bn.js';
// import allTokenJson from "./data/grd.json";
import allTokenJson from "./data/450.json";
import tokenABI from "./abi/token.json";
import { BigNumber, ethers } from "ethers";
import axios from 'axios';

import { TokenCollectionSpecs, Side, Layer } from '../src/interfaces/TokenSpecs'
import { IntArray } from '../src/interfaces/IntArray'
import Tools from '../src/utils/Tools'
import TokenSpecs from '../src/ec/TokenSpecs'
import VisualTraits from '../src/ec/VisualTraits'
import { expect } from 'chai';
import dotenv from "dotenv";
// make sure to set your .env file
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
console.log("loading envFile:", envFile)
dotenv.config({ path: envFile })

const INFURA_ID = process.env.INFURA_API_KEY;


const VisualTraitRegistryABI = [{ "inputs": [{ "internalType": "address", "name": "_registry", "type": "address" }, { "internalType": "uint16", "name": "_traitId", "type": "uint16" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint8", "name": "traitSet", "type": "uint8" }, { "indexed": false, "internalType": "uint16", "name": "tokenId", "type": "uint16" }, { "indexed": false, "internalType": "uint256", "name": "newData", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "oldData", "type": "uint256" }], "name": "TraitsUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint8", "name": "traitSet", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "nwordPos", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "answer", "type": "uint256" }], "name": "WordFound", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint8", "name": "traitSet", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "wordPos", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "answer", "type": "uint256" }], "name": "WordUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint8", "name": "_side", "type": "uint8" }, { "indexed": true, "internalType": "uint16", "name": "_tokenId", "type": "uint16" }, { "indexed": false, "internalType": "uint256", "name": "_newData", "type": "uint256" }, { "indexed": false, "internalType": "uint8", "name": "dataLength", "type": "uint8" }], "name": "updateTraitEvent", "type": "event" }, { "inputs": [], "name": "CONTRACT_ADMIN", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ECRegistry", "outputs": [{ "internalType": "contract IECRegistry", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "traitSet", "type": "uint8" }, { "internalType": "uint256[]", "name": "traitData", "type": "uint256[]" }, { "internalType": "uint16", "name": "count", "type": "uint16" }], "name": "addMoreTraitsByWordStream", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "traitSetName", "type": "string" }, { "components": [{ "internalType": "uint8", "name": "len", "type": "uint8" }, { "internalType": "string", "name": "name", "type": "string" }], "internalType": "struct VisualTraitRegistry.definition[]", "name": "traitInfo", "type": "tuple[]" }], "name": "createTraitSet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "traitSet", "type": "uint8" }, { "internalType": "uint8", "name": "position", "type": "uint8" }, { "internalType": "uint16", "name": "tokenId", "type": "uint16" }], "name": "getIndividualTraitData", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "traitSet", "type": "uint8" }], "name": "getTraitNames", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "tokenId", "type": "uint16" }, { "internalType": "uint8", "name": "sideId", "type": "uint8" }, { "internalType": "uint8", "name": "layerId", "type": "uint8" }], "name": "getValue", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "tokenId", "type": "uint16" }, { "internalType": "uint8", "name": "sideId", "type": "uint8" }], "name": "getValues", "outputs": [{ "internalType": "uint8[]", "name": "response", "type": "uint8[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint16[]", "name": "tokenIds", "type": "uint16[]" }], "name": "getValues", "outputs": [{ "internalType": "uint8[][][]", "name": "response", "type": "uint8[][][]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "tokenId", "type": "uint16" }], "name": "getValues", "outputs": [{ "internalType": "uint8[][]", "name": "response", "type": "uint8[][]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "traitSet", "type": "uint8" }, { "internalType": "uint16", "name": "tokenId", "type": "uint16" }], "name": "getWholeTraitData", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }, { "internalType": "uint8", "name": "", "type": "uint8" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "layerPointers", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "name": "numberOfTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "numberOfTraitSets", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "name": "numberOfTraits", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "traitSet", "type": "uint8" }, { "internalType": "uint8", "name": "position", "type": "uint8" }, { "internalType": "uint16", "name": "tokenId", "type": "uint16" }, { "internalType": "uint256", "name": "newData", "type": "uint256" }], "name": "setIndividualTraitData", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "traitSet", "type": "uint8" }, { "internalType": "uint256[]", "name": "traitData", "type": "uint256[]" }, { "internalType": "uint16", "name": "count", "type": "uint16" }], "name": "setTraitsByWordStream", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "traitSet", "type": "uint8" }, { "internalType": "uint16", "name": "tokenId", "type": "uint16" }, { "internalType": "uint256", "name": "newData", "type": "uint256" }], "name": "setWholeTraitData", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "traitId", "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "name": "traitInfoLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "name": "traitSetNames", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }, { "internalType": "uint16", "name": "", "type": "uint16" }], "name": "visualTraitData", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }, { "internalType": "string", "name": "", "type": "string" }], "name": "visualTraitPositions", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }, { "internalType": "uint8", "name": "", "type": "uint8" }], "name": "visualTraits", "outputs": [{ "internalType": "uint8", "name": "start", "type": "uint8" }, { "internalType": "uint8", "name": "len", "type": "uint8" }, { "internalType": "string", "name": "name", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "name": "wordCount", "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }], "stateMutability": "view", "type": "function" }];




async function main() {

    const Specs: TokenCollectionSpecs = TokenSpecs.generateTokenCollectionSpecs(allTokenJson, false, true);

    // expect(Specs.SideCount).to.be.equal(2);
    // expect(Specs.sides[0].id).to.be.equal("0");
    // expect(Specs.sides[1].id).to.be.equal("1");
    console.log(JSON.stringify(Specs, null, 2));

    let provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/"+INFURA_ID);
    let pKey = ethers.Wallet.createRandom();
    const signer = new ethers.Wallet(pKey, provider);

    const TokenContract = new ethers.Contract("0x5f4E70899f64aB76B43517463aaE102bDf2F7D02", tokenABI, signer); 
    const TokenEverything = await TokenContract.tellEverything();

    const [StorableTokenJson, lastRevealedTokenId] = Tools.shiftAndFilterRevealedTokens(allTokenJson, TokenEverything.reveals);

    const visualUtils = new VisualTraits();
    console.log("origEncodedVisualLayerData");
    const origEncodedVisualLayerData = visualUtils.encodeVisualLayerData(allTokenJson, Specs, lastRevealedTokenId);
    console.log("shiftedEncodedVisualLayerData");
    const shiftedEncodedVisualLayerData = visualUtils.encodeVisualLayerData(StorableTokenJson, Specs, lastRevealedTokenId);

    const sideId = 0;
    console.log("lastRevealedTokenId", lastRevealedTokenId);
    console.log(origEncodedVisualLayerData[sideId].Data);
    console.log(shiftedEncodedVisualLayerData[sideId].Data);
    
    const _allMetadataURL = "https://app.dev.galaxis.xyz/450/1/metadata";
    let metadataAllJson: any = null;
    const _ipfsAllUrl = `${_allMetadataURL}/all`
    await axios.get(_ipfsAllUrl).then(res=>{
        console.log('all.json',`${_allMetadataURL}/all`);
        if(res && res.status===200){
            metadataAllJson = res.data;
        }
    }).catch(e=>{
        console.log('all json error',e);
        metadataAllJson = null;
    })

    const metadataShiftedEncodedVisualLayerData = visualUtils.encodeVisualLayerData(metadataAllJson, Specs, lastRevealedTokenId);
    console.log(metadataShiftedEncodedVisualLayerData[sideId].Data);

    console.log("VTR Check: orig", BigNumber.from(origEncodedVisualLayerData[sideId].Data[0].toString()).toString());
    console.log("VTR Check: int ", BigNumber.from(shiftedEncodedVisualLayerData[sideId].Data[0].toString()).toString());
    console.log("VTR Check: ext ", BigNumber.from(metadataShiftedEncodedVisualLayerData[sideId].Data[0].toString()).toString());


    // console.log("VTR Check: R1", BigNumber.from(origEncodedVisualLayerDataR1[sideId].Data[0].toString()).toString());
    // console.log("VTR Check: R2", BigNumber.from(origEncodedVisualLayerDataR2[sideId].Data[0].toString()).toString());
    // console.log("VTR Check: R3", BigNumber.from(origEncodedVisualLayerDataR3[sideId].Data[0].toString()).toString());

    for(let i = 0; i < lastRevealedTokenId; i++) {
        console.log("tokenId:", i);
        console.log("original: ", allTokenJson[i].tokenId, allTokenJson[i].image);
        console.log("shifted:  ", StorableTokenJson[i].tokenId, StorableTokenJson[i].image);
        console.log("metadata: ", metadataAllJson[i].tokenId, metadataAllJson[i].image);
    }
    
/*
tokenID: metadata/ 1  has data of id: 11
tokenID: metadata/ 2  has data of id: 12
tokenID: metadata/ 3  has data of id: 13
tokenID: metadata/ 4  has data of id: 14
tokenID: metadata/ 5  has data of id: 15
tokenID: metadata/ 6  has data of id: 1
tokenID: metadata/ 7  has data of id: 2
tokenID: metadata/ 8  has data of id: 3
tokenID: metadata/ 9  has data of id: 4
tokenID: metadata/ 10  has data of id: 5
tokenID: metadata/ 11  has data of id: 6
tokenID: metadata/ 12  has data of id: 7
tokenID: metadata/ 13  has data of id: 8
tokenID: metadata/ 14  has data of id: 9
tokenID: metadata/ 15  has data of id: 10

tokenID: metadata/ 16  has data of id: 18
tokenID: metadata/ 17  has data of id: 16
tokenID: metadata/ 18  has data of id: 17

tokenID: metadata/ 19  has data of id: 21
tokenID: metadata/ 20  has data of id: 19
tokenID: metadata/ 21  has data of id: 20
StorableTokenJson 0 is null
lastRevealedTokenId 21

[ '0x52 6e 92 51 46 85 26 45 6a 32 92 29 66 91 72 85 6d 2d 8e 66 52 00' ]
[ '0x52 6e 6d 51 46 92 92 29 66 91 72 85 6d 2d 8e 66 85 26 45 6a 32 00' ]
*/


    // const VisualLayersContract = new ethers.Contract("0x2EdB1c08aF924695cBb6C13ebb74CB423133a9bf", VisualTraitRegistryABI, signer); 


    // const sideId = 0;
    // // console.log(encodedVisualLayerData[sideId].Data);
    // const stream = VisualLayersContract.interface.encodeFunctionData("setTraitsByWordStream", [sideId, encodedVisualLayerData[sideId].Data, encodedVisualLayerData[sideId].DataCount])
    // // console.log(stream);

    // console.log("sideId", sideId, "encodedVisualLayerData[sideId].DataCount", encodedVisualLayerData[sideId].DataCount )


    // console.log("ESTIMATE: >>>>>>>")
    // const gasCostEstimate = await VisualLayersContract.estimateGas.setTraitsByWordStream(1, encodedVisualLayerData[sideId].Data, encodedVisualLayerData[sideId].DataCount);
    // console.log("gasEstimate:", gasCostEstimate.toNumber());


    // let tx = VisualLayersContract.setTraitsByWordStream(sideId, encodedVisualLayerData[sideId].Data, encodedVisualLayerData[sideId].DataCount);


    // 7737325

    // console.log(tx.hash);

    // VisualLayersContract

    //     const accounts = await ethers.getSigners();

    // console.log("[");
    // for(let i = 0; i < encodedVisualLayerData[sideId].Data.length; i++) {
    //     console.log(encodedVisualLayerData[sideId].Data[i]+",");
    // }
    // console.log("]");

    // [0x1582f3d0886e174b53821ba3ac6aab0c78f1f75999f221d0709aa95726c00000,0x8a0246d505d34725c989a488b6612a542eb2481857b8f2b2da533db540991248,0xa583b6824afb36f0800b87390689a3b6a4fb2c2624c1a1772920469e08764914,0x8d50a6a818274094b7c171e3205015262246a5af2729d0c4de881bed9cdaeb5a,0x14046ddd665094209427ab4b5a2182526b13c3685810c562ead02f12b14e72c3,0x61043b6464a1854ae99aca60b1b29bee6a05922cd73db7245b58afd471d896b4,0x7d8a1ccd4587619bb92f44ecfb625d63b0da68ddf76a06d416b7a036411711b1,0x8be6ac85431798321e08aa1a6ac386bb92a064f9ba4ee1b4b02afc98c018341,0x636dc9c6073874346391f6bcf4584814e8377594accf7e04c766ed1256098063,0x1515d66c20f50155c1d0a208f45814cd4dc5c206fd96c29ec3b64a9886d4194c,0x1cddb4a17018ecf6c60c4b083052b492a7bd1c2359ac9bea74fd7c70ae434bed,0xa939262c107aea6756496802e2c8de0036b0009929a4ae1b58c9548762526130,0xc54edad5c6ba40d107aee6af9c88f9050a59f3c5415a725ff45340367e87ae02,0x1592de8b642f8ec963413a1a90eb9820d59c86b3e24c90256992bc202fcc3887,0x468210db322a7b2ba359a822f51d37b2808af60554366acd2b202abb3ce86e2d,0x56e102074aed8dbc1b2c4270ed0f1c199a9f5241468b60735516c8e3098459cb,0xc1a010aba7d8710a7ed005dc5480a44c8452612ada0107a4816a02aac9af2852,0xd38715ab90ac083461a94000cfe1e0865048472f00001818e108c7cf953cd518,0x3dd4291ca4e1ec067801d0bc7b914a021a305733b4e89975a9112c60015c7156,0x40a20c2d02846120c6b563693720387886d82aa635bcc226c2b117d8e620a8c9,0xd1379cb2b5ef4fe9eaed66140beb08fd5e838e842382f1b20fba1bca6986af2c,0x572b156254a5308336c8592f9219e2151e489b2f4c8c166214f1ed8dba670a61,0x361482ab01ad16269054a0f3c75aaaea4ca771c12d0a22c5ce1c80c05c8a7344,0xc2316c39599d86a28cf8e879408dd9bc23c5adc21663714179984d92c563a8be,0xa289138523480549a722c88350002433468a685e8a2b549cb3616a17164bec45,0x98411b8abcb4cf7db0a7f2bc4b9945485a2abf4582620e3ab2828c6c0f492e91,0x81c178879522b86dd12ae44f5d54279021104cd6b8c0334b76039eaa707433aa,0x2a465b7b05ce8a33346a4db533c3a733e20336c901055aa4e01c210dac897b73,0x656a2b26810ce33b02c0d4575c23802155550687192fa56858b3618485cc1405,0xbc276b0aa8996652dcca62d1080494b3176450a128667193d0e2ca29dd00d9c1,0x79d016277204c069646f151c0332b98a458018e15b9f203060c6ba15418f896b,0xc590a422231a6c5d5d427aa8d124fa80dea3e6341cd06167b5fc06260c94eb2b,0xf2e0325e860fd552225bbe10e46b64dc096501a25344087b294b053b9d500b16,0xb326931ca073fb8c596c5066b5aa76d1a276ec85812856ccb4a04010d96f53a8,0x6ca881d529ea2240da1b0c14384225ac38c3b49eb4c8174dd663d84d4aa490f,0x9952d283a539780d46892529c8864d8899185da43b69a3a974311511f35f611e,0x8e592e4561a42464699abacbc5996036895e30e15cb014594b22a70e4d0d21db,0xb1781182916810df0d1618e66cb463110c18372b6c17a79c9d77469f3d31374,0x86802b74e07e649144e9eb9d223b5aa2970a97e5902c890186e8889b4f09df2c,0xf9f6eb32a31604b3916d628917517029e0b346b46ec72ee54306482900081547,0x31749aa9435a239f6a04172c65b8548e2c531bad0d352460a82a6685fc275c1c,0xcc12914bb0c9aa4ac7d616f8ab4e65a8a78768b7a892b8e2a162d94f11704a9a,0x9d1973c71619dd333d6ba260ad1028aa9af5da4cd7084d5dd924a89b7b016ab4,0x28a01d57c2a678b31e1d9a464b8446555d71db93b49b5161b419d793c8204eab,0x3a4a6d159db3bcb3aa6b8111a0584676188ab8c595b0a5fc1cd15a8621888063,0x2dbe064ac43905d1b01b7abd9e210ad1363416a05e76923ada909a4943f977a1,0x2aea44da9fa841ce8994d2c04519c2af0e6a5e95eae0c3782950062a311dde1,0x3e94971c9eacf503605c0a2801eca453220a8a7d4ca89a183d90528ac4c242da,0xb345a20a72dd4c326b080c71d57b0c8f98e55615888644b6095a3b1781a1f14b,0xe8953342d007bb884964fb2dd462d7457e28cade81c384dca04ad157305bac3,0x6dc138e1df0a8cd1cd88d4f104aed3afc10d03e6093cb7112208b407906bd7c7,0xc3c6bc6cf6c100f12a604175f0410ad40113c1bdc3bf7b9af5c775ea023f1544,0x535178e2d3ac206a0d4db41242f077a99e8a61d21943dac6332a39978570a8a9,0x843c62b874dbb5cb68bfa49008ed46c31635349a757f31d0534572c8af680b2f,0x99cba2ab7778e90f68201827c568e38a255312ca7281cc10da8e8c324b03523d,0x6a5b4223663be45700450f1254770d21be5739095a82e0ded333274e8359a329,0x2a76c2b8180b94863bb189bb13ec909642264672388284f54cde5154cd879699,0x22ba75d8d340a81417764a828274c7ce0d15979326a5c69fbe29094ed5eb0724,0x5648729c49a8b1128620728d545705b3c1a384196b5b7a9995c158e064af4948,0x33131166b4a908960212d625597b498ac97dd2d09b51a416b431689c0ce3acad,0xc7f0eadc4ada84d82a16c2301ed768d1ab48010d610dca4424b69c0fc6dc40eb,0xba41961a157167b51245cebb20281a00f024a0080a6a9b61da5d541c662e9e8d,0x84c612c64d792c8d42a90b638db2b8ac9aa6d856603060c218d16fa9d8f56451,0x364a9aadc8668dbc576d2ce50f05c12a0c2375270daa3dfd762c5bc9755c9c69,0x26afa66c00d8112c445b896c80bc47a42a554ec802214f0d16d122272c978884,0x3105a55a77e38731706ca9cc288b9e57c84f0212909fa6019a977653aeaaa811,0xab574a80413ad6ce86d634687c024fdc3d15a59e0767c28996020d3e23d19edd,0xd1576005f7d41df6542cd2372482a6029193085487708828948a5996d55c3bcc,0xbad2c13a2ca08288963825a948a542be09b44024f4a226b0682c495170006614,0xcd3e8142608db884287ebaa0c74808691ecc31b84b044ee30e82c7a6b1b7a300,0xf499c3841ae15aa9dc630c52ab16c1342da49d20053b3c54539b044b023f4d4a,0x931142461f1a0123bf14a0804c15163191598019295a703f33f41c1a3401ed99,0xeae3653d31ae0d1aa441868a88eaaa2ec5bb3834ee5420932c9c2b92c3a09934,0x1ae546581043f78219e12b530384697278d1a48e2414d51c77739762eb1fc402,0x14cc181923d933e6b6948d11a606a233bf43944c06387395aa11f9056a00d6e8,0x5de1373e15750092ecc3b0180090648dc512021d90a61d2027955c6570ac58eb,0x9f15b41c1e9a960e55010b95a02b244389234b412515a1ab00a652d14ac44fd5,0x50b8707d15e1c21d8716bd00f3973dc406d68567926aed3044359a4622b4e8e9,0x446277675d3852aaade1e9ad5137534175401f078411b864c9325e29c5454689,0x4956200aa7e11cd4cc1d51d1e8d36c7688135134589c1d66d33e96b1c309485d,0xa417ae0a9e32275e586b436f69b6d2414226e197895429321369ae148aa0b761,0x244d48d764934db023b5bb75c316264e8529f925e051e8886d5d50e8858b102f,0x20ed971305b0558a6077a4c25b70d97d8afd00e44b01226424a6b939f3d90a49,0x2b79a12d56fa2266b2722b6918c10c193870e74748900fa035bd23414d74e403,0xf26e26428b025c256ea6b0f0e4bc18e511153658d5522b14c87eb367ae95f854,0x5cec29512aba0908c2c957ce353adfac0543f08d706d20bb0cb1cf66b84998d0,0xf04b3f49f6327ed1c6c44a43fc8e3827ad127280db78d980ac1c3ad3dc4d64a0,0xf7011d0a35a86204b1d50f8632974dc0b048720831992d6277876ac4f422b612,0x874425115e91e3cc2bb30789d54a591e0275d52bb32000280a42a4078e74d1c8,0xfb7a2e024bf25b0a4010c740b5a67084aa6e0a6b454d18790b36002070560b6a,0xc6f969a65c60566a8311130335f22383981b33170ab9e6cb1c50999618561d62,0x14024357149786227520488909d0d10e9e01582954620592a6bc00050c4c75c2,0x158a864356b7882f103d46c22ad80e0d456a92917250bac02461077ebd635512,0xce040dfa12612cd107788c35df74f492047d7a2c0cf5926d5483b8e215600a07,0x1d8a8d913074a55aec96525229abd7344a040869e8ab9d5074249d452cd81867,0x1d21056430b06551ea92aad9342bb810b96c00001998d04a527a9148fe2a1f1e,0xe9501ccedaab0a53d736b4286aac86d3b7347a980944fd7a62b042096a142895,0x43631bc8ae3151602e420ba25846698cd21b1ca3461b2d4e9c43519a7c34c90c,0xa9d118390ac9080ad0af2556ad721e88368a00b59963dc73ab4a90c967a52a3,0xbee7d0c4fc20a73973d7349d8153e63d08e53d6caa2fd836d32124203a087cb0,0x81459cd40886a83100806266a7a2c7927409b291b904eb80c0d712ea6e3bb2af,0xe472d4298c398b7406cf4a1df3465105948a5330b72238f4718b9a75f65939b3,0x4a0630c8b82ad9a34c73a74d9c2569d630527446a3c1814cf443ac537217ee50,0xcb26b11247a01c1d360f165dc725a83a4d0746685103438a6e7f6c93ab21ddd4,0x6571d45d3265a13e18cb531cbaf35b4c6a87ca1959cd9b523357d312abe1141a,0x29eaceaed4289535fb14b677c9d6c8a2db1c3242b14a94df7810ac2b572462d,0xa992446113b5a98aece8d5645874a992d4318c126881022dd6b65cfcceac086c,0x12b7388d1b9d08b5c80e3ab81d45520fa7b334eb52f562e52db5fd2eb8967046,0x58b5a27605ee41022a548145ec2ab74009208a7c05b7c2c149d17e1323023a99,0x8940135fc41064055565a852269b30dd50780dc981681da63a28766a9dad4fac,0xd528c2d5ce151f0b43a7ac674c00864b52b40b455060d3b214294adae172664d,0xd2b0008bb8ab7802d023309f53a85b4b08341334338e8180c42ac89e5096203d,0xd2156d19c74a0483eb8d6528de319e0caa6a6b97cab1f0543f929aabb179d1e1,0x5544cfb6a1519e1a3d22d851d0622c2c69c4d8d9e48c9ac088c662dbed465931,0xc25d1e0405703b4362de5057b83b2c0d40a236d42d7d2eb146c8ce110909a924,0xa77118d2da23c6eada37074ce957456bf947189bc25ab982e72d7b916774d851,0x6158d4109f2f89a0491573870e582dc6f832e9ce2dc7926cab70a1092016a470,0x1168046882314eea2ad8a1eb0f3922f6f700dc35ddbf02f3289259efc2dda9c7,0x64aba0db3ddaaabe3b05ab9b79c12ba04c648c1a07a3b9518b6aa22d71094a7c,0xd0bf41eba4095983b0ce6b9b234236920ca509d32a82f905156e4a1096fa34ba,0x6d4ae93280e51e12118a1502f3abc0180982052288959aa8d0ad5e37b7ab3831,0x320ee56c94b21b12db6a99e74ab581df88f861508ad6b2d89a9146de303bd583,0xf9e25e7483ec0351aa02dd1ae74f5859108c8803242318e9877540948fd6a9e2,0x78f92aaf2265f2bf4fdc0f063a436c0d2aba695b782f2f9695522d4adac78119,0x3436929769015d18302c50e5ae08b38dda2ea3924dae5697120023ebaf1cfae3,0x4ab9d74783d984656cd405a98a934b8076128f2999d44652aac1ac09d85b2a8c,0x90029b181af59c66c43da6ac2374331ac6236429ab386a2426ae02b174da1443,0x6aa14bbcd02f1a2ab985c113870e8d80ab51697b69df8976a011381119bc52a1,0xfb6dce2dd70c2a9800396f70959d826044e92c9d0d29d6ae2b78638d5530d219,0xb96b48d92313b053a08e4279092d82605b9e4d90e9122529d98b0263da04ea47,0xa8547533be2843aecace6fe1e460a9829e3390062465d41d54350d06a9c0b31d,0x8589da9d7836d37669d4c4ce886b4d69f9070cacedd896b4d5ac77b468a7412,0x7037205ce39821d2e9e6847a3460056a7bda5b9d8c04bd81ab9be9ae1a3d7c3b,0x2340b30495899a7940f01a5dfbbe4c64d877281091a95d0bc861296b942d5a0,0x7007d4faf26cb48c74f78ad8ef1b84f6120aae6462ce1412578e96082e011081,0xb508a5b772289194726cd05b3c07581a0258d3a8587bc04a8d0ae22015d33b3c,0x9605e06dce04402995a6b6b002de4c2a847018211cee187e008c1c2ddc24f5b0,0xa2d5e8075d2ae8c56c0bb43d014aafc27297304c6b15931c690fa098c4446f41,0xcfce30a7eb9e78ce63997252b682b8aec40ee3223502c9d0020590173a90274d,0x291814b61aa1d676903500aafb19a70ca5f0ad84d49cc96d71ce8f2c32e2f939,0x49b6760b115d80c0bcd61a2c8c1c68a2022ab43b4676ac10362758086d49a845,0x6382576ab54c517c15ae8818820cb7c4837309b8642f4a2609a91da0a16e0a70,0x980497571eb497088a30d51f31bba12dcc71a37a1d8b96f22ab13473d6d62426,0x5539760b940eb2f59db162d3c49f05cc5482a421a5a0bb54c37e049e894575b1,0xe159dd0d2a05d44b02f7d12525b5e05c2834820a4199e1633ae065598b705e9b,0xf46cc7801299159447985b2df582299fa5c3154c1aa4c99d92c871c6bee816c4,0xdc1c38908be294d45b29055c87010f55b01895f8c5ca625132c4f92224c735f8,0xdb524a415774697476398c188e12b02e76d48d9cc278a8536beaa75808d0e0d2,0x5546775548d3810245503cb9cb8942035e0a14456582d996102d8cf50412b50f,0x2accc2a01417ec1cf5db974e1a65eb7f32290691cc735b8ed5cdd88dfb232462,0x89d8203b68d8e26aaf5b3438651a8cfea514268b1315d3292d6438178f44e201,0x55c7e34d58c09126cab7036c8b6dcd76dac25345ab43a30000de864c73c504b4,0x54126b40d068002f180e59631f480a475c04f3652d75ceaf16dbf38239d22b5e,0x5300c0ec2d420a0955a8f357653b9a2feb5508793c8a9aa15b62b65ed12ac60,0x50408014ec189ac8c7262ae90c9724d28f3534f4c0739af0e13ed126de10cb6,0x51f032bbaa470a55888ac9691c5a82b76cb231345329b60b545ac0aeb90608cf,0x3d58168a0ab2104a72e8ee96a531d41a0ca520645408875eb491ba25c5448a78,0xd3ca3d9c217a7db0edaacdd1265635d44815d35ba528cb937b39b7ee2045f58e,0x4f724f460868435ec910a08302995f55ec3ca5294799c6c414de8e0747d8c458,0xb5620931c37a2ad6d7adb6d594f681429e7581ca40c42012ea4045c01df8e8b3,0x14262e0a94ae5ef097708810b1deb05769a70672e9db4829c29a215767b5acf4,0x5ab9b71ed1c4b4a76b2060ccc57f0048dcf4a260b0f8509598b234940a225af5,0x73b88880f20091b1a7df5bbb40057f01249e52c745c2350c2cc1c3113dcd47e1,0x2e8050df72a0a614c618549ab3c4870a849290ec611fd245cb26aeb9b41edcf8,0x230c313092923bb3b34fc96f4f49834381047a24c08e71252d5ab5daba1a8d52,0xe5a38c68282d86b01cef334a4a625e94695eae82a2d1b6cc28d8e57896046214,0x5cee6167209b394d9178305b19cbf3c489612ba76ea8ef49054ae39b1c74a112,0x20ee5775306d2aab460c48b5628e9e482d373349ca122836e032dbf984089be8,0x3a9df3ba06458a434dd490be6208699cc1e10589fa8da66859cb90e30a91302a,0x2a82688ec2aad68644101a01f3254b2b37b3bb31331bde4540395666cfc30d7,0x226ba770b431a1552ba4dc10d811f58631eeb373eb4ebb5a2f10bcfc0c347c10,0xe82d09f53d7e4b4c1306e2b08bb4c944113af7e4460bc2b9bab671c08e3203a3,0x7a55ccf9b192391428ca6b38f6a11599f285bc29e91d5aab5d402d14ab437d2b,0xb35be983871cb22822c3350494940a8b08421e2b1b084980acf22619f0a0c040,0x322d9614e361b418cdc0ba5018a25aa946a2786e151c1322511cc736b0de8b65,0x6484ac053682032f4ab52a08c14866aeeb00ae72612a96a2a09cdaa5b0a1ba8b,0x9c8660a7287e1c00514a39e645c26b4dcf3e06ec465de686881e2f5d819b3553,0xbda803142855c8a4b40c2ed682c72403464c46ed2eb08e360b5d8cea40b34a28,0x4dbab532da925118271b69499128a8030e20224e545a365620709ddc65673c74,0xc23d964b00e5a8e210711b862495e1697977ea61c25652aca84c814e6491cf3,0x88df49e71ef823ce920b42c13232705d80953d70f2ee6f8ee476a8b9b6770b69,0xbad9a8856fa42c68d1ac0ac746b8c88faa16abc20d9e553394c83450dd0a292a,0xe2f9a13851f3dab2e9ce93eef3d4503c7431aa163018dd1c6725717cd15a3504,0x168174ceb008f8b433a0262a99100b53a38059a45f79557015e0ce4482698148,0x9512cf483b5192f99d5a531880406958a891e85b55253e78b4335dfb52bf5c17,0x6d79972c3583dc05a0ac5019a983f2a7a4976ffa2802160adc6acd595b72e6ee,0xf5f7c37c80ec721ab452bbd109b5414da7cc01ebc05f84b4ed555282a3a08970,0x8602c5436809cc907956455ad3066b7765d554bb06033dc0c0a00d2df44102dc,0xcc110e2859817384c77001772c826d102466bb80c10aaad93368d62b5610021a,0x9dfb1548f8282798f564009b0aaa53623269a23428d980b8f7dc12dbca267021,0x298c060c5e700674d0a456ea86646a466ebe892795ed02cb68c183096578c446,0x18b49c7dba854d8545766e046e05897ad3a98835b0d6ea405f3486057894f44f,0xb12c0a4d01554a632c6836a8ba0bed497693ab04ea668196a4715f26b36828a1,0x4e522a0b8abe660a6a1d56c51db32c96a556c5cb66a4f030b73daa60eea58ec6,0x9eb62e291206a7086a3b2e7b58326715ac96b05c9172507ef8841f7ac6d3700c,0x470e0db7626e0c5704863db60596d04000a59c9cd13391867014425c3ecbd654,0x790a5b3e0cb4a69c881400786828264813e57ed94059566207615a490b114aaf,0x56440a74dab5ed202c0a086ab4af62660d34b4239486e84b6afc6f280a38a21a,0xcb5db595f728af1cf2e29dbb265ca449f688bc496dc85cf08486dd89a72e6332,0x5eb56a112ae4a588a2abd7a512716f4158184ca6f4906b11854ccd9e24f0d6f6,0x143670188fcc8ee36d090044835e9a22b0bac35761a858e0c6cd7823206b7aa9,0xec7203043508ac954b8c18f6939437a665360926ea54cfdd46490d082e1485d2,0x2660c08394a9531eaba829cb0d0188a4a22088cabe3072d1e6fdd0da4a098fa4,0x20165a4021696889e691383c09e85ee30cc5d85882a1ae29b251517521871895,0xb4bc1953873e18a057489622e2731b516e0aac04e281684d5be14a58fdc29a85,0x5a21a56ba8638b0af9ad9171020ce2671829341965140d8be921e3d654747a34,0x15d490606a6a30c6eaf9db54741666aac820c39abaa52a48b4490f0f0092cc55,0x3441644c2a8505a463c14c6b2b8d42d6d8b46971f73d881e2e029b271cf1369d,0x55e6825039f0d4129332456890d04e86a1644d13d02bb0953795ae24e2cab789,0x2f01c285dcafa9d49302eb96437241cd5ee8f325a859f2de83d8ea6d15f26b3d,0x63614eaa992540c9a150324d306b855d25f426b369cb5c0aa23abc1935e3301,0xb052967a672967d2625c32507396b6db84641fba7dd68bbb41c36e8ab2563940,0x88989eb4442600044e1aba7adae01311781ace916401e436537a8c211eb66213,0x6e968e5f29d1203c1a56670a1dabacb0fb272a5657548a0eab66337051a50e91,0x2bb82cb12d10d1951c0dc580ca4ee1ae527935de4145cb849ea35415067ae3a8,0x49ecaaa2f330574646371cba7ba2a62da8a316218c200dcd925e82c5574c79d1,0xc55c59b150803340b23ad7ce9f680a452eda24267a990f08d1222dc971fa86af,0x185cb3c091274179b099319000b9067a6094a0186be004775b3e2535daa5bb2a,0xbeac1261a5f802b196c76c236922af352066e00d55cc6e1aadd700600a47d0ba,0xf2af56cbca38ad09d65b61f4c20ee888a6824875c2b82951d70228e22bed991c,0x69151da0cb3c068d493979158bb29b2b4d1973955e94451f9f76e8c609f250b,0xa43c1cb61aac5b22a47027f654fd89803274478c4ab4d2672de5871e8cd068d4]

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });