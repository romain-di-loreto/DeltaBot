import { ConsoleEffects } from './ConsoleColors';
import isOnline from 'is-online';

const connectionTest: () => Promise<boolean> = async () => {
	var connectionStatus: boolean = false;

	console.log('Checking for internet connection...');
	try {
		connectionStatus = await isOnline();
	} catch (error) {
		ConsoleEffects.Red(null, '\tError checking internet connection:', error);
		connectionStatus = false;
	}		

	if(connectionStatus)
		ConsoleEffects.Green(null,'\tSucceeded, internet connection available.');
	else
		ConsoleEffects.Red(null,'\tFailed, no internet connection.');

	return connectionStatus;
}

export async function checkInternetConnection(interval: number): Promise<boolean> {	
	if(await connectionTest())
		return true;

	console.log('Retrying in ' + interval / 1000 + ' seconds...');
	return await new Promise((resolve) => {	
		const intervalId = setInterval(async () => {			
			const isConnected:boolean = await connectionTest();
			if (!isConnected) {			
				console.log('Retrying in ' + interval / 1000 + ' seconds...');
			} else {				
				clearInterval(intervalId);
				resolve(true);
			}
		}, interval);
	});
};