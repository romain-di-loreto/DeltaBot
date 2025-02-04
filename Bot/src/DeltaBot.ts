import Discord, { REST, MessageFlags } from 'discord.js';
import dotenv from 'dotenv';
import { checkInternetConnection } from './tools';
import { EffectsOptions, ConsolePlus } from "./ConsoleColors";
import { DiscordServer, CommandLookupTable } from './Types/Discord';

import { playAction, joinAction, leaveAction } from './Controllers/Audio';

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
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMessageTyping
	]
});
export const servers:DiscordServer[] = [];
export const prefix:string = process.env.BOT_PREFIX!;

const Commands:CommandLookupTable  = {
    play: playAction,
    join: joinAction,
    leave: leaveAction,
}

export async function startup(): Promise<void> {
	console.clear();
	console.log('Starting Deltabot');
	await checkInternetConnection(1);

	console.log('Bot logging in...');
    try {
        await client.login(process.env.BOT_TOKEN)
	    // await client.login("ABCDEFGHIJKLMNOPQRSTUVWX.YZabcd.efghijklmnopqrstuvwxyz012345678_9ABCDE") //Dummy token meant to test error while connecting
        ConsolePlus.Green(null, '\tSucceeded');
    }
    catch(error)
    {
        ConsolePlus.Red(null, '\tFailed');
        throw error;
    }
	
}

function getServerFromMessage(userMessage: Discord.Message): (DiscordServer | undefined) {
    var server = servers.find(srv => srv.discordId == userMessage.guildId)
    if(userMessage.guildId !== null && server === undefined) {
        server = {
            name: userMessage.guild!.name,
            discordId: userMessage.guildId,
            isPlaying: false
        }
        servers.push(server);
    }

    return server;
}

export async function handleCliCommand(userMessage: Discord.Message, command:string, ...words: string[]): Promise<void> {
    const action = Commands[command];
    const server = getServerFromMessage(userMessage);

    if(!userMessage.channel.isSendable())
        return;

    if(action !== undefined) {
        action(server, userMessage, words);
    } else {    
        userMessage.channel.send({
            content: `No such command as '${command}'`,
        });
    }
}
