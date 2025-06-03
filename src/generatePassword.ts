// Mã hoá dùng bcrypt
// import bcrypt from "bcrypt";

// // Mảng mật khẩu gốc cần mã hóa
// const rawPasswords = ["123456", "kt.340"];

// async function generate() {
//   const saltRounds = 10;

//   const hashedPasswords = await Promise.all(
//     rawPasswords.map((pwd) => bcrypt.hash(pwd, saltRounds))
//   );

//   console.log("Mật khẩu gốc:", rawPasswords);
//   console.log("Mật khẩu đã mã hóa:", hashedPasswords);
// }

// generate();

// Mã hoá dùng crypto
import crypto from "crypto";

const rawPasswords = ["123456", "kt.340", "admin"];

function hashSHA256(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generate() {
  const results = rawPasswords.map((pwd) => ({
    "Plain Password": pwd,
    "SHA-256 Hash": hashSHA256(pwd),
  }));

  console.table(results);
}

generate();
