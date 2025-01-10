export enum ColumnType {
    INTEGER = "INTEGER",
    TEXT = "TEXT",
    REAL = "REAL",
    BLOB = "BLOB",
    NUMERIC = "NUMERIC",
    BOOLEAN = "BOOLEAN", // Custom type for boolean representation
}

export enum ForeignKeyAction {
    CASCADE = "CASCADE",
    SET_NULL = "SET NULL",
    SET_DEFAULT = "SET DEFAULT",
    RESTRICT = "RESTRICT",
    NO_ACTION = "NO ACTION",
}

export enum ForeignKeyMatch {
    NONE = "NONE",
    PARTIAL = "PARTIAL",
    FULL = "FULL",
}

export type ForeignKey = {
    table: string;
    column: string;
    onDelete?: ForeignKeyAction;
    onUpdate?: ForeignKeyAction;
    match?: ForeignKeyMatch;
};

export type Column = {
    name: string;
    type: ColumnType; // Use the enum here for type safety
    notNull?: boolean;
    primaryKey?: boolean;
    unique?: boolean;
    defaultValue?: string;
    foreignKey?: ForeignKey;
};

export type TableSchema = {
    columns: Column[];
};

export type TableSchemas = {
    [tableName: string]: TableSchema;
};

export type TableInfo = {

}

export type ForeignKeyList = {
    id: number,
    seq: number,
    table: string,
    from: string,
    to: string, 
    on_update: string,
    on_delete: string,
    match: string | 'NONE'
}

export const C_ID:Column = { 
    name: "id", 
    type: ColumnType.INTEGER, 
    primaryKey: true, 
    notNull: true 
}

export const C_NAME:Column = { 
    name: "name", 
    type: ColumnType.TEXT, 
    notNull: true 
}