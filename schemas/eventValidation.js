const Joi = require("joi");

const eventValidation = {
    // Schema cho API tạo mới sự kiện (POST)
    createEventSchema: Joi.object({
        title: Joi.string().trim().required().messages({
            "string.empty": "Tiêu đề sự kiện không được để trống",
            "any.required": "Vui lòng cung cấp tiêu đề sự kiện",
        }),

        category: Joi.string()
            .valid("work", "personal", "meeting", "focus", "wellness")
            .required()
            .messages({
                "any.only":
                    "Danh mục phải thuộc các giá trị cho phép: work, personal, meeting, focus, wellness",
            }),

        description: Joi.string().allow("", null), // Cho phép rỗng hoặc null

        // Kiểm tra định dạng ngày giờ (ISO 8601)
        startDate: Joi.date().iso().required().messages({
            "date.format": "Thời gian bắt đầu phải đúng định dạng",
            "any.required": "Thời gian bắt đầu là bắt buộc",
        }),

        // Đảm bảo endDate phải LỚN HƠN startDate
        endDate: Joi.date()
            .iso()
            .greater(Joi.ref("startDate"))
            .required()
            .messages({
                "date.greater":
                    "Thời gian kết thúc bắt buộc phải sau thời gian bắt đầu",
                "any.required": "Thời gian kết thúc là bắt buộc",
            }),

        recurrence: Joi.string()
            .valid("none", "daily", "weekly", "monthly", "yearly")
            .default("none"),
    }),
};

module.exports = eventValidation;
