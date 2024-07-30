# spawn-process [![npm version][npm-badge]][npm-url] [![build status][circle-badge]][circle-url] [![coverage status][coverage-badge]][coverage-url]

Promise wrapper for `child_process.spawn`.

## Installation

```bash
npm install spawn-process
```

## Usage

`spawnProcess` will resolve with the stdout output or reject with the stderr.

<!-- snippet: ts,es6 -->
```js
import spawnProcess from 'spawn-process';

(async () => {
    const stdout = await spawnProcess('echo', ['Hello world']);
    console.log(stdout);
})();
```

### With spawn options

You can pass any options from `child_process.spawn`, for example piping inputs and outputs:

<!-- snippet: ts,es6 -->
```js
import spawnProcess from 'spawn-process';

(async () => {
    await spawnProcess('echo', ['Hello world'], {
        stdio: [process.stdin, process.stdout, process.stderr],
    });
})();
```

### With CommonJS / require()

<!-- snippet: js -->
```js
const spawnProcess = require('spawn-process');
spawnProcess('echo', ['Hello world']).then((stdout) => {
    console.log(stdout);
});
```

[npm-badge]: https://badge.fury.io/js/spawn-process.svg
[npm-url]: https://www.npmjs.com/package/spawn-process

[circle-badge]: https://circleci.com/gh/peterjwest/spawn-process.svg?style=shield
[circle-url]: https://circleci.com/gh/peterjwest/spawn-process

[coverage-badge]: https://coveralls.io/repos/peterjwest/spawn-process/badge.svg?branch=main&service=github
[coverage-url]: https://coveralls.io/github/peterjwest/spawn-process?branch=main
