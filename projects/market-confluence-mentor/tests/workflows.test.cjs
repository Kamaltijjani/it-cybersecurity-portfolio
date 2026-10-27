"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
test("four inactive workflows have valid connected node names and authenticated HTTP operations",()=>{
 const folder=path.join(__dirname,"..","workflows"),names=fs.readdirSync(folder).filter(x=>x.endsWith(".json"));assert.equal(names.length,4);
 for(const filename of names){
 const w=JSON.parse(fs.readFileSync(path.join(folder,filename)));
 assert.equal(w.active,false);
 const nodes=new Set(w.nodes.map(n=>n.name));
 for(const [name,connections] of Object.entries(w.connections)){
 assert.ok(nodes.has(name));for(const branch of connections.main)for(const edge of branch)assert.ok(nodes.has(edge.node));
 }
 for(const node of w.nodes.filter(n=>n.type==="n8n-nodes-base.httpRequest"))assert.equal(node.credentials.httpHeaderAuth.id,"mentor-local-key-v1");
 }
});
