import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

let keys;

// ✅ Ưu tiên lấy từ biến môi trường GOOGLE_CREDENTIALS (dạng base64)
if (process.env.GOOGLE_CREDENTIALS) {
  const decoded = Buffer.from(
    process.env.GOOGLE_CREDENTIALS,
    "base64"
  ).toString("utf-8");
  keys = JSON.parse(decoded);
} else {
  // ✅ Nếu không có, fallback về file local (chạy ở máy dev)
  const keyPath = path.resolve(
    process.env.GOOGLE_CREDENTIALS_PATH || ".secret/credentials.json"
  );

  if (!fs.existsSync(keyPath)) {
    throw new Error(`Không tìm thấy file credentials tại: ${keyPath}`);
  }

  keys = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
}

// ✅ Xác thực Google API
const auth = new JWT({
  email: keys.client_email,
  key: keys.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  subject: keys.client_email,
});

export const sheets = google.sheets({ version: "v4", auth });

// Lấy dữ liệu từ bảng tính Google Sheets (thiết bị mượn)
export const fetchMuonData = async () => {
  try {
    const spreadsheetId = "17cYIPZGkfLip7Sj8Xv6OOmxEb4NRqG3Jd2P9xz-8gl4"; // Điền vào ID của Google Sheets
    const range = "ThietBiMuon!A:Z"; // Vùng dữ liệu bạn muốn lấy

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return res.data.values; // Trả về dữ liệu từ Google Sheets
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thiết bị mượn:", error);
    throw error;
  }
};

// Lấy dữ liệu thiết bị trả từ Google Sheets
export const fetchTraData = async () => {
  try {
    const spreadsheetId = "17cYIPZGkfLip7Sj8Xv6OOmxEb4NRqG3Jd2P9xz-8gl4"; // Điền vào ID của Google Sheets
    const range = "ThietBiTra!A:Z"; // Vùng dữ liệu thiết bị trả

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    // console.log(res.data.values);
    return res.data.values; // Trả về dữ liệu từ Google Sheets
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thiết bị trả:", error);
    throw error;
  }
};

// Lấy dữ liệu người dùng từ Google Sheets
export const fetchUsers = async () => {
  try {
    const spreadsheetId = "17cYIPZGkfLip7Sj8Xv6OOmxEb4NRqG3Jd2P9xz-8gl4";
    const range = "Users!A:C"; // Cột A là email, B là tên

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = res.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Bỏ dòng tiêu đề nếu có (nếu dòng đầu là "Email", "Name")
    const dataRows = rows[0][0]?.toLowerCase().includes("email")
      ? rows.slice(1)
      : rows;

    // Map thành đối tượng user
    return dataRows.map((row) => ({
      email: row[0]?.trim() || "",
      name: row[1]?.trim() || "",
      password: row[2]?.trim() || "", // thêm password
    }));
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu users:", error);
    throw error;
  }
};
