import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { catchAsync } from "../utils/catchAsync.js";
// --- MIDDLEWARE KIỂM TRA ĐĂNG NHẬP ---
export const protect = catchAsync(async (req, res, next) => {
    // 1. Trích xuất token từ headers
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Bạn chưa đăng nhập. Vui lòng cung cấp token!",
        });
    }

    // 2. Giải mã và xác thực token
    // LƯU Ý: Nếu token hết hạn hoặc sai, jwt.verify sẽ quăng lỗi và catchAsync sẽ bắt lấy
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Kiểm tra người dùng có còn tồn tại trong cơ sở dữ liệu không
    const [users] = await db.query(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        [decoded.id],
    );

    if (users.length === 0) {
        return res.status(401).json({
            success: false,
            message: "Người dùng sở hữu token này không còn tồn tại.",
        });
    }

    // 4. Gán thông tin người dùng vào request để các controller phía sau sử dụng
    req.user = users[0];
    next();
});

// --- MIDDLEWARE PHÂN QUYỀN (AUTHORIZATION) ---
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles là một mảng, ví dụ: ['admin', 'manager']
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền thực hiện hành động này!",
            });
        }
        next();
    };
};
