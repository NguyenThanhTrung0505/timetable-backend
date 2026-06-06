import {
    createEventService,
    getAllEventsService,
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

export const getAllEventsController = catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const dataAllEvents = await getAllEventsService(user_id);
    res.status(200).json({ message: true, data: dataAllEvents });
});
