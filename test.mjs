import { customAlphabet } from "nanoid";
const id = customAlphabet(`1234567890`, 4);
const uid = id();
console.log(uid + "#" + uid, "||", "test.mjs", "line-", 5);
