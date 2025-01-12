export type BotUser = {
    id?: number | null,
    name: string,
    discordId: string
}

export type Server = {
    id?: number | null,
    name: string,
    discordId: string,
    lastChannelId?: string | null,
    audioChannelId?: string | null,
    isPlaying: boolean,
    queue?: string[] | null
}

export type DB_User = {
    id: number,
    name: string,
    discord_id: string
}

export type DB_Server = {
    id: number,
    name: string,
    discord_id: string,
    last_channel_id: string | null,
    audio_channel_id: string | null,
    is_playing: boolean | null,
    queue_json: string | null
}