import { joinVoiceChannel, createAudioPlayer } from '@discordjs/voice';
import Discord, { REST } from 'discord.js';
import dotenv from 'dotenv';
import { checkInternetConnection } from './tools.js';
import { EffectsOptions, ConsoleEffects } from "./ConsoleColors.js";

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
export const prefix = process.env.BOT_PREFIX;
export var isConnected = false;

export const startup = async () => {
	console.clear();
	console.log('Starting Deltabot');
	await checkInternetConnection();

	console.log('Bot logging in...');
    try {
        await client.login(process.env.BOT_TOKEN)
	    // await client.login("ABCDEFGHIJKLMNOPQRSTUVWX.YZabcd.efghijklmnopqrstuvwxyz012345678_9ABCDE") //Dummy token meant to test error while connecting
        ConsoleEffects.Green(null, '\tSucceeded');
    }
    catch(e)
    {
        ConsoleEffects.Red(null, '\tFailed');
        throw e
    }
	
}

export const handleCliCommand = async (userMessage, command, ...words) => {
    console.log(userMessage)
    console.log(command)
    console.log(words)
}
