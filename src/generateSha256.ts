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
