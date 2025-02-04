import { joinVoiceChannel, createAudioPlayer, createAudioResource } from "@discordjs/voice";
import { CommandAction } from "../Types/Discord";
import ytdl from '@distube/ytdl-core'; //Implement https://github.com/distubejs/ytdl-core/pull/163/files
import { client } from "../DeltaBot";
import { Message, SendableChannels } from "discord.js";
import path from "path";
import { createReadStream } from "fs";

export const playAction:CommandAction = (server, userMessage, words) => {
    if(server === undefined)
        return

    const channel = getSendableChannelFromMessage(userMessage);
    if(words.length < 1)
        return channel?.send("No valid arguments");

    const potentialUrl = words[0];
    console.log(potentialUrl);
    if(!ytdl.validateURL(potentialUrl))
        return channel?.send("invalid URL");
    else {
        if(server.voiceConnection === undefined) {
            joinAction(server, userMessage, words);
        }
        try {
            const filepath = path.join(__dirname, '../../data/Ronin-Pilot-On-Board.mp3');
            console.log('Current file directory:', filepath);
            // const resource = createAudioResource(createReadStream(filepath), {inlineVolume: true});

            const stream = ytdl(potentialUrl, { filter: 'audioonly' });
            const resource = createAudioResource(stream);
            
            const player = createAudioPlayer();
            player.play(resource);
            server.voiceConnection!.subscribe(player);
            channel?.send(`Now playing: ${potentialUrl}`);
        } catch (error) {
            console.error(error);
            channel?.send("There was an error trying to play that audio!");
        }    
    }
}

export const joinAction:CommandAction = (server, userMessage, words) => {
    const member = userMessage.member;
    const channel = getSendableChannelFromMessage(userMessage);
    if(server === undefined || member === undefined || member === null){
        channel?.send("Command invalid in DMs");
        return
    } 
    const voice = member.voice;
    if(voice === undefined || voice === null || voice.channel === undefined || voice.channel === null){
        channel?.send("You need to be connected to a voice channel");
        return
    } 
    const voiceChannel = voice.channel;

    if(server.voiceConnection !== undefined && server.audioChannelId === voiceChannel.id)
        return
    else if(server.voiceConnection !== undefined && server.audioChannelId !== voiceChannel.id)
        server.voiceConnection.destroy();

    server.voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: true
    });
}

export const leaveAction:CommandAction = (server, userMessage, words) => {
    if(server !== undefined && server.voiceConnection !== undefined){
        server.voiceConnection.disconnect();
        server.voiceConnection = undefined;
    }
}

function getSendableChannelFromMessage(message: Message): SendableChannels | null {
    if(message.channel.isSendable())
        return message.channel;
    else
        return null;
}