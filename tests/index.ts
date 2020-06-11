import * as assert from 'assert';
import assertStub from 'sinon-assert-stub';
import { Readable } from 'stream';
import sinonTest from 'sinon-mocha-test';

import spawnProcess, { dependencies } from '../src/index';

/** Creates a readable stream with specified data */
function createReadable(data: string) {
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
  public events: { [name: string]: (value: number | Error) => void } = {};
  public stdout?: Readable;
  public stderr?: Readable;

  public constructor(succeeds: boolean, stdout?: string, stderr?: string) {
    if (stdout) {
      this.stdout = createReadable(stdout);
    }
    if (stderr) {
      this.stderr = createReadable(stderr);
    }

    setTimeout(() => this.events.close(succeeds ? 0 : 1), 10);
  }

  /** Mock event handler */
  public on(event: string, callback: (value: number | Error) => void) {
    this.events[event] = callback;
  }
}

const config = { useFakeTimers: false };

describe('utils/spawnProcess', () => {
  it('Resolves with stdout if the command succeeds', sinonTest.create(config, async (sinon) => {
    const childProcess = new MockChildProcess(true, 'stdout message', 'stderr message');
    // tslint:disable-next-line: no-any
    const spawn = sinon.stub(dependencies, 'spawn').returns(childProcess as any);

    assert.strictEqual(await spawnProcess('command', ['action'], { shell: true }), 'stdout message');
    assertStub.calledOnceWith(spawn, ['command', ['action'], { shell: true }]);
  }));

  it('Resolves with stdout if the command succeeds without stdio', sinonTest.create(config, async (sinon) => {
    const childProcess = new MockChildProcess(true);
    // tslint:disable-next-line: no-any
    const spawn = sinon.stub(dependencies, 'spawn').returns(childProcess as any);

    assert.strictEqual(await spawnProcess('command', ['action'], { shell: true }), '');
    assertStub.calledOnceWith(spawn, ['command', ['action'], { shell: true }]);
  }));

  it(
    'Resolves with stdout if the command succeeds with default arguments and options',
    sinonTest.create(config, async (sinon) => {
      const childProcess = new MockChildProcess(true, 'stdout message', 'stderr message');
      // tslint:disable-next-line: no-any
      const spawn = sinon.stub(dependencies, 'spawn').returns(childProcess as any);

      assert.strictEqual(await spawnProcess('command'), 'stdout message');
      assertStub.calledOnceWith(spawn, ['command', [], {}]);
    },
  ));

  it('Rejects with stderr if the command fails', sinonTest.create(config, async (sinon) => {
    const childProcess = new MockChildProcess(false, 'stdout message', 'stderr message');
    // tslint:disable-next-line: no-any
    const spawn = sinon.stub(dependencies, 'spawn').returns(childProcess as any);

    await assert.rejects(spawnProcess('command', ['action']), new Error('stderr message'));
    assertStub.calledOnceWith(spawn, ['command', ['action'], {}]);
  }));
});
