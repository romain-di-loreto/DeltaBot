export type BotUser = {
    name: string,
    discordId: string
}

export type Server = {
    name: string,
    discordId: string,
    lastChannelId?: string | null,
    audioChannelId?: string | null,
    isPlaying: boolean,
    queue?: string[] | null
}