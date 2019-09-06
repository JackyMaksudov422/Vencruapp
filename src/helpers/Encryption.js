import { APP_KEY } from '../configs/app.config';
const encUtf8 = require('crypto-js/enc-utf8');
const AES = require('crypto-js/aes');

export const encrypto = (string) => 
{
  var encryptedString = AES.encrypt(JSON.stringify(string), APP_KEY);
  encryptedString = encryptedString.toString();
  return encryptedString;
}

export const decrypto = (encryptedString) => 
{
  try{
    var decryptedString = AES.decrypt(encryptedString, APP_KEY);
    decryptedString = decryptedString.toString(encUtf8);
    return JSON.parse(decryptedString);
  } catch(error){
      console.error(error);
    return null;
  }
}