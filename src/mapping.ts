//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Block, Event, Address } from "@hyperoracle/zkgraph-lib";

let addr = Bytes.fromHexString('0x90183Ca84c58e9126D2EE925715875c13d103962');
let esig_new_player = Bytes.fromHexString("0x52e92d4898337244a39bd42674ac561eadfd3959e947deec1c0ab82dd58b5a75");

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

  return Bytes.fromHexString("c0406226").padEnd(32);
}
