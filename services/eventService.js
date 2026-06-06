import db from "../config/db.js";

export const createEventService = async (
    creator_id,
    title,
    category,
    description,
    startDate,
    endDate,
    recurrence,
) => {
    const [rows] = await db.query(
        `INSERT INTO events (creator_id, title, category, description, start_date, end_date, recurrence) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            creator_id,
            title,
            category,
            description,
            startDate,
            endDate,
            recurrence,
        ],
    );
    return rows.insertId;
};

export const getAllEventsService = async (creator_id) => {
    const [rows] = await db.query(
        "SELECT u.name, u.email, e.* FROM users u LEFT JOIN events e ON u.id = e.creator_id WHERE u.id = ?",
        [creator_id],
    );
    return rows;
};
