import { EffectsOptions, ConsoleEffects} from './ConsoleColors.js';

var exitWasTriggered = false;

export const setExitHandler = () => {
    const exitHandler = (options, exitCode) => {
        const previousState = exitWasTriggered;
        exitWasTriggered = true;
        if (!previousState && exitCode === 'SIGINT') ConsoleEffects.Red([EffectsOptions.Reset], 'Interrupting the bot');
        else if (!previousState && (exitCode || exitCode === 0)) ConsoleEffects.Red([EffectsOptions.Reset], 'Bot stopped with exit code: ', exitCode);
        if (options.cleanup) cleanup();
        if (!previousState && options.exit) process.exit();
    }
        
    process.stdin.resume(); // so the program will not close instantly
    
    // do something when app is closing
    process.on('exit', exitHandler.bind(null,{cleanup:true}));
    
    // catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, {exit:true}));
    
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
    process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
    
    // catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, {exit:true}));   
}

const cleanup = () => {
    console.log('Starting cleanup...');
}