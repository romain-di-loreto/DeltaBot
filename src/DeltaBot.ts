import { joinVoiceChannel, createAudioPlayer } from '@discordjs/voice';
import Discord, { REST } from 'discord.js';
import dotenv from 'dotenv';
import { checkInternetConnection } from './tools';
import { EffectsOptions, ConsoleEffects } from "./ConsoleColors";

dotenv.config();

export const client = new Discord.Client({ 
	intents: 
	[
		Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.MessageContent
	]
});
export const servers = [];
export const prefix:string = process.env.BOT_PREFIX!;
export var isConnected = false;

export async function startup(): Promise<void> {
	console.clear();
	console.log('Starting Deltabot');
	await checkInternetConnection(1);

	console.log('Bot logging in...');
    try {
        await client.login(process.env.BOT_TOKEN)
	    // await client.login("ABCDEFGHIJKLMNOPQRSTUVWX.YZabcd.efghijklmnopqrstuvwxyz012345678_9ABCDE") //Dummy token meant to test error while connecting
        ConsoleEffects.Green(null, '\tSucceeded');
    }
    catch(error)
    {
        ConsoleEffects.Red(null, '\tFailed');
        throw error;
    }
	
}

export async function handleCliCommand (userMessage: Discord.Message, command:string, ...words: string[]): Promise<void> {
    console.log(userMessage)
    console.log(command)
    console.log(words)
}
