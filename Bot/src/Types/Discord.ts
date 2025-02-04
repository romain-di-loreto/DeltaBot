import { VoiceConnection, AudioPlayer } from "@discordjs/voice"
import { Message } from "discord.js"

export type BotUser = {
    name: string,
    discordId: string
}

export type DiscordServer = {
    name: string,
    discordId: string,
    lastChannelId?: string | null,
    audioChannelId?: string | null,
    voiceConnection?: VoiceConnection,
    audioPlayer?: AudioPlayer,
    isPlaying: boolean | false,
    queue?: string[] | null
}

export type CommandAction = (server: DiscordServer | undefined, userMessage: Message, words: string[]) => any

export type CommandLookupTable = {
    [name: string]: CommandAction | undefined 
}