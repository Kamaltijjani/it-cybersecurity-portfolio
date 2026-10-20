"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const {validateRequest,validateEvidence,performance,validateResearch}=require("./core.cjs");
const key=process.env.MENTOR_API_KEY;
if(!key||key.length<32)throw Error("Set MENTOR_API_KEY to at least 32 random characters.");
const dir=process.env.DATA_DIR||path.join(__dirname,"data");
fs.mkdirSync(dir,{recursive:true,mode:0o700});
const statePath=path.join(dir,"state.json");
let state=fs.existsSync(statePath)?JSON.parse(fs.readFileSync(statePath,"utf8")):{requests:{},trades:[],watches:{},telegramOffset:0,deliveries:{}};
function save(){const tmp=statePath+".tmp";fs.writeFileSync(tmp,JSON.stringify(state,null,2),{mode:0o600});fs.renameSync(tmp,statePath);}
function auth(value){const a=Buffer.from(value||""),b=Buffer.from(key);return a.length===b.length&&crypto.timingSafeEqual(a,b);}
function blockers(){
 return {tradingView:process.env.TRADINGVIEW_ADAPTER_URL?"configured, not yet verified":"missing permitted browser collector",research:process.env.OPENAI_API_KEY&&process.env.OPENAI_MODEL?"configured, not yet verified":"missing OPENAI_API_KEY or OPENAI_MODEL",telegram:process.env.TELEGRAM_BOT_TOKEN&&process.env.TELEGRAM_OWNER_CHAT_ID?"configured, not yet verified":"missing bot token or verified owner chat ID",whatsapp:"not implemented: permitted bridge required",signals:"research only; deterministic strategy rulebooks not implemented"};
}
async function post(url,body,headers={}){
 const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify(body),signal:AbortSignal.timeout(60000),redirect:"error"});
 if(!response.ok)throw Error("Upstream request failed with HTTP "+response.status);
 const data=await response.json();return data;
}
async function collect(r){
 const url=process.env.TRADINGVIEW_ADAPTER_URL;
 if(!url)throw Error("Missing permitted TradingView browser collector. No market-data API substitution is enabled.");
 const parsed=new URL(url);
 if(parsed.protocol!=="https:" && !(parsed.protocol==="http:"&&["localhost","127.0.0.1","tradingview"].includes(parsed.hostname)))throw Error("Browser adapter must use HTTPS or a local Docker address.");
 return post(url,{symbol:r.symbol,venue:r.venue,product:r.product,style:r.style},{Authorization:"Bearer "+(process.env.TRADINGVIEW_ADAPTER_KEY||"")});
}
const schema={type:"object",additionalProperties:false,properties:{
 status:{type:"string",enum:["NO_TRADE","WATCH"]},summary:{type:"string"},
 technical:{type:"array",items:{type:"string"}},fundamental:{type:"array",items:{type:"string"}},sentiment:{type:"array",items:{type:"string"}},
 counterarguments:{type:"array",items:{type:"string"}},missingEvidence:{type:"array",items:{type:"string"}},
 sources:{type:"array",items:{type:"object",additionalProperties:false,properties:{url:{type:"string"},observedAt:{type:"string"},claim:{type:"string"}},required:["url","observedAt","claim"]}}
},required:["status","summary","technical","fundamental","sentiment","counterarguments","missingEvidence","sources"]};
async function research(r,e){
 if(!process.env.OPENAI_API_KEY||!process.env.OPENAI_MODEL)throw Error("Research model credentials missing.");
 const response=await post("https://api.openai.com/v1/responses",{
  model:process.env.OPENAI_MODEL,store:false,max_output_tokens:3500,
  instructions:fs.readFileSync(path.join(__dirname,"AGENT.md"),"utf8"),
  tools:[{type:"web_search"}],
  text:{format:{type:"json_schema",name:"research",strict:true,schema}},
  input:JSON.stringify({request:r,evidence:e,currentTime:new Date().toISOString()})
 },{Authorization:"Bearer "+process.env.OPENAI_API_KEY});
 const text=(response.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("");
 const result=validateResearch(JSON.parse(text));
 const annotations=(response.output||[]).flatMap(x=>x.content||[]).flatMap(x=>x.annotations||[]).filter(x=>x.type==="url_citation");
 const allowed=new Set([e.sourceUrl,...annotations.map(x=>x.url)]);
 if(!result.sources.length||result.sources.some(s=>!allowed.has(s.url)))throw Error("Research sources lack tool citation provenance.");
 result.toolCitations=annotations;
 return result;
}
function chart(e,r){
 const frame=r.style==="day"?"M5":"H1",bars=e.candles[frame].slice(-60);
 const low=Math.min(...bars.map(b=>b.low)),high=Math.max(...bars.map(b=>b.high));
 const y=p=>350-(p-low)/(high-low||1)*290;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]));
 let svg='<svg xmlns="http://www.w3.org/2000/svg" width="960" height="420" viewBox="0 0 960 420"><rect width="960" height="420" fill="#101827"/><g fill="#e5e7eb" font-family="sans-serif"><text x="30" y="28">'+esc(r.venue+":"+r.symbol+" • "+frame+" • observed "+e.observedAt)+'</text>';
 svg+='<text x="30" y="400">Observed candles only. No confirmed trade or pattern annotation.</text></g>';
 bars.forEach((b,i)=>{const x=35+i*14,c=b.close>=b.open?"#34d399":"#fb7185";svg+='<path d="M '+x+" "+y(b.low)+" V "+y(b.high)+'" stroke="'+c+'"/><rect x="'+(x-4)+'" y="'+Math.min(y(b.open),y(b.close))+'" width="8" height="'+Math.max(1,Math.abs(y(b.open)-y(b.close)))+'" fill="'+c+'"/>';});
 return svg+"</svg>";
}
async function telegram(report){
 if(!process.env.TELEGRAM_BOT_TOKEN||!process.env.TELEGRAM_OWNER_CHAT_ID)return {status:"blocked",reason:"Telegram credentials/owner not configured"};
 const id=report.requestId;
 if(state.deliveries[id])return state.deliveries[id];
 // Mark before sending: uncertain sends are never automatically retried.
 state.deliveries[id]={status:"pending",at:new Date().toISOString()};save();
 try{
  const text=JSON.stringify({requestId:id,status:report.status,summary:report.summary,reasons:report.reasons,technical:report.technical,fundamental:report.fundamental,sentiment:report.sentiment,sources:report.sources,chart:report.chartPath,notice:"Research only; see authenticated /report for complete result."},null,2);
  const response=await post("https://api.telegram.org/bot"+process.env.TELEGRAM_BOT_TOKEN+"/sendMessage",{chat_id:process.env.TELEGRAM_OWNER_CHAT_ID,text:text.slice(0,3900)});
  if(response.ok!==true)throw Error("Telegram did not confirm delivery");
  state.deliveries[id]={status:"sent",messageId:response.result.message_id};
 }catch{state.deliveries[id]={status:"uncertain",reason:"Inspect your private chat before any manual retry."};}
 save();return state.deliveries[id];
}
async function analyse(input){
 const r=validateRequest(input),fingerprint=crypto.createHash("sha256").update(JSON.stringify(r)).digest("hex");
 const prior=state.requests[r.requestId];
 if(prior){
  if(prior.fingerprint!==fingerprint)throw Error("requestId already used with different input");
  return prior.report||{status:"NO_TRADE",requestId:r.requestId,reasons:["Previous request interrupted or still pending; use a new requestId after inspection."],delivery:state.deliveries[r.requestId]||null};
 }
 state.requests[r.requestId]={fingerprint,state:"pending",request:r,acceptedAt:new Date().toISOString()};save();
 let report={requestId:r.requestId,status:"NO_TRADE",createdAt:new Date().toISOString(),displayTimezone:"Africa/Lagos",reasons:[],guaranteed:false};
 try{
  const evidence=await collect(r),errors=validateEvidence(evidence,r);
  if(errors.length)report.reasons=errors;
  else{
   const result=await research(r,evidence);
   const file=r.requestId+".svg";fs.writeFileSync(path.join(dir,file),chart(evidence,r),{mode:0o600});
   report={...report,...result,evidence,chartPath:"/chart/"+file,
    actionability:"NOT_CONFIRMED: deterministic strategy rulebooks and cost/risk gates are not implemented",
    riskSizing:null,entry:null,stopLoss:null,targets:[],reasons:["Research-only build. WATCH is not a trading signal."]};
  }
 }catch(error){
  // Do not propagate provider bodies or tokens into logs/reports.
  report.reasons=[/^(Missing permitted|Research model|Browser adapter|Research sources)/.test(error.message)?error.message:"Evidence or research unavailable/invalid. No trade confirmed."];
 }
 if(r.monitor){state.watches[r.requestId]={request:{...r,send:false,monitor:false},expiresAt:r.expiresAt,lastObservation:null};report.monitoring="Registered for discrete follow-up checks; no continuous coverage.";}
 report.delivery=r.send?await telegram(report):{status:"not_requested"};
 report.whatsapp={status:r.send?"blocked":"not_requested",reason:"No permitted WhatsApp bridge implemented."};
 state.requests[r.requestId].report=report;state.requests[r.requestId].state="complete";save();
 return report;
}
async function pollTelegram(){
 if(!process.env.TELEGRAM_BOT_TOKEN||!process.env.TELEGRAM_OWNER_CHAT_ID)return {status:"blocked",reason:"Telegram bot and owner ID required."};
 const data=await post("https://api.telegram.org/bot"+process.env.TELEGRAM_BOT_TOKEN+"/getUpdates",{offset:state.telegramOffset,timeout:0,allowed_updates:["message"]});
 if(!data.ok)throw Error("Telegram polling failed");
 const results=[];
 for(const update of data.result){
  const m=update.message;
  if(m?.chat?.type==="private"&&String(m.chat.id)===process.env.TELEGRAM_OWNER_CHAT_ID&&String(m.from?.id)===process.env.TELEGRAM_OWNER_CHAT_ID){
   const parts=(m.text||"").trim().split(/\s+/);
   if(parts[0]==="/analyse"&&parts.length===5){
    const split=parts[1].split(":");
    if(split.length===2){
     try{results.push(await analyse({requestId:"telegram-"+update.update_id,venue:split[0],symbol:split[1],product:parts[2],strategy:parts[3],style:parts[4],send:true,monitor:false}));}
     catch{results.push({status:"invalid_request",updateId:update.update_id});}
    }
   }
  }
  state.telegramOffset=Math.max(state.telegramOffset,update.update_id+1);save();
 }
 return {processed:results.length,results};
}
async function observe(){
 const observations=[];
 for(const [id,watch] of Object.entries(state.watches)){
  if(Date.parse(watch.expiresAt)<=Date.now()){delete state.watches[id];continue;}
  const report=await analyse({...watch.request,requestId:"obs-"+crypto.randomUUID()});
  watch.lastObservation={at:new Date().toISOString(),status:report.status,reportId:report.requestId};
  observations.push({watchId:id,...watch.lastObservation,fillInference:"None; touches are not fills."});save();
 }
 return {observations,continuousCoverage:false};
}
async function route(endpoint,body){
 if(endpoint==="/status")return {status:"research-prototype",connections:blockers(),guaranteed:false};
 if(endpoint==="/analyse")return analyse(body);
 if(endpoint==="/telegram")return pollTelegram();
 if(endpoint==="/observe")return observe();
 if(endpoint==="/performance")return performance(state.trades);
 if(endpoint==="/journal")return {trades:state.trades};
 if(endpoint==="/report")return state.requests[body.requestId]?.report||{status:"not_found"};
 if(endpoint==="/entry"){
  if(!body||!/^[\w-]{1,80}$/.test(body.id||"")||!["paper","live"].includes(body.mode)||!["SMC","ICT","PRICE_ACTION"].includes(body.strategy)||!/^[A-Z]{3,10}$/.test(body.currency||"")||typeof body.evidence!=="string"||!body.evidence.trim()||body.evidence.length>4000)throw Error("Trade id, mode, strategy, currency and evidence required");
  if(body.mode==="live"&&body.userConfirmed!==true)throw Error("Live entry must be user-confirmed");
  if(state.trades.some(t=>t.id===body.id))throw Error("Trade id already exists");
  state.trades.push({id:body.id,mode:body.mode,strategy:body.strategy,currency:body.currency,evidence:body.evidence,userConfirmed:body.userConfirmed===true,enteredAt:new Date().toISOString()});save();return {status:"recorded",id:body.id};
 }
 if(endpoint==="/outcome"){
  const t=state.trades.find(t=>t.id===body.id);
  if(!t||t.closedAt)throw Error("Trade missing or already closed");
  if(!Number.isFinite(body.grossPnl)||!Number.isFinite(body.costs)||body.costs<0||typeof body.evidence!=="string"||!body.evidence.trim()||body.evidence.length>4000||t.mode==="live"&&body.userConfirmed!==true)throw Error("Finite grossPnl, nonnegative costs and closure evidence required; live closure needs user confirmation");
  Object.assign(t,{grossPnl:body.grossPnl,costs:body.costs,closureEvidence:body.evidence,closedAt:new Date().toISOString()});save();return {status:"closed",id:t.id};
 }
 throw Error("Unknown operation");
}
let queue=Promise.resolve();
const server=http.createServer(async(req,res)=>{
 const reply=(status,value)=>{res.writeHead(status,{"Content-Type":"application/json","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});res.end(JSON.stringify(value));};
 if(req.method==="GET"&&req.url==="/health")return reply(200,{ok:true});
 if(!auth(req.headers["x-mentor-key"]))return reply(401,{error:"Unauthorized"});
 if(req.method==="GET"&&/^\/chart\/[A-Za-z0-9_-]{1,80}\.svg$/.test(req.url)){
  const file=path.join(dir,req.url.slice(7));
  if(!fs.existsSync(file))return reply(404,{error:"Not found"});
  res.writeHead(200,{"Content-Type":"image/svg+xml","Content-Security-Policy":"default-src 'none'; style-src 'unsafe-inline'","Cache-Control":"no-store"});return res.end(fs.readFileSync(file));
 }
 if(req.method!=="POST")return reply(405,{error:"POST required"});
 let bytes=0,raw="";
 try{for await(const chunk of req){bytes+=chunk.length;if(bytes>262144)throw Error("Request too large");raw+=chunk;}}
 catch{return reply(413,{error:"Request too large or interrupted"});}
 let body;try{body=JSON.parse(raw||"{}");if(!body||Array.isArray(body)||typeof body!=="object")throw Error();}
 catch{return reply(400,{error:"JSON object required"});}
 const task=queue.then(()=>route(req.url,body));queue=task.catch(()=>{});
 try{reply(200,await task);}catch(error){reply(400,{error:/token|Bearer|sk-/.test(error.message)?"Request failed":error.message});}
});
server.requestTimeout=15000;
server.listen(Number(process.env.PORT||8080),process.env.BIND_HOST||"127.0.0.1",()=>console.log("Mentor ready; research only; inspect authenticated /status."));
