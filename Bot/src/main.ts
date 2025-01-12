import { client, prefix, startup, handleCliCommand } from "./DeltaBot";
import { Events } from "discord.js";
import { ConsolePlus } from "./ConsoleColors";
import { setExitHandler } from './exit';

setExitHandler();

startup();

client.once(Events.ClientReady, (readyClient): void => {
    ConsolePlus.Cyan(null, `${readyClient.user.displayName} is now online`);
});

client.on(Events.MessageCreate, (createdMessage): void => {
    if(createdMessage.author.bot || !createdMessage.content.startsWith(prefix)) return
    
    const [command, ...words] = createdMessage.content.substring(prefix.length).trimEnd().split(" ")
    handleCliCommand(createdMessage, command, ...words)
})
