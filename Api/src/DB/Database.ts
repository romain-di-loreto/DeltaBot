import Database from "better-sqlite3";
import { TableSchemas, TableSchema, Column, ForeignKey, TableInfo, ForeignKeyList } from "../Types/Database";
import tableSchemas from "./Tables"
import path from "path";

console.log(__dirname);

const db = new Database(path.join(__dirname,"../../data/database.db"), { verbose: console.log });

function generateCreateTableQuery(tableName: string, schema: TableSchema): string {
    const foreignKeys: string[] = [];
    const columns = schema.columns.map((col: Column) => {
        const constraints: string[] = [];
        if (col.notNull) constraints.push("NOT NULL");
        if (col.primaryKey) constraints.push("PRIMARY KEY");
        if (col.unique) constraints.push("UNIQUE");
        if (col.defaultValue) constraints.push(`DEFAULT ${col.defaultValue}`);

        // Handle foreign keys
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
  

function comparePragmaWithSchema(pragma: any[], schema: TableSchema, foreignKeyInfo: any[]): boolean {
    if (pragma.length !== schema.columns.length) return false;

    // Compare columns
    for (let i = 0; i < schema.columns.length; i++) {
        const col = schema.columns[i];
        const pragmaCol = pragma.find((p) => p.name === col.name);

        if (!pragmaCol) return false; // Column missing

        if (
        pragmaCol.type !== col.type ||
        !!pragmaCol.notnull !== !!col.notNull ||
        !!pragmaCol.pk !== !!col.primaryKey ||
        pragmaCol.dflt_value !== col.defaultValue
        ) {
        return false;
        }
    }

    // Compare foreign keys
    const existingForeignKeys = foreignKeyInfo.map((fk) => ({
        from: fk.from,
        to: fk.to,
        table: fk.table,
    }));

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
        if (!existingFk) return false; // Foreign key doesn't match
    }

    return true;
}
  
function initializeDatabase() {
    Object.entries(tableSchemas).forEach(([tableName, schema]) => {
        // Get current table columns
        const pragma = db.prepare(`PRAGMA table_info(${tableName})`).all();
        // Get current foreign key constraints
        const foreignKeys = db.prepare(`PRAGMA foreign_key_list(${tableName})`).all();

        if (!comparePragmaWithSchema(pragma, schema, foreignKeys)) {
        console.log(`Updating table: ${tableName}`);
        const createQuery = generateCreateTableQuery(tableName, schema);

        // Optional: Backup old table and migrate data
        db.transaction(() => {
            db.exec(`DROP TABLE IF EXISTS ${tableName}_backup;`);
            db.exec(`ALTER TABLE ${tableName} RENAME TO ${tableName}_backup;`);
            db.exec(createQuery);
            db.exec(`
            INSERT INTO ${tableName} (${schema.columns.map((col: any) => col.name).join(", ")})
            SELECT ${schema.columns.map((col: any) => col.name).join(", ")}
            FROM ${tableName}_backup;
            `);
            db.exec(`DROP TABLE ${tableName}_backup;`);
        })();
        } else {
        console.log(`Table '${tableName}' is up-to-date.`);
        }
    });
}

export { db };
