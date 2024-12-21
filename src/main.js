import { client, prefix, startup, handleCliCommand } from "./DeltaBot.js";
import { Events } from "discord.js";
import { EffectsOptions, ConsoleEffects } from "./ConsoleColors.js";
import { setExitHandler } from './exit.js';

setExitHandler();

startup();

client.once(Events.ClientReady, readyClient => {
    ConsoleEffects.Cyan(null, `${client.user.displayName} is now online`);
});

client.on(Events.MessageCreate, createdMessage => {
    if(createdMessage.author.bot || !createdMessage.content.startsWith(prefix)) return
    
    const command = createdMessage.content.substring(prefix.length).trimEnd().split(" ")
    handleCliCommand(createdMessage, ...command)
})
