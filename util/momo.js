// utils/momo.js
const crypto = require('crypto');
const NodeRSA = require('node-rsa');

const MOMO_PARTNER_CODE = 'MOMO';
const MOMO_ACCESS_KEY = 'F8BBA842ECF85';
const MOMO_SECRET_KEY = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const MOMO_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----'; // Add your actual public key here

const iv = Buffer.alloc(16, 0); // Initialization vector

function encryptToken(data) {
  const encipher = crypto.createCipheriv('aes-256-cbc', MOMO_SECRET_KEY, iv);
  const buffer = Buffer.concat([encipher.update(data), encipher.final()]);
  return buffer.toString('base64');
}

function decryptToken(data) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', MOMO_SECRET_KEY, iv);
  const buffer = Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]);
  return buffer.toString();
}

function generateSignature(params, secretKey) {
    const rawSignature = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
  }

function encryptData(jsonData) {
  const key = new NodeRSA(MOMO_PUBLIC_KEY, { encryptionScheme: 'pkcs1' });
  return key.encrypt(JSON.stringify(jsonData), 'base64');
}

module.exports = {
  encryptToken,
  decryptToken,
  generateSignature,
  encryptData,
  MOMO_PARTNER_CODE,
  MOMO_ACCESS_KEY,
  MOMO_SECRET_KEY,
};
