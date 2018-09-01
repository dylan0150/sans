# TS-SCRIPT

## Motivation

Polyfilling/transpiling down code results in much slower, uglier code. Better to instead load the correct version of code based on support

## Installation

```npm
npm install sans-js
```

```html
<script src="/path/to/ts-script/lib/ts-script.js"></script> <!-- DEV -->
<script src="/path/to/ts-script/lib/ts-script.min.js"></script> <!-- PRODUCTION -->
```

## Usage

1. Write your code in typescript.

2. Transpile your typescript down to .es3.js, .es5.js, .es6.js, .es2016.js, .es2017.js, .es2018.js

3. Include a `<ts-script src="myfile.ts"></ts-script>`