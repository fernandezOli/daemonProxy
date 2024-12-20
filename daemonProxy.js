const http = require('http');

let httpServerPort = 3000; // default port
const configFile = require("./config/proxy.json"); // default config file

let title = "Daemon Proxy - v0.1.0-alpha";
let subTitle1 = "Started on port: " + httpServerPort;
let maxLength = title.length;
if (subTitle1.length > maxLength) maxLength = subTitle1.length;
const stars = "─".repeat(maxLength + 6);
const spaces = " ".repeat(maxLength + 6);
subTitle1 = subTitle1 + " ".repeat(maxLength - subTitle1.length);

console.log("┌" + stars + "┐");
console.log("│" + spaces + "│".replaceAll(' ','\u2002'));
console.log(("│   " + title + "   │").replaceAll(' ','\u2002'));
console.log("│" + spaces + "│".replaceAll(' ','\u2002'));
console.log(("│   " + subTitle1 + "   │").replaceAll(' ','\u2002'));
console.log("│" + spaces + "│".replaceAll(' ','\u2002'));
console.log("└" + stars + "┘");
console.log('');

http.createServer(async function (req, res) {
	httpServer(req, res);
}).listen(httpServerPort);

async function httpServer(req, res) {

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

	try {
		if (req.Method === "OPTIONS") {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end('');
		}
		else {
			if (req.method === 'GET') {
				let _body = "ok";
				if(req.url.match("/json")) _body = await getJsons();
				res.writeHead(200, { 'Content-Length': Buffer.byteLength(_body), 'Content-Type': 'text/plain' });
				res.end(_body);
			} else {
				res.writeHead(405, { 'Content-Length': Buffer.byteLength('Method Not Allowed'), 'Content-Type': 'text/plain' });
				res.end('Method Not Allowed');
			}
		}
	} catch (error) {
		console.error('ERROR server [' + error.code + ']: ', error);
	}
}

// get json file from daemons
async function getJsons() {
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
