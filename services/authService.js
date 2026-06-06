import db from "../config/db.js";

export const loginService = async (email, password) => {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
    ]);
    const user = users[0];
    return user;
};

export const createNewUserService = async (name, email, password) => {
    const [newUsers] = await db.query(
        "insert into users (name, email, password) values (?,?,?)",
        [name, email, password],
    );
    return newUsers.insertId;
};

export const checkEmail = async (email) => {
    const [existingUsers] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
    );
    if (existingUsers.length > 0) {
        return true;
    }
    return false;
};
