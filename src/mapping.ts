//@ts-ignore
import { BigInt, require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Block, Event, Address } from "@hyperoracle/zkgraph-lib";
import { bytes } from "@project-serum/anchor/dist/cjs/utils";

let addr = Bytes.fromHexString('0x90183Ca84c58e9126D2EE925715875c13d103962');
let esig_new_player = Bytes.fromHexString("0x52e92d4898337244a39bd42674ac561eadfd3959e947deec1c0ab82dd58b5a75");
let esig_add = Bytes.fromHexString("0x52e92d4898337244a39bd42674ac561eadfd3959e947deec1c0ab82dd58b5a75");
let esig_sub = Bytes.fromHexString("0x52e92d4898337244a39bd42674ac561eadfd3959e947deec1c0ab82dd58b5a75");
let esig_mul = Bytes.fromHexString("0x52e92d4898337244a39bd42674ac561eadfd3959e947deec1c0ab82dd58b5a75");
let esig_div = Bytes.fromHexString("0x52e92d4898337244a39bd42674ac561eadfd3959e947deec1c0ab82dd58b5a75");
let esig_mod = Bytes.fromHexString("0x52e92d4898337244a39bd42674ac561eadfd3959e947deec1c0ab82dd58b5a75");
let esig_min = Bytes.fromHexString("0x52e92d4898337244a39bd42674ac561eadfd3959e947deec1c0ab82dd58b5a75");
let esig_max = Bytes.fromHexString("0x52e92d4898337244a39bd42674ac561eadfd3959e947deec1c0ab82dd58b5a75");
let esig_sqrt = Bytes.fromHexString("0x52e92d4898337244a39bd42674ac561eadfd3959e947deec1c0ab82dd58b5a75");

export function handleBlocks(blocks: Block[]): Bytes {
  // init output state
  // let state: Bytes;
  let newPlayer: Address = Address.zero();


  // #1 can access all (matched) events of the latest block
  let events: Event[] = blocks[0].events;

  // #2 also can access (matched) events of a given account address (should present in yaml first).
  // a subset of 'events'
  let eventsByAcct: Event[] = blocks[0].account(addr).events;

  // #3 also can access (matched) events of a given account address & a given esig  (should present in yaml first).
  // a subset of 'eventsByAcct'
  let eventsByAcctEsig: Event[] = blocks[0].account(addr).eventsByEsig(esig_new_player)

  let calculated: BigInt = BigInt.zero();

  // Add 2 numbers
  let eventsByAcctEsigAdd: Event[] = blocks[0].account(addr).eventsByEsig(esig_add)

  if (eventsByAcctEsigAdd.length > 0) {
    
    calculated = add(eventsByAcctEsigAdd[0].topic1, eventsByAcctEsigAdd[1].topic2);
  }

  // Sub 2 numbers
  let eventsByAcctEsigSub: Event[] = blocks[0].account(addr).eventsByEsig(esig_sub)

  if (eventsByAcctEsigSub.length > 0) {
    
    calculated = sub(eventsByAcctEsigSub[0].topic1, eventsByAcctEsigSub[1].topic2);
  }

  // Mul 2 numbers
  let eventsByAcctEsigMul: Event[] = blocks[0].account(addr).eventsByEsig(esig_mul)

  if (eventsByAcctEsigMul.length > 0) {
    
    calculated = mul(eventsByAcctEsigMul[0].topic1, eventsByAcctEsigMul[1].topic2);
  }

  // Div 2 numbers
  let eventsByAcctEsigDiv: Event[] = blocks[0].account(addr).eventsByEsig(esig_div)

  if (eventsByAcctEsigDiv.length > 0) {
    
    calculated = div(eventsByAcctEsigDiv[0].topic1, eventsByAcctEsigDiv[1].topic2);
  }

  // Mod 2 numbers
  let eventsByAcctEsigMod: Event[] = blocks[0].account(addr).eventsByEsig(esig_mod)

  if (eventsByAcctEsigMod.length > 0) {
    
    calculated = mod(eventsByAcctEsigMod[0].topic1, eventsByAcctEsigMod[1].topic2);
  }

  // Min 2 numbers
  let eventsByAcctEsigMin: Event[] = blocks[0].account(addr).eventsByEsig(esig_min)

  if (eventsByAcctEsigMin.length > 0) {
    
    calculated = min(eventsByAcctEsigMin[0].topic1, eventsByAcctEsigMin[1].topic2);
  }

  // Max 2 numbers
  let eventsByAcctEsigMax: Event[] = blocks[0].account(addr).eventsByEsig(esig_max)

  if (eventsByAcctEsigMax.length > 0) {
    
    calculated = max(eventsByAcctEsigMax[0].topic1, eventsByAcctEsigMax[1].topic2);
  }

  // Sqrt 1 number
  let eventsByAcctEsigSqrt: Event[] = blocks[0].account(addr).eventsByEsig(esig_sqrt)

  if (eventsByAcctEsigSqrt.length > 0) {
    
    calculated = sqrt(eventsByAcctEsigSqrt[0].topic1);
  }
  
  // require match event count > 0
  require(eventsByAcctEsig.length > 0)
  
  // this 2 way to access event are equal effects, alway true when there's only 1 event matched in the block (e.g. block# 2279547 on sepolia).
  require(
    events[0].data == eventsByAcct[0].data
    && events[0].data == eventsByAcctEsig[0].data
    );
    
    
    // set state to the address of the 1st (matched) event, demo purpose only.
    
    let isNewPlayer = false;
    
    for (let i = events.length - 1; i >= 0; i--) {
      if (
        (events[i].address == addr) &&
        events[i].esig == esig_new_player
        ) {
          
          isNewPlayer = true;
        }
      }
      
      require(isNewPlayer);

      const destinationFunction = "0xc0406226".concat(calculated.toHex());


      // append the calculated value with the destination function hash
      const calculatedWithFunctionHash = Bytes.fromHexString(destinationFunction.concat(calculated.toHex()));
      
      return calculatedWithFunctionHash;
    }
    
    
    function add(a: Bytes, b: Bytes): BigInt {
      let aI = BigInt.fromBytes(a);
      let bI = BigInt.fromBytes(b);
      
      return aI.add(bI);
    }

    function sub(a: Bytes, b: Bytes): BigInt {
      let aI = BigInt.fromBytes(a);
      let bI = BigInt.fromBytes(b);
      
      return aI.sub(bI);
    }

    function mul(a: Bytes, b: Bytes): BigInt {
      let aI = BigInt.fromBytes(a);
      let bI = BigInt.fromBytes(b);
      
      return aI.mul(bI);
    }

    function div(a: Bytes, b: Bytes): BigInt {
      let aI = BigInt.fromBytes(a);
      let bI = BigInt.fromBytes(b);
      
      return aI.div(bI);
    }

    function mod(a: Bytes, b: Bytes): BigInt {
      let aI = BigInt.fromBytes(a);
      let bI = BigInt.fromBytes(b);
      
      return aI.mod(bI);
    }

    function min(a: Bytes, b: Bytes): BigInt {
      let aI = BigInt.fromBytes(a);
      let bI = BigInt.fromBytes(b);

      return aI.gt(bI) ? bI : aI;
      
    }

    function max(a: Bytes, b: Bytes): BigInt {
      let aI = BigInt.fromBytes(a);
      let bI = BigInt.fromBytes(b);
      
      return aI.gt(bI) ? aI : bI;
    }

    function sqrt(a: Bytes): BigInt {
      let aI = BigInt.fromBytes(a);
      
      return aI.sqrt();
    }


    