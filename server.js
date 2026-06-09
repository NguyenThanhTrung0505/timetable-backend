import "dotenv/config";
import eventRoutes from "./routes/eventRoutes.js";
import auth from "./routes/authRoutes.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
const app = express();
app.set("trust proxy", 1);
// --- 1. MIDDLEWARES ---
app.use(helmet()); // Bảo mật HTTP headers
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true, // Cần thiết nếu bạn có dùng cookie/session
    }),
);
app.use(express.json()); // Parse body request dạng JSON
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Log request ra console

// --- 2. SECURITY POLICY ---
// Giới hạn 100 request / 15 phút cho mỗi IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: "Quá nhiều thao tác xác thực, vui lòng thử lại sau 1 phút.",
});
app.use("/api", limiter);
app.use("/api/event", eventRoutes);
app.use("/api/auth", authLimiter, auth);
app.use((err, req, res, next) => {
    console.error("🔥 Error Stack:", err.stack); // Log lỗi ra console để dev dễ check

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Lỗi hệ thống nội bộ!",
        // Chỉ gửi stack trace chi tiết nếu đang ở môi trường dev
        error: process.env.NODE_ENV === "development" ? err : {},
    });
});

// --- 4. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
