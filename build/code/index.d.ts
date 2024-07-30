import { spawn, SpawnOptions } from 'child_process';

declare const dependencies: {
    spawn: typeof spawn;
};
/** Spawns a process resolving with the stdout */
declare function spawnProcess(command: string, args?: string[], options?: SpawnOptions): Promise<string>;

export { spawnProcess as default, dependencies };
