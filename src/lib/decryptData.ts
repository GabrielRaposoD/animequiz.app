import CryptoES from 'crypto-es';

const secret = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default';

export const decryptData = async (data: any) => {
  const decrypted = CryptoES.AES.decrypt(data, secret);

  return JSON.parse(decrypted.toString(CryptoES.enc.Utf8));
};
