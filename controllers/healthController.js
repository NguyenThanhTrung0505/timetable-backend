import { pingDatabaseService } from "../services/healthService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const checkHealth = catchAsync(async (req, res) => {
    await pingDatabaseService();
    res.status(200).json({
        status: "success",
        message: "Server and Database are awake!",
    });
});
