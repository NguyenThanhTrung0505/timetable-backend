import db from "../config/db.js";
export const pingDatabaseService = async () => {
    const [rows] = await db.query("SELECT 1");
    return rows;
};
