// Doxygen comments made with ChatGPT, cause am lazy.

/**
 * @file This module provides functions to interact with the `servers` table in the database.
 * It includes utilities for converting between `DB_Server` and `Server` objects,
 * as well as CRUD operations for managing servers.
 */

import { Server, DB_Server } from "../Types/Discord";
import { deleteRecord, getRecords, getSingleRecord, insertRecord, updateRecord } from "../DB/Database";

/** The name of the servers table in the database. */
const serversTable = 'servers';

/**
 * Converts a `DB_Server` object to a `Server` object.
 * 
 * @param {DB_Server} db_server - The database server object to convert.
 * @returns {Server} The converted Server object.
 */
function DB_ServerToServer(db_server: DB_Server): Server {
    return {
        id: db_server.id,
        name: db_server.name,
        discordId: db_server.discord_id,
        isPlaying: db_server.is_playing ?? false,
        audioChannelId: db_server.audio_channel_id,
        lastChannelId: db_server.last_channel_id,
        queue: JSON.parse(db_server.queue_json ?? '[]')
    }
}

/**
 * Converts a `Server` object to a `DB_Server` object.
 * 
 * @param {Server} server - The Server object to convert.
 * @returns {DB_Server} The converted DB_Server object.
 */
function ServerToDB_Server(server: Server): DB_Server {
    return {
        id: server.id ?? -1,
        name: server.name,
        discord_id: server.discordId,
        audio_channel_id: server.audioChannelId ?? null,
        is_playing: server.isPlaying,
        last_channel_id: server.lastChannelId ?? null,
        queue_json: server.queue ? JSON.stringify(server.queue) : null
    }
}

/**
 * Compares two `Server` objects for equality.
 * 
 * @param {Server | null} A - The first Server object.
 * @param {Server | null} B - The second Server object.
 * @returns {boolean} True if both Server are equal, otherwise false.
 */
function compareServers(A: Server | null, B: Server | null): boolean {
    return A !== null && B !== null 
    && A.id === B.id 
    && A.name === B.name 
    && A.discordId == B.discordId
    && A.audioChannelId == B.audioChannelId
    && A.isPlaying == B.isPlaying
    && A.lastChannelId == B.lastChannelId
    && compareQueues(A.queue, B.queue)
}

/**
 * Compares two `Server.queue` for equality.
 * 
 * @param {string[] | null | undefined} A - The first queue.
 * @param {string[] | null | undefined} B - The second queue.
 * @returns {boolean} True if both queues are equal, otherwise false.
 */
function compareQueues(A: string[] | null | undefined, B: string[] | null | undefined) : boolean {
    if(A === B) {
        return true;
    } else if(A === null || A === undefined || B === null || B === undefined || A.length !== B.length) {
        return false;
    } else {
        return A.every((value, index) => value === B[index]);
    }
}

/**
 * Retrieves the most recently inserted server from the database.
 * 
 * @returns {Server | null} The last inserted Server or null if no servers exist.
 */
function getLastInsertedServer(): Server | null {
    const DB_Server = getSingleRecord<DB_Server>(`SELECT * FROM ${serversTable} ORDER BY id DESC`);

    if(DB_Server === undefined)
        return null

    return DB_ServerToServer(DB_Server);
}

/**
 * Retrieves a server by it's ID.
 * 
 * @param {number} id - The ID of the server to retrieve.
 * @returns {Server | null} The retrieved Server or null if not found.
 */
export function getServerById(id: number): Server | null {
    const db_server = getSingleRecord<DB_Server>(`SELECT * FROM ${serversTable} WHERE id = ?;`, [id]);

    if (db_server === undefined)
        return null   
    
    return DB_ServerToServer(db_server);
}

/**
 * Retrieves all servers from the database.
 * 
 * @returns {Server[]} An array of all Servers.
 */
export function getServers(): Server[] {
    const db_servers = getRecords<DB_Server>(`SELECT * FROM ${serversTable};`)
    return db_servers.map(db_server => DB_ServerToServer(db_server));
}

/**
 * Adds a new server to the database.
 * 
 * @param {Server} server - The Server to add.
 * @returns {Server | null} The added Server or null if the operation failed.
 */
export function addServer(server: Server): Server | null {
    const before = getLastInsertedServer();

    const db_server = ServerToDB_Server(server);

    insertRecord(serversTable, db_server)

    const after = getLastInsertedServer();

    if (!compareServers(before, after))
        return after
    else
        return null;
}

/**
 * Updates an existing server in the database.
 * 
 * @param {Server} botUser - The Server to update.
 * @returns {Server | null} The updated Server or null if the operation failed.
 */
export function updateServer(server: Server): Server | null {
    if (server.id === null || server.id === undefined)
        return null

    const before = getServerById(server.id);
    const db_server = ServerToDB_Server(server);

    updateRecord(serversTable, db_server, 'id = ?', [server.id]);

    const after = getServerById(server.id);

    if (!compareServers(before, after))
        return after
    else
        return null;
}

/**
 * Deletes a server from the database.
 * 
 * @param {number} id - The ID of the server to delete.
 * @returns {Server | null} The deleted Server or null if the operation failed.
 */
export function deleteServer(id: number): Server | null {
    const before = getServerById(id);   
    if  (before === null)
        return null;

    deleteRecord(serversTable, 'id = ?', [id]);
    const after = getServerById(id);

    if (after !== null)
        return null
    else
        return after;
}