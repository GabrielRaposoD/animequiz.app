import { createDecipheriv, scrypt } from 'crypto';

import { promisify } from 'util';

const secret = process.env.ENCRYPTION_KEY || 'default';

export const decryptData = async (data: Buffer) => {
  data = Buffer.from(data);
  const iv = data.subarray(0, 16);
  data = data.subarray(16);
  const key = (await promisify(scrypt)(secret, 'salt', 32)) as Buffer;
  const decipher = createDecipheriv('aes-256-ctr', key, iv);
  const result = Buffer.concat([decipher.update(data), decipher.final()]);
  return JSON.parse(result.toString());
};
