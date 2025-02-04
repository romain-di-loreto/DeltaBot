// // Doxygen comments made with ChatGPT, cause am lazy.

// /**
//  * @file This module provides functions to interact with the `users` table in the database.
//  * It includes utilities for converting between `DB_DCSProfile` and `DCSProfile` objects,
//  * as well as CRUD operations for managing users.
//  */

// import { BotUser } from "../Types/Discord";
// import { getUserById } from "./Users";
// import { DCSProfile, DB_DCSProfile } from "../Types/DCS";
// import { deleteRecord, getRecords, getSingleRecord, insertRecord, updateRecord } from "../DB/Database";

// /** The name of the users table in the database. */
// const usersTable = 'users';

// /**
//  * Converts a `DB_DCSProfile` object to a `DCSProfile` object.
//  * 
//  * @param {DB_DCSProfile} db_dcsprofile - The database user object to convert.
//  * @returns {DCSProfile} The converted DCSProfile object.
//  */
// function DB_DCSProfileToDCSProfile(db_dcsprofile: DB_DCSProfile): DCSProfile | null {
//     var user = getUserById(db_dcsprofile.user_id);

//     if(user === null) 
//         return null;

//     return {
//         id: db_dcsprofile.id,
//         dcsUsername: db_dcsprofile.name ?? undefined,
//         discordName: db_dcsprofile.discord_name,
//         modex: db_dcsprofile.modex ?? undefined,
//         sessions: [],
//         maps: [],
//         planes: [],
//         user: user
//     };
// }

// /**
//  * Converts a `DCSProfile` object to a `DB_DCSProfile` object.
//  * 
//  * @param {DCSProfile} botUser - The DCSProfile object to convert.
//  * @returns {DB_DCSProfile} The converted DB_DCSProfile object.
//  */
// function DCSProfileToDB_DCSProfile(botUser: DCSProfile): DB_DCSProfile {
//     return {
//         id: botUser.id ?? -1,
//         name: botUser.name,
//         discord_id: botUser.discordId
//     };
// }

// /**
//  * Compares two `DCSProfile` objects for equality.
//  * 
//  * @param {DCSProfile | null} A - The first DCSProfile object.
//  * @param {DCSProfile | null} B - The second DCSProfile object.
//  * @returns {boolean} True if both DCSProfiles are equal, otherwise false.
//  */
// function compareDCSProfiles(A: DCSProfile | null, B: DCSProfile | null): boolean {
//     return A !== null && B !== null && A.id === B.id && A.name === B.name && A.discordId == B.discordId;
// }

// /**
//  * Retrieves the most recently inserted user from the database.
//  * 
//  * @returns {DCSProfile | null} The last inserted DCSProfile or null if no users exist.
//  */
// function getLastInsertedUser(): DCSProfile | null {
//     const db_user = getSingleRecord<DB_DCSProfile>(`SELECT * FROM ${usersTable} ORDER BY id DESC`);

//     if (db_user === undefined)
//         return null;

//     return DB_DCSProfileToDCSProfile(db_user);
// }

// /**
//  * Retrieves a user by their ID.
//  * 
//  * @param {number} id - The ID of the user to retrieve.
//  * @returns {DCSProfile | null} The retrieved DCSProfile or null if not found.
//  */
// export function getDCSProfileById(id: number): DCSProfile | null {
//     const db_user = getSingleRecord<DB_DCSProfile>(`SELECT * FROM ${usersTable} WHERE id = ?;`, [id]);

//     if (db_user === undefined)
//         return null;

//     return DB_DCSProfileToDCSProfile(db_user);
// }

// /**
//  * Retrieves all users from the database.
//  * 
//  * @returns {DCSProfile[]} An array of all DCSProfiles.
//  */
// export function getUsers(): DCSProfile[] {
//     const db_users = getRecords<DB_DCSProfile>(`SELECT * FROM ${usersTable};`);
//     return db_users.map(db_user => DB_DCSProfileToDCSProfile(db_user));
// }

// /**
//  * Adds a new user to the database.
//  * 
//  * @param {DCSProfile} botUser - The DCSProfile to add.
//  * @returns {DCSProfile | null} The added DCSProfile or null if the operation failed.
//  */
// export function addUser(botUser: DCSProfile): DCSProfile | null {
//     const before = getLastInsertedUser();

//     const db_user = DCSProfileToDB_DCSProfile(botUser);

//     insertRecord(usersTable, db_user);

//     const after = getLastInsertedUser();

//     if (!compareDCSProfiles(before, after))
//         return after;
//     else
//         return null;
// }

// /**
//  * Updates an existing user in the database.
//  * 
//  * @param {DCSProfile} botUser - The DCSProfile to update.
//  * @returns {DCSProfile | null} The updated DCSProfile or null if the operation failed.
//  */
// export function updateUser(botUser: DCSProfile): DCSProfile | null {
//     if (botUser.id === null || botUser.id === undefined)
//         return null;

//     const before = getUserById(botUser.id);
//     const db_user = DCSProfileToDB_DCSProfile(botUser);

//     updateRecord(usersTable, db_user, 'id = ?', [botUser.id]);

//     const after = getUserById(botUser.id);

//     if (!compareDCSProfiles(before, after))
//         return after;
//     else
//         return null;
// }

// /**
//  * Deletes a user from the database.
//  * 
//  * @param {number} id - The ID of the user to delete.
//  * @returns {DCSProfile | null} The deleted DCSProfile or null if the operation failed.
//  */
// export function deleteUser(id: number): DCSProfile | null {
//     const before = getUserById(id);
//     if (before === null)
//         return null;

//     deleteRecord(usersTable, 'id = ?', [id]);
//     const after = getUserById(id);

//     if (after !== null)
//         return null;
//     else
//         return before;
// }
