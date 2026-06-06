import { catchAsync } from "../utils/catchAsync.js";
import generateToken from "../utils/generateToken.js";
import { loginService, checkEmail } from "../services/authService.js";
import bcrypt from "bcrypt";
import { createNewUserService } from "../services/authService.js";
const saltRounds = 10;
export const loginController = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng cung cấp email và mật khẩu",
        });
    }
    const checkUser = await loginService(email, password);
    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
        return res
            .status(401)
            .json({ success: false, message: "Sai email hoặc mật khẩu" });
    }
    const token = generateToken(checkUser.id);
    res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        token,
        user: {
            id: checkUser.id,
            name: checkUser.name,
            email: checkUser.email,
            role: checkUser.role,
        },
    });
});

export const createNewUserController = catchAsync(async (req, res) => {
    const { email, password } = req.body.formData;
    const name = req.body.formData.fullName;
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng cung cấp đủ thông tin",
        });
    }
    const existingUsers = await checkEmail(email);
    if (existingUsers) {
        return res.status(400).json({
            success: false,
            message:
                "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.",
        });
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = await createNewUserService(name, email, hashPassword);
    const token = generateToken(newUser);
    res.status(200).json({ success: true, userId: newUser, token });
});
