// Doxygen comments made with ChatGPT, cause am lazy.

/**
 * @file DatabaseSingleton.ts
 * A singleton implementation for managing a SQLite database with schema validation and utility functions.
 */

import DatabaseConstructor, { Database } from "better-sqlite3";
import { TableSchema, Column, TableInfo, ForeignKeyList, SQLITE_ERRORS } from "../Types/Database";
import tableSchemas from "./Tables";
import path from "path";
import { ConsolePlus, EffectsOptions } from "../Utils/ConsoleColors";

/**
 * Debugging flags for logging purposes.
 */
const debug: boolean = false;
const verbose: boolean = false;
const debugQueries: boolean = false;

/**
 * Singleton class for managing a SQLite database.
 */
class DatabaseSingleton {
    private static instance: DatabaseSingleton; ///< The singleton instance.
    public readonly db: Database; ///< The SQLite database instance.

    /**
     * Private constructor to initialize the SQLite database.
     */
    private constructor() {
        if (verbose)
            this.db = new DatabaseConstructor(path.join(__dirname, "../../data/database.db"), { verbose: console.log });
        else
            this.db = new DatabaseConstructor(path.join(__dirname, "../../data/database.db"));

        this.initializeDatabase();
    }

    /**
     * Retrieves the singleton instance of the DatabaseSingleton class.
     * 
     * @return {DatabaseSingleton} The singleton instance.
     */
    public static getInstance(): DatabaseSingleton {
        if (!DatabaseSingleton.instance) {
            DatabaseSingleton.instance = new DatabaseSingleton();
        }
        return DatabaseSingleton.instance;
    }

    /**
     * Generates a SQL query for creating a table based on its schema.
     * 
     * @param {string} tableName The name of the table.
     * @param {TableSchema} schema The schema defining the table structure.
     * @return {string} The generated SQL query.
     */
    private generateCreateTableQuery(tableName: string, schema: TableSchema): string {
        const foreignKeys: string[] = [];
        const columns = schema.columns.map((col: Column) => {
            const constraints: string[] = [];
            if (col.notNull) constraints.push("NOT NULL");
            if (col.primaryKey) constraints.push("PRIMARY KEY");
            if (col.unique) constraints.push("UNIQUE");
            if (col.defaultValue) constraints.push(`DEFAULT ${col.defaultValue}`);

            if (col.foreignKey) {
                const fk = col.foreignKey;
                let fkClause = `FOREIGN KEY(${col.name}) REFERENCES ${fk.table}(${fk.column})`;

                if (fk.onDelete) fkClause += ` ON DELETE ${fk.onDelete}`;
                if (fk.onUpdate) fkClause += ` ON UPDATE ${fk.onUpdate}`;
                if (fk.match) fkClause += ` MATCH ${fk.match}`;

                foreignKeys.push(fkClause);
            }

            return `${col.name} ${col.type} ${constraints.join(" ")}`.trim();
        });
        columns.push(...foreignKeys);

        return `CREATE TABLE IF NOT EXISTS ${tableName} (\n  ${columns.join(",\n  ")}\n);`;
    }

    /**
     * Compares an existing table structure with its schema.
     * 
     * @param {string} tableName The name of the table.
     * @param {TableSchema} schema The schema defining the table structure.
     * @return {boolean} True if the table matches the schema, false otherwise.
     */
    private compareTableWithSchema(tableName: string, schema: TableSchema): boolean {
        const tableInfo = this.getTableInfo(tableName);

        if (this.compareTableColumnsWithSchema(tableInfo, schema)) {
            const foreignKeyInfo = this.getForeignKeyList(tableName);

            const res = this.compareForeignKeysWithSchema(foreignKeyInfo, schema);

            return res;
        } else {
            return false;
        }
    }

    /**
     * Compares table columns with the schema columns.
     * 
     * @param {TableInfo[]} tableInfo The current table structure.
     * @param {TableSchema} schema The schema defining the table structure.
     * @return {boolean} True if the columns match, false otherwise.
     */
    private compareTableColumnsWithSchema(tableInfo: TableInfo[], schema: TableSchema): boolean {
        if (tableInfo.length !== schema.columns.length) return false;

        for (let i = 0; i < schema.columns.length; i++) {
            const schemaCol = schema.columns[i];
            const tableCol = tableInfo.find((p) => p.name === schemaCol.name);

            if (!tableCol) return false;

            if (
                tableCol.type !== schemaCol.type ||
                !!tableCol.notnull !== !!schemaCol.notNull ||
                !!tableCol.pk !== !!schemaCol.primaryKey ||
                tableCol.dflt_value !== (schemaCol.defaultValue ?? null)
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Compares foreign keys of a table with its schema.
     * 
     * @param {ForeignKeyList[]} existingForeignKeys The current foreign keys of the table.
     * @param {TableSchema} schema The schema defining the table structure.
     * @return {boolean} True if the foreign keys match, false otherwise.
     */
    private compareForeignKeysWithSchema(existingForeignKeys: ForeignKeyList[], schema: TableSchema): boolean {
        const definedForeignKeys = schema.columns
            .filter((col) => col.foreignKey)
            .map((col) => ({
                from: col.name,
                to: col.foreignKey?.column,
                table: col.foreignKey?.table,
            }));

        if (existingForeignKeys.length !== definedForeignKeys.length) return false;

        for (let i = 0; i < definedForeignKeys.length; i++) {
            const definedFk = definedForeignKeys[i];
            const existingFk = existingForeignKeys.find(
                (fk) =>
                    fk.from === definedFk.from &&
                    fk.to === definedFk.to &&
                    fk.table === definedFk.table
            );
            if (!existingFk) return false;
        }

        return true;
    }

    /**
     * Retrieves the current date as a string.
     * 
     * @return {string} The current date in milliseconds since epoch.
     */
    private getDate(): string {
        return Date.now().toString();
    }

    /**
     * Initializes the database by ensuring all tables match their schemas.
     */
    private initializeDatabase() {
        ConsolePlus.White(null, "Starting DB Initialization...");
        Object.entries(tableSchemas).forEach(([tableName, schema]) => {
            if (!this.tableExists(tableName))
                this.createTable(tableName, schema);
            else if (!this.compareTableWithSchema(tableName, schema)) {

                if (debug) ConsolePlus.White([EffectsOptions.General.Dim], `Updating table: ${tableName}`);
                const createQuery = this.generateCreateTableQuery(tableName, schema);
                const date = this.getDate();

                this.db.transaction(() => {
                    this.db.exec(`DROP TABLE IF EXISTS ${tableName}_backup_${date};`);
                    this.db.exec(`ALTER TABLE ${tableName} RENAME TO ${tableName}_backup_${date};`);
                    this.db.exec(createQuery);
                    // TODO : (Not urgent) Reinsert the backup in the new table when I've figured out how to handle the differences in column names
                    if (debug) ConsolePlus.White([EffectsOptions.General.Dim], `Table '${tableName}' was updated. Data was put in ${tableName}_backup_${date}`);
                })();
            } else {
                if (debug) ConsolePlus.White([EffectsOptions.General.Dim], `Table '${tableName}' is up-to-date.`);
            }
        });
        ConsolePlus.Green(null, "DB Initialization Complete.");
    }

    /**
     * Checks if a table exists in the database.
     * 
     * @param {string} tableName The name of the table.
     * @return {boolean} True if the table exists, false otherwise.
     */
    private tableExists(tableName: string): boolean {
        const result = this.db.prepare(
            `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`
        ).get(tableName);
        return !!result;
    }

    /**
     * Retrieves information about a table's columns.
     * 
     * @param {string} tableName The name of the table.
     * @return {TableInfo[]} An array containing the table's column details.
     */
    private getTableInfo(tableName: string): TableInfo[] {
        const rows = this.db.prepare(`PRAGMA table_info(${tableName})`).all();
        return rows as TableInfo[];
    }

    /**
     * Retrieves foreign key information for a table.
     * 
     * @param {string} tableName The name of the table.
     * @return {ForeignKeyList[]} An array containing the foreign key details.
     */
    private getForeignKeyList(tableName: string): ForeignKeyList[] {
        const rows = this.db.prepare(`PRAGMA foreign_key_list(${tableName})`).all();
        return rows as ForeignKeyList[];
    }

    /**
     * Creates a new table in the database based on its schema.
     * 
     * @param {string} tableName The name of the table.
     * @param {TableSchema} schema The schema defining the table structure.
     */
    private createTable(tableName: string, schema: TableSchema): void {
        const createQuery = this.generateCreateTableQuery(tableName, schema);
        this.db.exec(createQuery);
        if (debug) ConsolePlus.White([EffectsOptions.General.Dim], `Table '${tableName}' created.`);
    }

    /**
     * Drops a table from the database.
     * 
     * @param {string} tableName The name of the table.
     */
    private dropTable(tableName: string): void {
        if (this.tableExists(tableName)) {
            this.db.exec(`DROP TABLE IF EXISTS ${tableName};`);
            if (debug) ConsolePlus.White([EffectsOptions.General.Dim], `Table '${tableName}' dropped.`);
        } else if (debug) {
            ConsolePlus.White([EffectsOptions.General.Dim], `Table '${tableName}' does not exist.`);
        }
    }
}

/**
 * The singleton instance of the database.
 */
export const db = DatabaseSingleton.getInstance().db;

/**
 * Closes the database on process exit.
 */
process.on('exit', () => {
    db.close();
});

/**
 * Retrieves multiple records from the database.
 * 
 * @tparam The type of the records.
 * @param {string} query The SQL query to execute.
 * @param {any[]} params The parameters for the SQL query. Empty by default.
 * @return {T[]} An array of records.
 */
export function getRecords<T>(query: string, params: any[] = []): T[] {
    if (debugQueries) ConsolePlus.White([EffectsOptions.General.Dim], query);
    const rows = db.prepare(query).all(...params);

    return rows as T[];
}

/**
 * Retrieves a single record from the database.
 * 
 * @tparam The type of the record.
 * @param {string} query The SQL query to execute.
 * @param {any[]} params The parameters for the SQL query. Empty by default.
 * @return {T | undefined} The record or undefined if no record is found.
 */
export function getSingleRecord<T>(query: string, params: any[] = []): T | undefined {
    if (debugQueries) ConsolePlus.White([EffectsOptions.General.Dim], query);
    const rows = db.prepare(query).get(...params);

    return rows as T;
}

/**
 * Inserts a record into a table.
 * 
 * @param {string} tableName The name of the table.
 * @param {Record<string, any>} data The record data to insert.
 */
export function insertRecord(tableName: string, data: Record<string, any>): void {
    const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== "id")
    );

    const columns = Object.keys(filteredData).join(", ");
    const placeholders = Object.keys(filteredData).map(() => "?").join(", ");
    const values = Object.values(filteredData).map(v => v === true ? 1 : v === false ? 0 : v);

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders});`;
    if (debugQueries) ConsolePlus.White([EffectsOptions.General.Dim], query);
    try {
        db.prepare(query).run(...values);
        if (debug) ConsolePlus.White([EffectsOptions.General.Dim], `Record inserted into '${tableName}'.`);
    } catch (error: any) {
        switch (error.code) {
            case SQLITE_ERRORS.UNIQUE:
            case SQLITE_ERRORS.NOTNULL:
            case SQLITE_ERRORS.PRIMARYKEY:
            case SQLITE_ERRORS.FOREIGNKEY:
            case SQLITE_ERRORS.CHECK: {
                ConsolePlus.Red(null, error.message);
                break;
            }
            case SQLITE_ERRORS.RANGE: {
                ConsolePlus.Red(null, error.message);
                break;
            }
            default: {
                throw error;
            }
        }
    }
}

/**
 * Updates a record in a table.
 * 
 * @param {string} tableName The name of the table.
 * @param {Record<string, any>} data The updated record data.
 * @param {string} where The WHERE clause for the update.
 * @param {any[]} params The parameters for the WHERE clause.
 */
export function updateRecord(tableName: string, data: Record<string, any>, where: string, params: any[]): void {
    const updates = Object.keys(data).map((key) => `${key} = ?`).join(", ");
    const values = [...Object.values(data), ...params].map(v => v === true ? 1 : v === false ? 0 : v);;

    const query = `UPDATE ${tableName} SET ${updates} WHERE ${where};`;
    if (debugQueries) ConsolePlus.White([EffectsOptions.General.Dim], query);
    try {
        db.prepare(query).run(...values);
        if (debug) ConsolePlus.White([EffectsOptions.General.Dim], `Record updated in '${tableName}'.`);
    } catch (error: any) {
        switch (error.code) {
            case SQLITE_ERRORS.UNIQUE:
            case SQLITE_ERRORS.NOTNULL:
            case SQLITE_ERRORS.PRIMARYKEY:
            case SQLITE_ERRORS.FOREIGNKEY:
            case SQLITE_ERRORS.CHECK: {
                ConsolePlus.Red(null, error.message);
                break;
            }
            case SQLITE_ERRORS.RANGE: {
                ConsolePlus.Red(null, error.message);
                break;
            }
            default: {
                throw error;
            }
        }
    }
}

/**
 * Deletes a record from a table.
 * 
 * @param {string} tableName The name of the table.
 * @param {string} where The WHERE clause for the deletion.
 * @param {any[]} params The parameters for the WHERE clause.
 */
export function deleteRecord(tableName: string, where: string, params: any[]): void {
    const query = `DELETE FROM ${tableName} WHERE ${where};`;
    if (debugQueries) ConsolePlus.White([EffectsOptions.General.Dim], query);

    db.prepare(query).run(...params);

    if (debug) ConsolePlus.White([EffectsOptions.General.Dim], `Record deleted from '${tableName}'.`);
}
