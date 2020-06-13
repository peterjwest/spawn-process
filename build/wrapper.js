const spawnProcess = require('./es5/index.cjs');
module.exports = Object.assign(
    spawnProcess.default,
    { dependencies: spawnProcess.dependencies },
);
