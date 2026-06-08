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

export const getInfoService = async (id) => {
    const [rows] = await db.query(
        "SELECT name, email, role FROM users WHERE id = ?",
        [id],
    );
    return rows[0];
};

export const getEventInWeekService = async (
    creator_id,
    start_date,
    end_date,
) => {
    const [rows] = await db.query(
        "select * from events where creator_id = ? and ((recurrence = 'none' and start_date >= ? and end_date <= ?) OR (recurrence IN ('daily', 'weekly') and start_date <= ?))",
        [creator_id, start_date, end_date, end_date],
    );
    const [rawsData] = await db.query(
        "select *, MONTH(start_date) AS s_month, DAY(start_date) AS s_day from events where creator_id = ? AND recurrence IN ('monthly', 'yearly') AND start_date <= ?",
        [creator_id, end_date],
    );
    const targetStartMonth = parseInt(start_date.substring(5, 7));
    const targetEndMonth = parseInt(end_date.substring(5, 7));
    const targetStartDay = parseInt(start_date.substring(8, 10));
    const targetEndDay = parseInt(end_date.substring(8, 10));
    const Data = rawsData.filter((event) => {
        if (event.recurrence === "monthly") {
            if (event.s_day <= targetEndDay && event.s_day >= targetStartDay) {
                return true;
            }
            return false;
        }
        if (event.recurrence === "yearly") {
            if (
                event.s_month === targetStartMonth ||
                event.s_month === targetEndMonth
            ) {
                if (
                    event.s_day <= targetEndDay &&
                    event.s_day >= targetStartDay
                ) {
                    return true;
                }
                return false;
            } else {
                return false;
            }
        }
        return false;
    });
    return [...rows, ...Data];
};

export const deleteEventService = async (id) => {
    const [rows] = await db.query("DELETE FROM events WHERE id = ?", [id]);
    return rows;
};

export const updateEventService = async (
    eventId,
    title,
    start,
    end,
    category,
    description,
    recurrence,
) => {
    const [rows] = await db.query(
        "UPDATE events SET title = ?, start_date = ?, end_date = ?, category = ?, description = ?, recurrence = ? WHERE id = ?",
        [title, start, end, category, description, recurrence, eventId],
    );
    return rows;
};
