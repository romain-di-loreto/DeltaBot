import { EffectsOptions, ConsoleEffects} from './ConsoleColors.js';
import isOnline from 'is-online';

const connectionTest = async () => {
	var connectionStatus = false;

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

export const checkInternetConnection = async (interval) => {	
	if(await connectionTest())
		return true;

	console.log('Retrying in ' + interval / 1000 + ' seconds...');
	return await new Premise((resolve) => {	
		const intervalId = setInterval(async () => {			
			isConnected = await connectionTest();
			if (!isConnected) {			
				console.log('Retrying in ' + interval / 1000 + ' seconds...');
			} else {				
				clearInterval(intervalId);
				resolve(true);
			}
		}, interval);
	});
};