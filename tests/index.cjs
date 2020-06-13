const assert = require('assert');
const assertStub = require('sinon-assert-stub');
const { Readable } = require('stream');
const sinonTest = require('sinon-mocha-test');

const spawnProcess = require('../build/wrapper.js');
const dependencies = spawnProcess.dependencies;

/** Creates a readable stream with specified data */
function createReadable(data) {
  let index = 0;
  return new Readable({
    read: function(size) {
      this.push(data.slice(index, index + size));
      index += size;
      if (index >= data.length) {
        this.push(null);
      }
    },
  });
}

/** Mock ChildProcess object for testing */
class MockChildProcess {
  constructor(succeeds, stdout, stderr) {
    this.events = {};

    if (stdout) {
      this.stdout = createReadable(stdout);
    }
    if (stderr) {
      this.stderr = createReadable(stderr);
    }

    setTimeout(() => this.events.close(succeeds ? 0 : 1), 10);
  }

  /** Mock event handler */
  on(event, callback) {
    this.events[event] = callback;
  }
}

const config = { useFakeTimers: false };

describe('utils/spawnProcess', () => {
  it('Resolves with stdout if the command succeeds', sinonTest.create(config, async (sinon) => {
    const childProcess = new MockChildProcess(true, 'stdout message', 'stderr message');
    const spawn = sinon.stub(dependencies, 'spawn').returns(childProcess);

    assert.strictEqual(await spawnProcess('command', ['action'], { shell: true }), 'stdout message');
    assertStub.calledOnceWith(spawn, ['command', ['action'], { shell: true }]);
  }));

  it('Resolves with stdout if the command succeeds without stdio', sinonTest.create(config, async (sinon) => {
    const childProcess = new MockChildProcess(true);
    const spawn = sinon.stub(dependencies, 'spawn').returns(childProcess);

    assert.strictEqual(await spawnProcess('command', ['action'], { shell: true }), '');
    assertStub.calledOnceWith(spawn, ['command', ['action'], { shell: true }]);
  }));

  it(
    'Resolves with stdout if the command succeeds with default arguments and options',
    sinonTest.create(config, async (sinon) => {
      const childProcess = new MockChildProcess(true, 'stdout message', 'stderr message');
      const spawn = sinon.stub(dependencies, 'spawn').returns(childProcess);

      assert.strictEqual(await spawnProcess('command'), 'stdout message');
      assertStub.calledOnceWith(spawn, ['command', [], {}]);
    },
  ));

  it('Rejects with stderr if the command fails', sinonTest.create(config, async (sinon) => {
    const childProcess = new MockChildProcess(false, 'stdout message', 'stderr message');
    const spawn = sinon.stub(dependencies, 'spawn').returns(childProcess);

    await assert.rejects(spawnProcess('command', ['action']), new Error('stderr message'));
    assertStub.calledOnceWith(spawn, ['command', ['action'], {}]);
  }));
});
