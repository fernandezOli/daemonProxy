//import daemonProxy from '../daemonProxy';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    await getJsons()
);

// get json file from daemons
export async function getJsons() {
	let jsonDaemons = [];
	for (let i = 0; i < configFile.daemonList.length; i++) {
		try {
			const response = await fetch(configFile.daemonList[i]);
			if (!response.ok) continue;
			const loadedConfig = await response.json();
			jsonDaemons.push(loadedConfig);
		} catch(error) {
			if (error.cause.code === 'ECONNREFUSED') continue;
			console.error('-- ERROR json (code):', error.cause.code);
			console.error('-- ERROR json (cause):', error.cause);
			//console.error('-- ERROR json:', error);
			continue;
		}
	}
	return JSON.stringify(jsonDaemons);
}
