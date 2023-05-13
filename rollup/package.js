import { readFile } from 'node:fs/promises';

const pkg = await readFile('./package.json');

export const  version = pkg.version;
