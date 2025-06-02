import bcrypt from "bcrypt";

// Mảng mật khẩu gốc cần mã hóa
const rawPasswords = ["123456", "kt.340"];

async function generate() {
  const saltRounds = 10;

  const hashedPasswords = await Promise.all(
    rawPasswords.map((pwd) => bcrypt.hash(pwd, saltRounds))
  );

  console.log("Mật khẩu gốc:", rawPasswords);
  console.log("Mật khẩu đã mã hóa:", hashedPasswords);
}

generate();
