const nanoid = require("nanoid");

const roomNameGenerator = () => {
  const id = nanoid.customAlphabet(`1234567890`, 4);
  const uid = id();
  return `#${uid}`;
};

module.exports = { roomNameGenerator };
