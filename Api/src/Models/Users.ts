// Doxygen comments made with ChatGPT, cause am lazy.

/**
 * @file This module provides functions to interact with the `users` table in the database.
 * It includes utilities for converting between `DB_User` and `BotUser` objects,
 * as well as CRUD operations for managing users.
 */

import { BotUser, DB_User } from "../Types/Discord";
import { deleteRecord, getRecords, getSingleRecord, insertRecord, updateRecord } from "../DB/Database";

/** The name of the users table in the database. */
const usersTable = 'users';

/**
 * Converts a `DB_User` object to a `BotUser` object.
 * 
 * @param {DB_User} db_user - The database user object to convert.
 * @returns {BotUser} The converted BotUser object.
 */
function DB_UserToBotUser(db_user: DB_User): BotUser {
    return {
        id: db_user.id,
        name: db_user.name,
        discordId: db_user.discord_id
    };
}

/**
 * Converts a `BotUser` object to a `DB_User` object.
 * 
 * @param {BotUser} botUser - The BotUser object to convert.
 * @returns {DB_User} The converted DB_User object.
 */
function BotUserToDB_User(botUser: BotUser): DB_User {
    return {
        id: botUser.id ?? -1,
        name: botUser.name,
        discord_id: botUser.discordId
    };
}

/**
 * Compares two `BotUser` objects for equality.
 * 
 * @param {BotUser | null} A - The first BotUser object.
 * @param {BotUser | null} B - The second BotUser object.
 * @returns {boolean} True if both BotUsers are equal, otherwise false.
 */
function compareBotUsers(A: BotUser | null, B: BotUser | null): boolean {
    return A !== null && B !== null && A.id === B.id && A.name === B.name && A.discordId == B.discordId;
}

/**
 * Retrieves the most recently inserted user from the database.
 * 
 * @returns {BotUser | null} The last inserted BotUser or null if no users exist.
 */
function getLastInsertedUser(): BotUser | null {
    const db_user = getSingleRecord<DB_User>(`SELECT * FROM ${usersTable} ORDER BY id DESC`);

    if (db_user === undefined)
        return null;

    return DB_UserToBotUser(db_user);
}

/**
 * Retrieves a user by their ID.
 * 
 * @param {number} id - The ID of the user to retrieve.
 * @returns {BotUser | null} The retrieved BotUser or null if not found.
 */
export function getUserById(id: number): BotUser | null {
    const db_user = getSingleRecord<DB_User>(`SELECT * FROM ${usersTable} WHERE id = ?;`, [id]);

    if (db_user === undefined)
        return null;

    return DB_UserToBotUser(db_user);
}

/**
 * Retrieves all users from the database.
 * 
 * @returns {BotUser[]} An array of all BotUsers.
 */
export function getUsers(): BotUser[] {
    const db_users = getRecords<DB_User>(`SELECT * FROM ${usersTable};`);
    return db_users.map(db_user => DB_UserToBotUser(db_user));
}

/**
 * Adds a new user to the database.
 * 
 * @param {BotUser} botUser - The BotUser to add.
 * @returns {BotUser | null} The added BotUser or null if the operation failed.
 */
export function addUser(botUser: BotUser): BotUser | null {
    const before = getLastInsertedUser();

    const db_user = BotUserToDB_User(botUser);

    insertRecord(usersTable, db_user);

    const after = getLastInsertedUser();

    if (!compareBotUsers(before, after))
        return after;
    else
        return null;
}

/**
 * Updates an existing user in the database.
 * 
 * @param {BotUser} botUser - The BotUser to update.
 * @returns {BotUser | null} The updated BotUser or null if the operation failed.
 */
export function updateUser(botUser: BotUser): BotUser | null {
    if (botUser.id === null || botUser.id === undefined)
        return null;

    const before = getUserById(botUser.id);
    const db_user = BotUserToDB_User(botUser);

    updateRecord(usersTable, db_user, 'id = ?', [botUser.id]);

    const after = getUserById(botUser.id);

    if (!compareBotUsers(before, after))
        return after;
    else
        return null;
}

/**
 * Deletes a user from the database.
 * 
 * @param {number} id - The ID of the user to delete.
 * @returns {BotUser | null} The deleted BotUser or null if the operation failed.
 */
export function deleteUser(id: number): BotUser | null {
    const before = getUserById(id);
    if (before === null)
        return null;

    deleteRecord(usersTable, 'id = ?', [id]);
    const after = getUserById(id);

    if (after !== null)
        return null;
    else
        return before;
}
