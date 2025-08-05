// decoder.js
const atob = (str) => Buffer.from(str, "base64").toString("utf-8");

// Your encoded object
const encoded = {
  do: null,
  ob: "PmJiYj4+clF+dj1yPT0+cmg7Pzc6PW9tOmhqajY/bD4+Om06amxtajo7aD07Oz5vO282OWtqPz8+aD5vaz04am9rODg2bTpqaD03bzo8Oz40NnlFemBXQWMhf2B3eE1+amVleT5oeH9kZEtcZUB9JUFHXU1oeTt9eFQ9dz0+Z3lhVjlBfDhFSTtkYVx0NkI2eH1aT0JNaVt+QEpvRCFKQUIhfG1seE8zMzQ/Pj4+NE97PX9YYXQ2ODpYRFo7f2Y5SWRGbz9URzZbf15aXjdlf2hHeEdhXzh9TT9dWD9JQTxrSHpgR0xAalRWfHp4ezxJTE9+RmR6SWp/bW02OV9ad0RJP3xMb3o4XmN6WFxNPUdpOlY7en1/PztifkRJa3ZveDtDSEtLYUVUP2B6djxIO0B/QEc6d2tmXjxdY0t0PCFaWW1GWH5EeT45S0RURTc3WkpoYGs6fnkleVRqSW1jaT5oZW0hTXpBS1p/NnYlS2ZNQkNPV3ltR2dBQlhZb1loRFlWfGVEQn1ifHRfPExrODxNRVtibVhIYl8zcnp8e2tyPT4+cHBwcD4+PmJiPnJtew==",
};

const decoded = atob(encoded.ob);
console.log("Base64 Decoded:\n", decoded);
