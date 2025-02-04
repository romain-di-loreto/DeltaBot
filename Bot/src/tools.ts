import { ConsolePlus } from './ConsoleColors';
import isReachable from 'is-reachable';

const connectionTest: () => Promise<boolean> = async () => {
    let connectionStatus: boolean = false;

    console.log('Checking for internet connection...');
    try {
        connectionStatus = await isReachable('https://www.google.com');
    } catch (error) {
        ConsolePlus.Red(null, '\tError checking internet connection:', error);
        connectionStatus = false;
    }

    if (connectionStatus) {
        ConsolePlus.Green(null, '\tSucceeded, internet connection available.');
    } else {
        ConsolePlus.Red(null, '\tFailed, no internet connection.');
    }

    return connectionStatus;
};

export async function checkInternetConnection(interval: number): Promise<boolean> {
    if (await connectionTest()) {
        return true;
    }

    console.log('Retrying in ' + interval / 1000 + ' seconds...');
    return await new Promise((resolve) => {
        const intervalId = setInterval(async () => {
            const isConnected: boolean = await connectionTest();
            if (!isConnected) {
                console.log('Retrying in ' + interval / 1000 + ' seconds...');
            } else {
                clearInterval(intervalId);
                resolve(true);
            }
        }, interval);
    });
}