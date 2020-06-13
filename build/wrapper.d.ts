import spawnProcess, { dependencies } from './es5/index';
declare const spawnProcessWrapper: typeof spawnProcess & {
    dependencies: typeof dependencies
};
export = spawnProcessWrapper;
