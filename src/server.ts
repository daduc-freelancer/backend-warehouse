import cors from "cors";
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  fetchMuonData,
  fetchTraData,
  fetchUsers,
} from "./services/googleSheetsService";
import jwt from "jsonwebtoken"; // ✅ Bổ sung dòng này

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret_here"; // ✅ Thêm dòng này

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173", // cho local dev
      "https://warehouseadsun.vercel.app", // cho FE deploy trên Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/api/muon", async (req, res) => {
  try {
    const data = await fetchMuonData();
    // console.log(data); // Log dữ liệu
    res.json({ data });
  } catch (err) {
    res.status(500).send({ error: "Lỗi khi lấy dữ liệu thiết bị mượn" });
  }
});

app.get("/api/tra", async (req, res) => {
  try {
    const data = await fetchTraData();
    res.json({ data });
  } catch (err) {
    res.status(500).send({ error: "Lỗi khi lấy dữ liệu thiết bị trả" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await fetchUsers();
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đọc dữ liệu người dùng" });
  }
});

// --- Thêm API login ---
app.post("/api/login", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email và mật khẩu không được bỏ trống." });
  }

  try {
    const users = await fetchUsers();

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng." });
    }

    // Trả về thông tin user khi đăng nhập thành công
    return res.json({
      token: jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, {
        expiresIn: "2h",
      }),
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server. Vui lòng thử lại sau." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
