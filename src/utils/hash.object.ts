import { MerkleTree } from 'merkletreejs';

import { SHA256, enc } from 'crypto-js';

export class ObjectHasher {
  static async hashObject(input: Object): Promise<string> {
    let hashes: Array<any> = [];
    for (const property of Object.keys(input)) {
      const hash = await ObjectHasher.countObjectPropertyHash(
        property,
        input[property],
      );
      hashes.push(hash);
    }
    hashes.sort((a, b) => a - b);

    for (let i = 0; i < hashes.length; i++) {
      hashes[i] = SHA256(hashes[i]);
    }

    return new MerkleTree(hashes, SHA256).getRoot().toString('hex');
  }

  static async countObjectPropertyHash(
    key: string,
    value: string,
  ): Promise<number> {
    const target = key + '.' + value;
    const result = parseInt(SHA256(target).toString(enc.Hex), 16);
    return result;
  }
}
