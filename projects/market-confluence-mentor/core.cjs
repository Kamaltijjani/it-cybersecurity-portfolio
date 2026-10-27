"use strict";
function validateRequest(r) {
  if (!r || typeof r !== "object" || Array.isArray(r)) throw new Error("Request must be an object");
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(r.requestId || "")) throw new Error("requestId required (letters, digits, _ or -)");
  for (const key of ["symbol","venue","product"]) if (typeof r[key] !== "string" || !/^[A-Za-z0-9:._/-]{1,80}$/.test(r[key])) throw new Error("Exact " + key + " required");
  if (!["SMC","ICT","PRICE_ACTION"].includes(r.strategy)) throw new Error("Choose SMC, ICT or PRICE_ACTION");
  if (!["day","swing"].includes(r.style)) throw new Error("Choose day or swing");
  for (const flag of ["send","monitor"]) if (r[flag] !== undefined && typeof r[flag] !== "boolean") throw new Error(flag + " must be boolean");
  if (r.monitor && (!Number.isFinite(Date.parse(r.expiresAt)) || Date.parse(r.expiresAt) <= Date.now() || Date.parse(r.expiresAt)>Date.now()+7*86400000)) throw new Error("Monitoring expiry must be in the next 7 days");
  return {...r,send:r.send===true,monitor:r.monitor===true};
}

function validateEvidence(e, r, now = Date.now()) {
  if (!e || e.provider !== "TradingView" || e.collectionMethod !== "permitted-browser") return ["A connected, permitted TradingView browser collector is required."];
  const errors = [];
  for (const key of ["symbol","venue","product"]) if (e[key] !== r[key]) errors.push("Market identity mismatch: "+key);
  const observed = Date.parse(e.observedAt);
  if (!Number.isFinite(observed) || now-observed>120000 || observed>now+5000) errors.push("Market observation missing, stale, or future dated.");
  if (!Number.isFinite(e.price) || e.price<=0) errors.push("Missing valid observed market price.");
  if (!/^https:\/\/(www\.)?tradingview\.com\/chart\//.test(e.sourceUrl || "")) errors.push("TradingView chart source URL required.");
  const frames=r.style==="day"?["W1","D1","H4","H1","M15","M5"]:["W1","D1","H4","H1"];
  const durations={W1:7*86400000,D1:86400000,H4:14400000,H1:3600000,M15:900000,M5:300000};
  for(const frame of frames){
    const bars=e.candles?.[frame];
    if(!Array.isArray(bars)||bars.length<20||bars.length>1000){errors.push("20–1000 closed candles required: "+frame);continue;}
    let last=-Infinity;
    for(const b of bars){
      const t=Date.parse(b.closedAt);
      if(!Number.isFinite(t)||t<=last||t>now||b.closed!==true||![b.open,b.high,b.low,b.close].every(x=>Number.isFinite(x)&&x>0)||b.low>Math.min(b.open,b.close)||b.high<Math.max(b.open,b.close)||b.low>b.high){errors.push("Invalid or unclosed candle: "+frame);break;}
      last=t;
    }
    if(now-last>durations[frame]+120000) errors.push("Latest closed candle stale: "+frame);
  }
  return errors;
}

function performance(trades) {
  const groups=new Map();
  for(const t of trades.filter(x=>x.closedAt)){
    const key=JSON.stringify([t.mode,t.currency,t.strategy]);
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(t);
  }
  return {guaranteed:false,cohorts:[...groups].map(([key,items])=>{
    items.sort((a,b)=>Date.parse(a.closedAt)-Date.parse(b.closedAt));
    const vals=items.map(x=>x.grossPnl-x.costs),n=vals.length;
    const wins=vals.filter(x=>x>0),losses=vals.filter(x=>x<0);
    const total=vals.reduce((a,b)=>a+b,0),profit=wins.reduce((a,b)=>a+b,0),loss=-losses.reduce((a,b)=>a+b,0);
    let equity=0,peak=0,drawdown=0;
    for(const v of vals){equity+=v;peak=Math.max(peak,equity);drawdown=Math.max(drawdown,peak-equity);}
    const p=wins.length/n,z=1.96,den=1+z*z/n,center=(p+z*z/(2*n))/den,margin=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/den;
    const [mode,currency,strategy]=JSON.parse(key);
    return {mode,currency,strategy,sampleSize:n,netPnl:total,winRate:p,winRate95Wilson:[center-margin,center+margin],averageWin:wins.length?profit/wins.length:null,averageLoss:losses.length?-loss/losses.length:null,expectancy:total/n,profitFactor:loss?profit/loss:null,profitFactorNote:loss?null:"Undefined: no losses",realisedClosedTradeDrawdown:drawdown};
  })};
}

function validateResearch(x) {
  if(!x||typeof x.summary!=="string"||!["NO_TRADE","WATCH"].includes(x.status))throw new Error("Invalid research status");
  for(const k of ["technical","fundamental","sentiment","counterarguments","missingEvidence"]) if(!Array.isArray(x[k])||!x[k].every(v=>typeof v==="string"))throw new Error("Invalid research field: "+k);
  if(!Array.isArray(x.sources)||!x.sources.every(s=>typeof s.url==="string"&&/^https:\/\//.test(s.url)&&typeof s.claim==="string"&&Number.isFinite(Date.parse(s.observedAt))))throw new Error("Invalid research sources");
  return x;
}
module.exports={validateRequest,validateEvidence,performance,validateResearch};
