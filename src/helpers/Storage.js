import { encrypto, decrypto } from "./Encryption";

export const storageStore = function (KEY_NAME, data) {
  return localStorage.setItem(KEY_NAME,  encrypto(data))
};

export const storageGet = function (KEY_NAME) {
  var data = localStorage.getItem(KEY_NAME);
  if(data !== undefined && data !== null)
  { data = decrypto(data); }
  return data;
}

export const storageRemove = function (KEY_NAME) {
  return localStorage.removeItem( KEY_NAME );
}