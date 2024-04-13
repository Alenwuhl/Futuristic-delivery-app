import {fileURLToPath} from 'url';
import { dirname } from 'path';
import { bucket } from './config/firebase/firebase.config.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generates a 6-digit number.
function getRandomSixDigitNumber() {
    return Math.floor(100000 + Math.random() * 900000); 
  }
  
  function getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async function downloadImage(storagePath, localPath) {
    const dest = fs.createWriteStream(localPath);
    await bucket.file(storagePath).createReadStream().pipe(dest);
  }

export { __dirname, getRandomSixDigitNumber, getRandomString, downloadImage };