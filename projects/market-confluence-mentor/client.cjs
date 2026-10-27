"use strict";
const fs=require("node:fs"),path=require("node:path");
const envPath=path.join(__dirname,".env");
if(fs.existsSync(envPath))for(const line of fs.readFileSync(envPath,"utf8").split(/\r?\n/)){const match=line.match(/^([A-Z_]+)=(.*)$/);if(match&&!process.env[match[1]])process.env[match[1]]=match[2].trim();}
const operation=process.argv[2]||"status";
if(!["status","analyse","performance","journal","entry","outcome","report","observe","telegram"].includes(operation))throw Error("Unknown operation");
let payload=process.argv[3]?JSON.parse(fs.readFileSync(process.argv[3],"utf8")):{};
if(operation==="analyse")payload={...payload,requestId:payload.requestId||require("node:crypto").randomUUID()};
fetch("http://127.0.0.1:8080/"+operation,{method:"POST",headers:{"Content-Type":"application/json","X-Mentor-Key":process.env.MENTOR_API_KEY||""},body:JSON.stringify(payload),signal:AbortSignal.timeout(180000)}).then(async r=>{const body=await r.json();console.log(JSON.stringify(body,null,2));if(!r.ok)process.exitCode=1;}).catch(()=>{console.error("Could not reach the local mentor service. Check Docker and .env.");process.exitCode=1;});
