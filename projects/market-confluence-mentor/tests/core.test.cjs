"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {validateRequest,validateEvidence,performance,validateResearch}=require("../core.cjs");
const request={requestId:"test-1",symbol:"BTCUSDT",venue:"BINANCE",product:"spot",strategy:"SMC",style:"day"};
function fixture(now){
 const durations={W1:604800000,D1:86400000,H4:14400000,H1:3600000,M15:900000,M5:300000};
 return {provider:"TradingView",collectionMethod:"permitted-browser",symbol:"BTCUSDT",venue:"BINANCE",product:"spot",sourceUrl:"https://www.tradingview.com/chart/example/",observedAt:new Date(now).toISOString(),price:101,candles:Object.fromEntries(Object.entries(durations).map(([frame,ms])=>[frame,Array.from({length:20},(_,i)=>({closedAt:new Date(now-(20-i)*ms).toISOString(),closed:true,open:100,high:103,low:98,close:101}))]))};
}
test("delivery and monitoring default off",()=>{assert.equal(validateRequest(request).send,false);assert.equal(validateRequest(request).monitor,false);});
for(const patch of [{strategy:"other"},{style:"scalp"},{symbol:""},{venue:""},{product:""},{requestId:"../../x"},{send:"false"},{monitor:true}]){
 test("reject malformed request "+JSON.stringify(patch),()=>assert.throws(()=>validateRequest({...request,...patch})));
}
test("missing adapter blocks evidence",()=>assert.equal(validateEvidence(null,request).length,1));
test("valid labelled fixture passes structural checks, not provenance verification",()=>{const now=Date.now();assert.deepEqual(validateEvidence(fixture(now),request,now),[]);});
test("stale observations rejected",()=>{const now=Date.now(),e=fixture(now);e.observedAt=new Date(now-300000).toISOString();assert.ok(validateEvidence(e,request,now).length);});
test("future observations rejected",()=>{const now=Date.now(),e=fixture(now);e.observedAt=new Date(now+60000).toISOString();assert.ok(validateEvidence(e,request,now).length);});
test("wrong instrument rejected",()=>{const now=Date.now(),e=fixture(now);e.symbol="ETHUSDT";assert.ok(validateEvidence(e,request,now).length);});
test("open candles rejected",()=>{const now=Date.now(),e=fixture(now);e.candles.M5[19].closed=false;assert.ok(validateEvidence(e,request,now).length);});
test("impossible OHLC rejected",()=>{const now=Date.now(),e=fixture(now);e.candles.M5[19].low=500;assert.ok(validateEvidence(e,request,now).length);});
test("missing timeframe rejected",()=>{const now=Date.now(),e=fixture(now);delete e.candles.W1;assert.ok(validateEvidence(e,request,now).length);});
test("empty performance",()=>assert.deepEqual(performance([]),{guaranteed:false,cohorts:[]}));
test("paper/live/currency groups separated and costs deducted",()=>{
 const rows=[["paper","USD",12,2],["paper","USD",-3,1],["live","USD",5,1],["paper","NGN",200,10]].map(([mode,currency,grossPnl,costs],i)=>({mode,currency,strategy:"SMC",grossPnl,costs,closedAt:new Date(1700000000000+i*1000).toISOString()}));
 const cohorts=performance(rows).cohorts;
 assert.equal(cohorts.length,3);assert.equal(cohorts[0].netPnl,6);assert.equal(cohorts[0].expectancy,3);assert.equal(cohorts[0].profitFactor,2.5);assert.equal(cohorts[0].realisedClosedTradeDrawdown,4);assert.equal(cohorts[0].sampleSize,2);
});
test("open entries excluded",()=>assert.equal(performance([{mode:"paper"}]).cohorts.length,0));
test("malformed or actionable model output rejected",()=>{assert.throws(()=>validateResearch({}));assert.throws(()=>validateResearch({summary:"x",status:"BUY"}));});
module.exports={fixture,request};
