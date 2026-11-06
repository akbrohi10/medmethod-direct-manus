import { createHash } from 'node:crypto';
import { openSync, readSync, fstatSync, closeSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '../..');
export function readCareScopeFile(path: string): string {
  const fd = openSync(resolve(root, path), 'r');
  try {
    const buf = Buffer.alloc(fstatSync(fd).size);
    let n = 0;
    while (n < buf.length) { const count = readSync(fd, buf, n, buf.length - n, n); if (!count) break; n += count; }
    return buf.subarray(0, n).toString('utf8');
  } finally { closeSync(fd); }
}
export const removedV2CareSection = JSON.parse(readCareScopeFile('server/fixtures/v2RemoveCareSection.json')) as {
  baseline: string; path: string; old: string; anchor: string;
};
export function inverseRemovedV2CareSection(path: string, source: string): string {
  const f = removedV2CareSection;
  if (createHash('sha256').update(JSON.stringify(f)).digest('hex') !== 'f6e120b999c6344bc1ef4a7856b33083acedda5f3aa140ea8d3bffda2b5ce472') throw Error('Unexpected care-section removal packet');
  if (path !== f.path) return source;
  const count = source.split(f.old).length - 1;
  if (source.split(f.anchor).length - 1 !== 1 || count > 1) throw Error('Unexpected care-section source count');
  return count === 1 ? source : source.replace(f.anchor, f.old + f.anchor);
}
