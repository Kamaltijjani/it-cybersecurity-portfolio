"use strict";

// Educational heuristic; not a breach check or security guarantee.
function checkPassword(password) {
  if (typeof password !== "string") throw new TypeError("Password must be a string.");
  const length = Array.from(password).length;
  if (!length) return { rating: "Empty", length: 0, feedback: ["Enter a password to check."] };
  const feedback = [];
  const normalized = password.toLowerCase().replace(/@/g, "a").replace(/0/g, "o").replace(/[1!]/g, "i").replace(/\$/g, "s");
  const common = /password|qwerty|letmein|welcome|admin|iloveyou/.test(normalized);
  const repeated = /^(.{1,4})\1+$/u.test(password);
  const sequence = /012345|123456|234567|345678|456789|abcdef|qwerty/i.test(password);
  if (length < 15) feedback.push("Try a longer password: at least 15 characters.");
  if (common) feedback.push("Avoid common words such as password, welcome, or admin.");
  if (repeated) feedback.push("Avoid repeating the same character or short pattern.");
  if (sequence) feedback.push("Avoid obvious keyboard or number sequences.");
  const predictable = common || repeated || sequence;
  const rating = length < 10 || predictable ? "Weak" : length < 15 ? "Fair" : "Longer candidate";
  feedback.push("Use a unique password for each account.");
  return { rating, length, feedback };
}

module.exports = { checkPassword };
