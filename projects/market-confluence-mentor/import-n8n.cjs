"use strict";
const {spawnSync}=require("node:child_process");
const fs=require("node:fs");
process.chdir(__dirname);
if(!fs.existsSync(".private/credentials.json"))throw Error("Run node setup.cjs first.");
function run(args){const r=spawnSync("docker",args,{stdio:"inherit",shell:false});if(r.error)throw r.error;if(r.status!==0)throw Error("Docker command failed; no automatic retry.");}
run(["compose","cp",".private/credentials.json","n8n:/tmp/mentor-credentials.json"]);
run(["compose","cp","workflows","n8n:/tmp/mentor-workflows"]);
try{
 run(["compose","exec","-T","n8n","n8n","import:credentials","--input=/tmp/mentor-credentials.json"]);
 run(["compose","exec","-T","n8n","n8n","import:workflow","--separate","--input=/tmp/mentor-workflows"]);
}finally{
 run(["compose","exec","-T","n8n","rm","-f","/tmp/mentor-credentials.json"]);
}
console.log("Imported four separate inactive workflows. Open 04 Journal and run its manual check.");
