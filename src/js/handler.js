import { API_URL } from './config';
import { TIME_OUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/* export const getJSON = async function (url) {
  const dataBinary = await fetch(url);
  const dataJSON = await dataBinary.json();
  return dataJSON;
}; */

export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIME_OUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    console.log(url);
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIME_OUT_SEC)]);
    const dataJSON = await res.json();

    if (!res.ok) throw new Error(`${data.message}(${res.status})`);
    return dataJSON;
  } catch (err) {
    throw err;
  }
};
