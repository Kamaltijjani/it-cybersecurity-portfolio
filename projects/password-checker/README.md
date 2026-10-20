# Password Check
A small, dependency-free JavaScript project for learning password validation and unit testing.

## Features
- Reports length, a simple rating, and improvement suggestions.
- Flags some common words, sequences, and repeating patterns.
- Counts Unicode code points rather than UTF-16 code units.
- Runs locally: no network requests, analytics, file storage, or password logging.

## Run
Install Node.js 18 or newer, download or clone this repository, and open a terminal in this folder:

```sh
node demo.cjs
node --test checker.test.cjs
```

No npm install is needed. The demo checks four built-in example strings; it does not prompt for a real password.

## Use in your own JavaScript
```js
const { checkPassword } = require("./checker.cjs");
const result = checkPassword("an-example-for-learning");
console.log(result.rating);
console.log(result.feedback);
```

Use demonstration values while learning. Do not commit real passwords to source code.

## How it works
Empty input returns **Empty**. Fewer than 10 characters or a detected predictable pattern returns **Weak**. Lengths 10–14 without a detected pattern return **Fair**. Longer inputs return **Longer candidate**.

This is an educational heuristic, not a production strength estimator. It uses a small pattern list, does not check breached credentials or estimate cracking time, and can miss predictable passwords. A longer candidate is not a guarantee of security. Length counts code points, which may differ from visible character counts for combined emoji or accents.

## Files
- `checker.cjs` — reusable checking function.
- `demo.cjs` — runnable examples.
- `checker.test.cjs` — Node.js tests.

## Verification
Core checks were executed in a JavaScript runtime, including empty input, common substitutions, repeated patterns, sequences, passphrases, Unicode, and invalid input. The Node.js CLI and native test runner were not executed in the creation environment.
