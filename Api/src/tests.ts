import { addUser, updateUser, getUserById, getUsers, deleteUser } from "./Models/Users";
import { addServer, updateServer, getServerById, getServers, deleteServer } from "./Models/Server";
import { BotUser, Server } from "./Types/Discord";
import { ConsolePlus, EffectsOptions } from "./Utils/ConsoleColors";

function testUser(): void {

    ConsolePlus.Black([EffectsOptions.Background.White], "Testing User");

    const userToAdd: BotUser = {
        name: "Dummy",
        discordId: "abcdefghijklmnopqrstuvwxyz"
    }

    const userToAdd2: BotUser = {
        name: "Timmy",
        discordId: "01234567890123456789013456"
    }

    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to add Users, should succeed');
    const userAdded = addUser(userToAdd);
    console.log(userAdded);
    const userAdded2 = addUser(userToAdd2);
    console.log(userAdded2);
    
    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to get Users, should succeed');
    const users = getUsers();
    console.log(users);
    
    const userToUpdate: BotUser = {
        id: userAdded!.id!,
        name: "DummyUpdated",
        discordId: "01234567890123456789013456"
    }
    
    const userToUpdate1: BotUser = {
        id: userAdded!.id!,
        name: "DummyUpdated",
        discordId: "98765432109876543210987654"
    }
    
    console.log("\nTrying to get a User by it's id, should succeed");
    const userGot = getUserById(userAdded!.id!);
    console.log(userGot);

    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to update a User, should fail and print null because a UNIQUE constraint on discord_id');
    const userUpdated = updateUser(userToUpdate);
    console.log(userUpdated);

    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to update a User, should succeed');
    const userUpdated1 = updateUser(userToUpdate1);
    console.log(userUpdated1);
        
    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to delete Users, should succeed');
    const userDeleted = deleteUser(userAdded!.id!);
    console.log(userDeleted);
    const userDeleted2 = deleteUser(userAdded2!.id!);
    console.log(userDeleted2);

    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to get deleted Users, should fail and print null');
    const userGot1 = getUserById(userAdded!.id!);
    console.log(userGot1);
    const userGot2 = getUserById(userAdded2!.id!);
    console.log(userGot2);
    console.log('\n\n')
}

function testServer(): void {

    ConsolePlus.Black([EffectsOptions.Background.White], "Testing Server");

    const serverToAdd: Server = {
        name: "Dummy",
        discordId: "abcdefghijklmnopqrstuvwxyz",
        isPlaying: false
    }

    const serverToAdd2: Server = {
        name: "Timmy's server",
        discordId: "01234567890123456789013456",
        isPlaying: false
    }

    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to add Servers, should succeed');
    const serverAdded = addServer(serverToAdd);
    console.log(serverAdded);
    const serverAdded2 = addServer(serverToAdd2);
    console.log(serverAdded2);
    
    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to get Servers, should succeed');
    const severs = getServers();
    console.log(severs);
    
    const serverToUpdate: Server = {
        id: serverAdded!.id!,
        name: "DummyUpdated",
        discordId: "01234567890123456789013456",
        isPlaying: false,
        audioChannelId: "lala"
    }
    
    const serverToUpdate1: Server = {
        id: serverAdded!.id!,
        name: "DummyUpdated",
        discordId: "98765432109876543210987654",
        isPlaying: false,
        audioChannelId: "lala",
        queue: ['test1', 'test2']
    }
    
    console.log("\nTrying to get a Server by it's id, should succeed");
    const serverGot = getServerById(serverAdded!.id!);
    console.log(serverGot);

    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to update a Server, should fail and print null because a UNIQUE constraint on discord_id');
    const serverUpdated = updateServer(serverToUpdate);
    console.log(serverUpdated);

    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to update a Server, should succeed');
    const serverUpdated1 = updateServer(serverToUpdate1);
    console.log(serverUpdated1);
        
    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to delete Servers, should succeed');
    const serverDeleted = deleteServer(serverAdded!.id!);
    console.log(serverDeleted);
    const serverDeleted2 = deleteServer(serverAdded2!.id!);
    console.log(serverDeleted2);

    ConsolePlus.White([EffectsOptions.General.Bright] ,'\nTrying to get deleted Servers, should fail and print null');
    const serverGot1 = getServerById(serverAdded!.id!);
    console.log(serverGot1);
    const serverGot2 = getServerById(serverAdded2!.id!);
    console.log(serverGot2);
    console.log('\n\n')
}

console.clear();
testUser();
testServer();