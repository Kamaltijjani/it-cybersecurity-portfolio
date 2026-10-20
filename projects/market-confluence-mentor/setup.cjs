"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
process.chdir(__dirname);
if(!fs.existsSync(".env")){
 const text=fs.readFileSync(".env.example","utf8").replace(/^MENTOR_API_KEY=$/m,"MENTOR_API_KEY="+crypto.randomBytes(32).toString("hex")).replace(/^N8N_ENCRYPTION_KEY=$/m,"N8N_ENCRYPTION_KEY="+crypto.randomBytes(32).toString("hex"));
 fs.writeFileSync(".env",text,{flag:"wx",mode:0o600});
 console.log("Created .env with unique secrets. Existing environments are never overwritten.");
}else console.log("Preserved existing .env.");
const env=Object.fromEntries(fs.readFileSync(".env","utf8").split(/\r?\n/).filter(l=>/^[A-Z_]+=/.test(l)).map(l=>{const i=l.indexOf("=");return [l.slice(0,i),l.slice(i+1).trim()];}));
if(!env.MENTOR_API_KEY||env.MENTOR_API_KEY.length<32)throw Error("Existing MENTOR_API_KEY is missing/too short. Review .env; do not change an existing n8n encryption key.");
fs.mkdirSync(".private",{recursive:true,mode:0o700});
fs.writeFileSync(path.join(".private","credentials.json"),JSON.stringify([{id:"mentor-local-key-v1",name:"Mentor local key",type:"httpHeaderAuth",data:{name:"X-Mentor-Key",value:env.MENTOR_API_KEY}}],null,2),{mode:0o600});
console.log("Next: docker compose up -d --build");
console.log("Open http://localhost:5678 and create the owner account, then: node import-n8n.cjs");
