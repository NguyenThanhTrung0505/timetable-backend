import {
    createEventService,
    deleteEventService,
    getInfoService,
    getEventInWeekService,
    updateEventService,
} from "../services/eventService.js";
import { catchAsync } from "../utils/catchAsync.js";
export const createEventController = catchAsync(async (req, res) => {
    const { title, category, description, start, end, recurrence } = req.body;
    const creator_id = req.user.id;
    const newEvent = await createEventService(
        creator_id,
        title,
        category,
        description,
        start,
        end,
        recurrence,
    );
    res.status(200).json({ message: newEvent });
});

export const getInfoController = catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const infoUser = await getInfoService(user_id);
    res.status(200).json({ message: true, data: infoUser });
});

export const getEventInWeekController = catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const result = await getEventInWeekService(user_id, startDate, endDate);
    res.status(200).json({ data: result });
});

export const deleteEventController = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await deleteEventService(id);
    if (result.affectedRows === 0) {
        return res
            .status(404)
            .json({ message: "Sự kiện không tồn tại hoặc đã bị xóa!" });
    }
    res.status(200).json({ message: "Xóa thành công!" });
});

export const updateEventController = catchAsync(async (req, res) => {
    const eventId = req.params.id;
    const { title, start, end, category, description, recurrence } = req.body;
    const result = await updateEventService(
        eventId,
        title,
        start,
        end,
        category,
        description,
        recurrence,
    );
    if (result.affectedRows === 0) {
        return res
            .status(404)
            .json({ message: "Sự kiện không tồn tại hoặc không tìm thấy ID!" });
    }
    res.status(200).json({ message: "Cập nhật sự kiện thành công!" });
});
