"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
test("authenticated service, durable deduplication and journal lifecycle",async(t)=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"mentor-test-")),key="t".repeat(64);
 const port=18000+Math.floor(Math.random()*10000);
 const child=spawn(process.execPath,["server.cjs"],{cwd:path.join(__dirname,".."),env:{...process.env,MENTOR_API_KEY:key,DATA_DIR:dir,PORT:String(port),BIND_HOST:"127.0.0.1",TRADINGVIEW_ADAPTER_URL:"",OPENAI_API_KEY:"",TELEGRAM_BOT_TOKEN:""},stdio:"pipe"});
 let startup="";
 child.stderr.on("data",x=>startup+=x);
 t.after(async()=>{child.kill();if(child.exitCode===null)await new Promise(resolve=>child.once("exit",resolve));fs.rmSync(dir,{recursive:true,force:true});});
 let ready=false;
 for(let i=0;i<100;i++){try{const r=await fetch("http://127.0.0.1:"+port+"/health");if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,50));}
 assert.ok(ready,startup);
 async function call(op,data={},token=key){const res=await fetch("http://127.0.0.1:"+port+"/"+op,{method:"POST",headers:{"Content-Type":"application/json","X-Mentor-Key":token},body:JSON.stringify(data)});return {status:res.status,body:await res.json()};}
 assert.equal((await call("status",{},"wrong")).status,401);
 assert.deepEqual((await call("performance")).body,{guaranteed:false,cohorts:[]});
 const req={requestId:"case-1",symbol:"BTCUSDT",venue:"BINANCE",product:"spot",strategy:"SMC",style:"day",send:false,monitor:false};
 const first=await call("analyse",req);
 assert.equal(first.body.status,"NO_TRADE");
 assert.equal(first.body.delivery.status,"not_requested");
 assert.match(first.body.reasons[0],/TradingView/);
 assert.deepEqual((await call("analyse",req)).body,first.body);
 assert.equal((await call("analyse",{...req,symbol:"ETHUSDT"})).status,400);
 assert.equal(Object.keys(JSON.parse(fs.readFileSync(path.join(dir,"state.json"))).watches).length,0);
 assert.equal((await call("entry",{id:"trade-1",mode:"paper",currency:"USD",strategy:"SMC",evidence:"Labelled manual test"})).status,200);
 assert.equal((await call("outcome",{id:"trade-1",grossPnl:20,costs:2,evidence:"Labelled test closure"})).status,200);
 assert.equal((await call("outcome",{id:"trade-1",grossPnl:100,costs:0,evidence:"Must not overwrite"})).status,400);
 assert.equal((await call("performance")).body.cohorts[0].netPnl,18);
 assert.equal((await call("entry",{id:"trade-2",mode:"live",currency:"USD",strategy:"SMC",evidence:"Missing confirmation"})).status,400);
 assert.equal((await call("telegram")).body.status,"blocked");
 assert.deepEqual((await call("observe")).body.observations,[]);
});
