"use strict";
const { checkPassword } = require("./checker.cjs");

// Public demonstration values only. Never put real passwords in source code.
const samples = ["abc", "Password123!", "violet-rain", "violet river lantern cedar"];
for (let index = 0; index < samples.length; index++) {
  const result = checkPassword(samples[index]);
  console.log("\nExample " + (index + 1) + ": " + result.rating + " (" + result.length + " characters)");
  for (const tip of result.feedback) console.log("  - " + tip);
}
