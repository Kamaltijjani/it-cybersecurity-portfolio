"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { checkPassword } = require("./checker.cjs");
const cases = [
  [
    "",
    "Empty",
    0
  ],
  [
    "abc",
    "Weak",
    3
  ],
  [
    "Password123!",
    "Weak",
    12
  ],
  [
    "P@ssword123456789!",
    "Weak",
    18
  ],
  [
    "abababababababab",
    "Weak",
    16
  ],
  [
    "1234567890123456",
    "Weak",
    16
  ],
  [
    "violet-rain",
    "Fair",
    11
  ],
  [
    "violet river lantern cedar",
    "Longer candidate",
    26
  ],
  [
    "🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒",
    "Weak",
    16
  ]
];
for (const [index, [input, rating, length]] of cases.entries()) {
  test("example " + (index + 1) + ": " + rating, () => {
    const result = checkPassword(input);
    assert.equal(result.rating, rating);
    assert.equal(result.length, length);
    assert.ok(result.feedback.length > 0);
    assert.equal(Object.hasOwn(result, "password"), false);
  });
}
test("rejects non-string input", () => {
  for (const input of [null, undefined, 123, {}, []]) {
    assert.throws(() => checkPassword(input), TypeError);
  }
});
test("does not include a supplied secret in its result", () => {
  const secret = "unique-example-secret-483";
  assert.equal(JSON.stringify(checkPassword(secret)).includes(secret), false);
});
