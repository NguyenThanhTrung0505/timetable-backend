const validate = (schema) => {
    return (req, res, next) => {
        // abortEarly: false giúp Joi trả về TẤT CẢ các lỗi, thay vì dừng lại ở lỗi đầu tiên
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            // Map mảng lỗi của Joi thành một chuỗi thông báo dễ đọc
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join("; ");

            return res.status(400).json({
                success: false,
                message: "Dữ liệu đầu vào không hợp lệ",
                errors: errorMessage,
            });
        }

        // Nếu dữ liệu hợp lệ, cho phép đi tiếp đến Controller
        next();
    };
};

module.exports = validate;
