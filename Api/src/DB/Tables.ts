import { TableSchemas, ColumnType, C_ID, C_NAME } from "../Types/Database";

const schemas: TableSchemas = {
    users: {
        columns: [
            C_ID,
            C_NAME,
            { name: "discord_id", type: ColumnType.TEXT, unique: true, notNull: true }
        ]
    },
    servers: {
        columns: [
            C_ID,
            C_NAME,
            { name: "discord_id", type: ColumnType.TEXT, unique: true, notNull: true },
            { name: "last_channel_id", type: ColumnType.TEXT },
            { name: "audio_channel_id", type: ColumnType.TEXT },
            { name: "is_playing", type: ColumnType.BOOLEAN, defaultValue: "0" },
            { name: "queue_json", type: ColumnType.TEXT }
        ]
    },
    dcs_profiles: {
        columns: [
            C_ID,
            { name: "user_id", type: ColumnType.INTEGER, unique: true, notNull: true, foreignKey: { table: "users", column: "id" } },
            { name: "name", type: ColumnType.TEXT },
            { name: "modex", type: ColumnType.TEXT },
        ]
    },
    dcs_planes: {
        columns: [
            C_ID,
            C_NAME
        ]
    },
    dcs_maps: {
        columns: [
            C_ID,
            C_NAME
        ]
    },
    dcs_flight_groups: {
        columns: [
            C_ID,
            C_NAME
        ]
    },
    dcs_flight_member: {
        columns: [
            { name: "profile_id", type: ColumnType.INTEGER, notNull: true },
            { name: "group_id", type: ColumnType.INTEGER, notNull: true, foreignKey: { table: "dcs_flight_groups", column: "id" } },
            { name: "plane_id", type: ColumnType.INTEGER, notNull: true, foreignKey: { table: "dcs_planes", column: "id" } },
            { name: "position", type: ColumnType.INTEGER }
        ]
    },
    dcs_session: {
        columns: [
            C_ID,
            { name: "name", type: ColumnType.TEXT },
            { name: "plane_id", type: ColumnType.INTEGER, notNull: true, foreignKey: { table: "dcs_planes", column: "id" } },
            { name: "map_id", type: ColumnType.INTEGER, notNull: true, foreignKey: { table: "dcs_maps", column: "id" } },
            { name: "role", type: ColumnType.TEXT, defaultValue: "'N/A'"},
            { name: "flight_group_id", type: ColumnType.INTEGER, foreignKey: { table: "dcs_flight_groups", column: "id" } }
        ]
    }
}

export default schemas;